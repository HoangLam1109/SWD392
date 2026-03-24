import { Injectable } from '@nestjs/common';
import { CreatePaymentDto } from '../dto/create-payment.dto';
import { UpdatePaymentDto } from '../dto/update-payment.dto';
import { PaymentRepository } from '../repositories/payment.repository';
import { PaymentDocument } from '../entities/payment.entity';
import { PaginationOptionsDto } from '../../../common/dto/pagination-option.dto';
import { PaginationResponseDto } from '../../../common/dto/pagination-response.dto';
import { PaginationService } from '../../../common/services/pagination.service';

@Injectable()
export class PaymentService {
  constructor(
    private readonly paymentRepository: PaymentRepository,
    private readonly paginationService: PaginationService,
  ) {}

  async createPayment(createPaymentDto: CreatePaymentDto) {
    return await this.paymentRepository.create(createPaymentDto);
  }

  async findByCode(code: string) {
    return await this.paymentRepository.findByCode(code);
  }

  async findPaymentById(id: string) {
    return await this.paymentRepository.findById(id);
  }

  async findAll() {
    return await this.paymentRepository.findAll();
  }

  async findAllWithPagination(
    options: PaginationOptionsDto,
  ): Promise<PaginationResponseDto<PaymentDocument>> {
    return this.paginationService.paginate(this.paymentRepository, options);
  }

  async updatePayment(
    id: string,
    updatePaymentDto: UpdatePaymentDto,
  ): Promise<PaymentDocument | null> {
    return await this.paymentRepository.updateById(id, updatePaymentDto);
  }

  async deletePayment(id: string) {
    return await this.paymentRepository.deleteById(id);
  }
}
