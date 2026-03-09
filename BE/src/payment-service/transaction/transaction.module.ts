import { Module } from '@nestjs/common';
import { TransactionService } from './services/transaction.service';
import { TransactionController } from './controllers/transaction.controller';
import { TransactionRepository } from './repositories/transaction.repository';
import { MongooseModule } from '@nestjs/mongoose';
import { Transaction, TransactionSchema } from './entities/transaction.entity';
import { PaginationService } from '../../common/services/pagination.service';
import { WebWalletModule } from '../web-wallet/web-wallet.module';

@Module({
  imports: [
    MongooseModule.forFeature(
      [{ name: Transaction.name, schema: TransactionSchema }],
      'PAYMENT_DB',
    ),
    WebWalletModule,
  ],
  controllers: [TransactionController],
  providers: [TransactionService, TransactionRepository, PaginationService],
  exports: [TransactionService],
})
export class TransactionModule {}
