import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import { JwtModule } from '@nestjs/jwt';
import { ProfileModule } from './user-service/profile/profile.module';
import { GameModule } from './game-service/game/game.module';
import { BlogModule } from './blog-service/blog/blog.module';
import { CommentModule } from './blog-service/comment/comment.module';
import { CategoryModule } from './game-service/category/category.module';
import { SystemRequirementModule } from './game-service/system_requirement/system_requirement.module';
import { PaymentModule } from './payment-service/payment/payment.module';
import { WebWalletModule } from './payment-service/web-wallet/web-wallet.module';
import { TransactionModule } from './payment-service/transaction/transaction.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    MongooseModule.forRootAsync({
      connectionName: 'USER_DB',
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        uri: configService.get<string>('USER_MONGO_URL'),
      }),
      inject: [ConfigService],
    }),
    MongooseModule.forRootAsync({
      connectionName: 'GAME_DB',
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        uri: configService.get<string>('GAME_MONGO_URL'),
      }),
      inject: [ConfigService],
    }),
    MongooseModule.forRootAsync({
      connectionName: 'PAYMENT_DB',
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        uri: configService.get<string>('PAYMENT_MONGO_URL'),
      }),
      inject: [ConfigService],
    }),
    JwtModule.register({
      global: true,
      secret: process.env.JWT_SECRET_KEY,
      signOptions: { expiresIn: '10m' },
    }),
    AuthModule,
    ProfileModule,
    GameModule,
    BlogModule,
    CommentModule,
    CategoryModule,
    SystemRequirementModule,
    PaymentModule,
    WebWalletModule,
    TransactionModule,
  ],
})
export class AppModule {}
