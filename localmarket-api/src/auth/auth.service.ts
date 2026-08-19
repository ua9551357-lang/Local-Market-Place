import { Injectable, ConflictException, UnauthorizedException, BadRequestException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import * as crypto from 'crypto';
import axios from 'axios';
import { PrismaService } from '../prisma/prisma.service';
import { SignupDto } from './dto/signup.dto';
import { LoginDto } from './dto/login.dto';
import { NotificationsService } from 'src/notifications/notifications.service';
import { RegisterProviderDto } from './dto/register-provider.dto';
import { MailService } from '../mail/mail.service';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
    private notificationsService: NotificationsService,
    private mailService: MailService,
  ) {}

  private async generateTokens(userId: string, email: string, role: string) {
    const payload = { sub: userId, email, role };

    const accessToken = await this.jwtService.signAsync(payload, {
      secret: process.env.JWT_ACCESS_SECRET,
      expiresIn: process.env.JWT_ACCESS_EXPIRY || '1h',
    } as any);

    const refreshToken = await this.jwtService.signAsync(payload, {
      secret: process.env.JWT_REFRESH_SECRET,
      expiresIn: process.env.JWT_REFRESH_EXPIRY || '7d',
    } as any);

    return { accessToken, refreshToken };
  }

  async signup(dto: SignupDto) {
    const existing = await this.prisma.user.findUnique({ where: { email: dto.email } });
    if (existing) throw new ConflictException('Email already registered');

    const passwordHash = await bcrypt.hash(dto.password, 10);

    const user = await this.prisma.user.create({
      data: {
        name: dto.name,
        email: dto.email,
        passwordHash,
        phone: dto.phone,
        role: dto.role,
        city: dto.city,
      },
    });

    const tokens = await this.generateTokens(user.id, user.email, user.role);

    return {
      user: { id: user.id, name: user.name, email: user.email, role: user.role, avatarUrl: user.avatarUrl },
      ...tokens,
    };
  }

  async login(dto: LoginDto) {
  const user = await this.prisma.user.findUnique({ where: { email: dto.email } });
  if (!user) throw new UnauthorizedException('Invalid credentials');

  const passwordValid = await bcrypt.compare(dto.password, user.passwordHash);
  if (!passwordValid) throw new UnauthorizedException('Invalid credentials');

  const tokens = await this.generateTokens(user.id, user.email, user.role);

  // check if this user has a pending/rejected provider application
  const providerProfile = await this.prisma.providerProfile.findUnique({
    where: { userId: user.id },
    select: { status: true },
  });

  return {
    user: { id: user.id, name: user.name, email: user.email, role: user.role, avatarUrl: user.avatarUrl },
    providerStatus: providerProfile?.status || null,
    ...tokens,
  };
}

  async refresh(userId: string, email: string, role: string) {
    const tokens = await this.generateTokens(userId, email, role);
    return tokens;
  }

  async getCurrentUser(userId: string) {
    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    if (!user) throw new UnauthorizedException();
    return { id: user.id, name: user.name, email: user.email, role: user.role, avatarUrl: user.avatarUrl };
  }

  async registerProvider(dto: RegisterProviderDto, avatarUrl?: string) {
    const existing = await this.prisma.user.findUnique({ where: { email: dto.email } });
    if (existing) throw new ConflictException('Email already registered');

    const passwordHash = await bcrypt.hash(dto.password, 10);

    const result = await this.prisma.$transaction(async (tx) => {
      const user = await tx.user.create({
        data: {
          name: dto.name,
          email: dto.email,
          passwordHash,
          phone: dto.phone,
          city: dto.city,
          avatarUrl,
          role: 'customer', // stays customer until admin approves the provider application
        },
      });

      const profile = await tx.providerProfile.create({
        data: {
          userId: user.id,
          categoryId: dto.categoryId,
          bio: dto.bio,
          experienceYears: dto.experienceYears,
          priceFrom: dto.priceFrom,
          location: dto.address,
          status: 'pending',
        },
      });

      return { user, profile };
    });

    const admins = await this.prisma.user.findMany({ where: { role: 'admin' } });
    await Promise.all(
      admins.map((admin) =>
        this.notificationsService.create(admin.id, 'provider_application', {
          providerId: result.profile.id,
          applicantName: result.user.name,
        }),
      ),
    );

    const tokens = await this.generateTokens(result.user.id, result.user.email, result.user.role);

    return {
      user: { id: result.user.id, name: result.user.name, email: result.user.email, role: result.user.role },
      ...tokens,
    };
  }

  async validateOAuthUser(profile: { googleId: string; email: string; name: string; avatarUrl?: string }) {
    let user = await this.prisma.user.findFirst({
      where: {
        OR: [{ googleId: profile.googleId }, { email: profile.email }],
      },
    });

    if (!user) {
      const passwordHash = await bcrypt.hash(crypto.randomBytes(16).toString('hex'), 10);
      user = await this.prisma.user.create({
        data: {
          email: profile.email,
          name: profile.name,
          avatarUrl: profile.avatarUrl,
          googleId: profile.googleId,
          passwordHash, // dummy password, OAuth users ise use nahi karte
          role: 'customer',
        },
      });
    } else if (!user.googleId) {
      user = await this.prisma.user.update({
        where: { id: user.id },
        data: { googleId: profile.googleId },
      });
    }

    return this.generateTokens(user.id, user.email, user.role);
  }

  async forgotPassword(email: string) {
    const user = await this.prisma.user.findUnique({ where: { email } });
    // Security: user na mile tab bhi same success message do (email enumeration se bachne ke liye)
    if (!user) return { message: 'If this email is registered, a code has been sent.' };

    const code = Math.floor(100000 + Math.random() * 900000).toString(); // 6-digit code
    const expiry = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

    await this.prisma.user.update({
      where: { id: user.id },
      data: { resetCode: code, resetCodeExpiry: expiry },
    });

    await this.mailService.sendResetCode(email, code);
    return { message: 'If this email is registered, a code has been sent.' };
  }

  async resetPassword(email: string, code: string, newPassword: string) {
    const user = await this.prisma.user.findUnique({ where: { email } });
    if (!user || user.resetCode !== code || !user.resetCodeExpiry || user.resetCodeExpiry < new Date()) {
      throw new BadRequestException('Invalid or expired code');
    }

    const passwordHash = await bcrypt.hash(newPassword, 10);
    await this.prisma.user.update({
      where: { id: user.id },
      data: { passwordHash, resetCode: null, resetCodeExpiry: null },
    });

    return { message: 'Password reset successful' };
  }

  async verifyRecaptcha(token: string) {
    const { data } = await axios.post('https://www.google.com/recaptcha/api/siteverify', null, {
      params: {
        secret: process.env.RECAPTCHA_SECRET_KEY,
        response: token,
      },
    });
    if (!data.success) {
      throw new BadRequestException('reCAPTCHA verification failed');
    }
  }
  async changePassword(userId: string, currentPassword: string, newPassword: string) {
  const user = await this.prisma.user.findUnique({ where: { id: userId } });
  if (!user) throw new UnauthorizedException();

  const valid = await bcrypt.compare(currentPassword, user.passwordHash);
  if (!valid) throw new UnauthorizedException('Current password is incorrect');

  const passwordHash = await bcrypt.hash(newPassword, 10);
  await this.prisma.user.update({ where: { id: userId }, data: { passwordHash } });

  return { message: 'Password updated successfully' };
}
}