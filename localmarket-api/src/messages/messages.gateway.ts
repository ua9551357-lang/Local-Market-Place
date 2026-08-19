import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  MessageBody,
  ConnectedSocket,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { UseGuards } from '@nestjs/common';
import { Server, Socket } from 'socket.io';
import { JwtService } from '@nestjs/jwt';
import { MessagesService } from './messages.service';

@WebSocketGateway({
  cors: {
    origin: process.env.FRONTEND_URL || 'http://localhost:3000',
    credentials: true,
  },
})
export class MessagesGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  constructor(
    private messagesService: MessagesService,
    private jwtService: JwtService,
  ) {}

  async handleConnection(client: Socket) {
    try {
      const token = this.extractToken(client);
      if (!token) {
        client.disconnect();
        return;
      }
      const payload = await this.jwtService.verifyAsync(token, {
        secret: process.env.JWT_ACCESS_SECRET,
      });
      client.data.user = { userId: payload.sub, email: payload.email, role: payload.role };
      client.join(`user:${payload.sub}`);
    } catch {
      client.disconnect();
    }
  }

  handleDisconnect(client: Socket) {
    // cleanup if needed
  }

  private extractToken(client: Socket): string | null {
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

  @SubscribeMessage('joinThread')
  handleJoinThread(@ConnectedSocket() client: Socket, @MessageBody() threadId: string) {
    client.join(`thread:${threadId}`);
  }

  @SubscribeMessage('sendMessage')
  async handleSendMessage(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: { threadId: string; receiverId: string; body: string },
  ) {
    const senderId = client.data.user.userId;
    const message = await this.messagesService.sendMessage(
      data.threadId,
      senderId,
      data.receiverId,
      data.body,
    );

    // broadcast to everyone in the thread room
    this.server.to(`thread:${data.threadId}`).emit('newMessage', message);
    // also notify receiver's personal room (for unread badges elsewhere)
    this.server.to(`user:${data.receiverId}`).emit('threadUpdated', { threadId: data.threadId });

    return message;
  }

  @SubscribeMessage('markRead')
  async handleMarkRead(@ConnectedSocket() client: Socket, @MessageBody() threadId: string) {
    const userId = client.data.user.userId;
    await this.messagesService.markAsRead(threadId, userId);
    this.server.to(`thread:${threadId}`).emit('messagesRead', { threadId, userId });
  }
}