import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import { JwtModule } from '@nestjs/jwt';
import { ProfileModule } from './user-service/profile/profile.module';
import { GameModule } from './game-service/game/game.module';
import { UserGameItemModule } from './game-service/user-game-item/user-game-item.module';
import { GameItemModule } from './game-service/game-item/game-item.module';
import { BlogModule } from './blog-service/blog/blog.module';
import { CommentModule } from './blog-service/comment/comment.module';
import { CategoryModule } from './game-service/category/category.module';
import { SystemRequirementModule } from './game-service/system_requirement/system_requirement.module';
import { PaymentModule } from './payment-service/payment/payment.module';
import { WebWalletModule } from './payment-service/web-wallet/web-wallet.module';
import { TransactionModule } from './payment-service/transaction/transaction.module';
import { CartModule } from './payment-service/cart/cart.module';
import { CartItemModule } from './payment-service/cart-item/cart-item.module';
import { OrderModule } from './payment-service/order/order.module';
import { OrderDetailModule } from './payment-service/order-detail/order-detail.module';
import { GameKeyModule } from './game-service/game-key/game-key.module';
import { AiModule } from './ai/ai.module';
import { LibraryGameModule } from './game-service/library-game/library-game.module';
import { GameSessionModule } from './game-service/game-session/game-session.module';

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
    MongooseModule.forRootAsync({
      connectionName: 'BLOG_DB',
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        uri: configService.get<string>('BLOG_MONGO_URL'),
      }),
      inject: [ConfigService],
    }),
    MongooseModule.forRootAsync({
      connectionName: 'AI_DB',
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        uri: configService.get<string>('AI_MONGO_URL'),
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
    GameKeyModule,
    UserGameItemModule,
    GameItemModule,
    LibraryGameModule,
    GameSessionModule,
    CommentModule,
    BlogModule,
    CategoryModule,
    SystemRequirementModule,
    PaymentModule,
    WebWalletModule,
    TransactionModule,
    CartModule,
    CartItemModule,
    OrderModule,
    OrderDetailModule,
    AiModule,
  ],
})
export class AppModule {}
