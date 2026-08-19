import { Injectable, CanActivate, ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Socket } from 'socket.io';

@Injectable()
export class WsAuthGuard implements CanActivate {
  constructor(private jwtService: JwtService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const client: Socket = context.switchToWs().getClient();
    const token = this.extractToken(client);

    if (!token) throw new UnauthorizedException('No token provided');

    try {
      const payload = await this.jwtService.verifyAsync(token, {
        secret: process.env.JWT_ACCESS_SECRET,
      });
      client.data.user = { userId: payload.sub, email: payload.email, role: payload.role };
      return true;
    } catch {
      throw new UnauthorizedException('Invalid token');
    }
  }

  private extractToken(client: Socket): string | null {
    // cookies parsed from handshake headers
    const cookieHeader = client.handshake.headers.cookie;
    if (!cookieHeader) return null;

    const cookies = Object.fromEntries(
      cookieHeader.split('; ').map((c) => {
        const [key, ...v] = c.split('=');
        return [key, v.join('=')];
      }),
    );

    return cookies['accessToken'] || null;
  }
}