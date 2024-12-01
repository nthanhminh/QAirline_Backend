import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { DatabaseModule } from '@modules/databases/databases.module';
import { UserModule } from '@modules/users/user.module';
import { AuthModule } from '@modules/auth/auth.module';
import { MailerModule } from '@nestjs-modules/mailer';
import { BullModule } from '@nestjs/bullmq';
import { HttpErrorFilter } from './interceptors/httpError.filter';
import { APP_FILTER, APP_INTERCEPTOR } from '@nestjs/core';
import { TransformInterceptor } from './interceptors/transform.interceptor';
import { AcceptLanguageResolver, I18nModule, QueryResolver } from 'nestjs-i18n';
import { AirportModule } from '@modules/airports/airport.module';
import { PlaneModule } from '@modules/planes/plane.module';
import { SeatModule } from '@modules/seatsForPlaneType/seats.module';
import { SeatClassInfoModule } from '@modules/seatClassInfo/seatClassInfo.module';
import { FlightModule } from '@modules/flights/flight.module';
import { FlightPriceModule } from '@modules/priceForFlight/priceForFlight.module';
import { MenuModule } from '@modules/menu/food.module';
import { ServiceModule } from '@modules/services/services.module';
import { TicketModule } from '@modules/ticket/ticket.module';
import { BookingModule } from '@modules/booking/booking.module';
import { RedisCacheModule } from '@modules/redis/redis.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    BullModule.forRootAsync({
      imports: [ConfigModule],  
      inject: [ConfigService],  
      useFactory: async (configService: ConfigService) => ({
        connection: {
          url: configService.get<string>('REDIS_URL'),
        },
      }),
    }),
    MailerModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        transport: {
          host: configService.get<string>('MAIL_HOST'),
          service: 'gmail',
          secure: false,
          auth: {
            user: configService.get<string>('MAIL_USER'),
            pass: configService.get<string>('MAIL_PASSWORD'),
          },
          logger: true,
        },
      }),
      inject: [ConfigService],
    }),
    I18nModule.forRoot({
      fallbackLanguage: 'en',
      loaderOptions: {
        path: 'src/i18n/',
        watch: true,
      },
      resolvers: [
        { use: QueryResolver, options: ['lang'] },
        AcceptLanguageResolver,
      ],
    }),
    DatabaseModule,
    RedisCacheModule,
    UserModule,
    AuthModule,
    AirportModule,
    PlaneModule,
    SeatModule,
    SeatClassInfoModule,
    FlightModule,
    FlightPriceModule,
    MenuModule,
    ServiceModule,
    BookingModule,
    TicketModule
  ],
  controllers: [AppController],
  providers: [
    AppService,
    AppService,
		{
			provide: APP_INTERCEPTOR,
			useClass: TransformInterceptor,
		},
		{
			provide: APP_FILTER,
			useClass: HttpErrorFilter,
		},
  ],
})
export class AppModule {}
