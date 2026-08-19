import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { CategoriesModule } from './categories/categories.module';
import { ProvidersModule } from './providers/providers.module';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ServicesModule } from './services/services.module';
import { ReviewsModule } from './reviews/reviews.module';
import { BookingsModule } from './bookings/bookings.module';
import { PaymentsModule } from './payments/payments.module';
import { UsersModule } from './users/users.module';
import { MessagesModule } from './messages/messages.module';
import { AdminModule } from './admin/admin.module';
import { VoiceModule } from './voice/voice.module';
import { NotificationsModule } from './notifications/notifications.module';
import { MailService } from './mail/mail.service';
import { MailModule } from './mail/mail.module';
import { AvailabilityModule } from './availability/availability.module';
import { PayoutsModule } from './payouts/payouts.module';
import { SupportModule } from './support/support.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    PrismaModule,
    AuthModule,
    CategoriesModule,
    ProvidersModule,
    ServicesModule,
    ReviewsModule,
    BookingsModule,
    PaymentsModule,
    UsersModule,
    MessagesModule,
    AdminModule,
    VoiceModule,
    NotificationsModule,
    MailModule,
    AvailabilityModule,
    PayoutsModule,
    SupportModule,
  ],
  controllers: [AppController],
  providers: [AppService, MailService],
})
export class AppModule {}