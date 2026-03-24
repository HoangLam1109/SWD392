import { Module } from '@nestjs/common';
import { WebWalletService } from './services/web-wallet.service';
import { WebWalletController } from './controllers/web-wallet.controller';
import { WebWalletRepository } from './repositories/web-wallet.repository';
import { MongooseModule } from '@nestjs/mongoose';
import { WebWallet, WebWalletSchema } from './entities/web-wallet.entity';
import { PaginationService } from '../../common/services/pagination.service';

@Module({
  imports: [
    MongooseModule.forFeature(
      [{ name: WebWallet.name, schema: WebWalletSchema }],
      'PAYMENT_DB',
    ),
  ],
  controllers: [WebWalletController],
  providers: [WebWalletService, WebWalletRepository, PaginationService],
  exports: [WebWalletService],
})
export class WebWalletModule {}
