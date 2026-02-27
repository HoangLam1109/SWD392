import { Injectable } from '@nestjs/common';
import { CreateTransactionDto } from '../dto/create-transaction.dto';
import { UpdateTransactionDto } from '../dto/update-transaction.dto';
import { TransactionRepository } from '../repositories/transaction.repository';
import { TransactionDocument } from '../entities/transaction.entity';
import { PaginationOptionsDto } from '../../../common/dto/pagination-option.dto';
import { PaginationResponseDto } from '../../../common/dto/pagination-response.dto';
import { PaginationService } from '../../../common/services/pagination.service';

@Injectable()
export class TransactionService {
  constructor(
    private readonly transactionRepository: TransactionRepository,
    private readonly paginationService: PaginationService,
  ) {}

  async create(createTransactionDto: CreateTransactionDto) {
    return await this.transactionRepository.create(createTransactionDto);
  }

  async findByRefId(refId: string) {
    return await this.transactionRepository.findByRefId(refId);
  }

  async findByWalletId(walletId: string) {
    return await this.transactionRepository.findByWalletId(walletId);
  }

  async findTransactionById(id: string) {
    return await this.transactionRepository.findById(id);
  }

  async findAll() {
    return await this.transactionRepository.findAll();
  }

  async findAllWithPagination(
    options: PaginationOptionsDto,
  ): Promise<PaginationResponseDto<TransactionDocument>> {
    return this.paginationService.paginate(this.transactionRepository, options);
  }

  async updateTransaction(
    id: string,
    updateTransactionDto: UpdateTransactionDto,
  ): Promise<TransactionDocument | null> {
    return await this.transactionRepository.updateById(
      id,
      updateTransactionDto,
    );
  }

  async deleteTransaction(id: string) {
    return await this.transactionRepository.deleteById(id);
  }
}
