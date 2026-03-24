import { Module } from '@nestjs/common';
import { PaymentService } from './services/payment.service';
import { PaymentController } from './controllers/payment.controller';
import { PaymentRepository } from './repositories/payment.repository';
import { MongooseModule } from '@nestjs/mongoose';
import { Payment, PaymentSchema } from './entities/payment.entity';
import { PaginationService } from '../../common/services/pagination.service';

@Module({
  imports: [
    MongooseModule.forFeature(
      [{ name: Payment.name, schema: PaymentSchema }],
      'PAYMENT_DB',
    ),
  ],
  controllers: [PaymentController],
  providers: [PaymentService, PaymentRepository, PaginationService],
})
export class PaymentModule {}
