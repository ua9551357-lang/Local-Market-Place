import { Controller, Post, Body, Res, Req, UseGuards, HttpCode, Get, UseInterceptors, BadRequestException, UploadedFile,Patch } from '@nestjs/common';
import type { Response, Request } from 'express';
import { AuthService } from './auth.service';
import { SignupDto } from './dto/signup.dto';
import { LoginDto } from './dto/login.dto';
import { JwtRefreshGuard } from '../common/guards/jwt-refresh.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { GoogleAuthGuard } from 'src/common/guards/google-auth.guards';
import { RegisterProviderDto } from './dto/register-provider.dto';
import { ForgotPasswordDto } from './dto/forgot-password.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';

const cookieOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'lax' as const,
};

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Get('me')
  @UseGuards(JwtAuthGuard)
  async me(@CurrentUser() user: any) {
    return this.authService.getCurrentUser(user.userId);
  }

  @Post('signup')
  async signup(@Body() dto: SignupDto, @Res({ passthrough: true }) res: Response) {
    const { accessToken, refreshToken, user } = await this.authService.signup(dto);
    res.cookie('accessToken', accessToken, { ...cookieOptions, maxAge: 15 * 60 * 1000 });
    res.cookie('refreshToken', refreshToken, { ...cookieOptions, maxAge: 7 * 24 * 60 * 60 * 1000 });
    return { user };
  }

  @Post('login')
@HttpCode(200)
async login(@Body() dto: LoginDto, @Res({ passthrough: true }) res: Response) {
  const { accessToken, refreshToken, user, providerStatus } = await this.authService.login(dto);
  res.cookie('accessToken', accessToken, { ...cookieOptions, maxAge: 15 * 60 * 1000 });
  res.cookie('refreshToken', refreshToken, { ...cookieOptions, maxAge: 7 * 24 * 60 * 60 * 1000 });
  return { user, providerStatus };
}

  @Post('refresh')
  @HttpCode(200)
  @UseGuards(JwtRefreshGuard)
  async refresh(@CurrentUser() user: any, @Res({ passthrough: true }) res: Response) {
    const tokens = await this.authService.refresh(user.userId, user.email, user.role);
    res.cookie('accessToken', tokens.accessToken, { ...cookieOptions, maxAge: 15 * 60 * 1000 });
    res.cookie('refreshToken', tokens.refreshToken, { ...cookieOptions, maxAge: 7 * 24 * 60 * 60 * 1000 });
    return { message: 'Token refreshed' };
  }

  @Post('logout')
  @HttpCode(200)
  async logout(@Res({ passthrough: true }) res: Response) {
    res.clearCookie('accessToken');
    res.clearCookie('refreshToken');
    return { message: 'Logged out' };
  }

  @Post('register-provider')
  @UseInterceptors(
    FileInterceptor('avatar', {
      storage: diskStorage({
        destination: './uploads/avatars',
        filename: (req, file, cb) => {
          const unique = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
          cb(null, `${unique}${extname(file.originalname)}`);
        },
      }),
      fileFilter: (req, file, cb) => {
        if (!file.mimetype.match(/\/(jpg|jpeg|png|webp)$/)) {
          return cb(new BadRequestException('Only image files (jpg, png, webp) are allowed'), false);
        }
        cb(null, true);
      },
      limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
    }),
  )
  async registerProvider(
    @UploadedFile() file: Express.Multer.File,
    @Body() dto: RegisterProviderDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    const avatarUrl = file ? `/uploads/avatars/${file.filename}` : undefined;
    const { accessToken, refreshToken, user } = await this.authService.registerProvider(dto, avatarUrl);

    res.cookie('accessToken', accessToken, { ...cookieOptions, maxAge: 15 * 60 * 1000 });
    res.cookie('refreshToken', refreshToken, { ...cookieOptions, maxAge: 7 * 24 * 60 * 60 * 1000 });

    return { user };
  }

  @Post('forgot-password')
  @HttpCode(200)
  async forgotPassword(@Body() dto: ForgotPasswordDto) {
    return this.authService.forgotPassword(dto.email);
  }

  @Post('reset-password')
  @HttpCode(200)
  async resetPassword(@Body() dto: ResetPasswordDto) {
    return this.authService.resetPassword(dto.email, dto.code, dto.newPassword);
  }

  @Get('google')
  @UseGuards(GoogleAuthGuard)
  async googleAuth() {
    // Guard automatically redirect karta hai Google ke consent screen pe
  }

  @Get('google/callback')
  @UseGuards(GoogleAuthGuard)
  async googleAuthCallback(@Req() req: any, @Res() res: Response) {
    const { accessToken, refreshToken } = await this.authService.validateOAuthUser({
      googleId: req.user.googleId,
      email: req.user.email,
      name: req.user.name,
      avatarUrl: req.user.avatarUrl,
    });
    res.cookie('accessToken', accessToken, { ...cookieOptions, maxAge: 15 * 60 * 1000 });
    res.cookie('refreshToken', refreshToken, { ...cookieOptions, maxAge: 7 * 24 * 60 * 60 * 1000 });
    res.redirect(process.env.FRONTEND_URL || 'http://localhost:3000');
  }

  @Patch('change-password')
@UseGuards(JwtAuthGuard)
changePassword(@CurrentUser() user: any, @Body() dto: { currentPassword: string; newPassword: string }) {
  return this.authService.changePassword(user.userId, dto.currentPassword, dto.newPassword);
}
}