import { Module } from '@nestjs/common';
import { UserService } from './services/user.service';
import { UserController } from './controllers/user.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from './entities/user.entity';
import { UserRepository } from './repositories/user.repository';
import { PaginationService } from 'src/common/services/pagination.service';
import { WebWalletModule } from 'src/payment-service/web-wallet/web-wallet.module';
import { ProfileModule } from '../profile/profile.module';

@Module({
  imports: [
    MongooseModule.forFeature(
      [{ name: User.name, schema: UserSchema }],
      'USER_DB',
    ),
    WebWalletModule,
    ProfileModule,
  ],
  controllers: [UserController],
  providers: [UserService, UserRepository, PaginationService],
  exports: [UserService],
})
export class UserModule {}
