import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateTransactionDto } from '../dto/create-transaction.dto';
import { UpdateTransactionDto } from '../dto/update-transaction.dto';
import { TransactionRepository } from '../repositories/transaction.repository';
import { TransactionDocument } from '../entities/transaction.entity';
import { PaginationOptionsDto } from '../../../common/dto/pagination-option.dto';
import { PaginationResponseDto } from '../../../common/dto/pagination-response.dto';
import { PaginationService } from '../../../common/services/pagination.service';
import { WebWalletService } from '../../web-wallet/services/web-wallet.service';
import { TransactionType, TransactionStatus } from '../enum/transaction.enum';
import mongoose from 'mongoose';

@Injectable()
export class TransactionService {
  constructor(
    private readonly transactionRepository: TransactionRepository,
    private readonly paginationService: PaginationService,
    private readonly webWalletService: WebWalletService,
  ) {}

  async create(createTransactionDto: CreateTransactionDto) {
    return await this.transactionRepository.create(createTransactionDto);
  }

  async checkUserBalance(userId: string, amount: number): Promise<boolean> {
    const wallet = await this.webWalletService.findWalletByUserId(userId);
    if (!wallet) {
      throw new NotFoundException('User wallet not found');
    }
    if (wallet.balance < amount) {
      return false;
    }
    return true;
  }

  async createForExternalPayment(
    userId: string,
    data: Partial<CreateTransactionDto>,
  ) {
    const wallet = await this.webWalletService.findWalletByUserId(userId);
    if (!wallet) {
      throw new NotFoundException('User wallet not found');
    }
    return await this.transactionRepository.create({
      walletId: wallet.id,
      balanceBefore: wallet.balance,
      balanceAfter: wallet.balance,
      ...data,
    });
  }

  async purchaseWithUserId(
    userId: string,
    refId: string,
    amount: number,
  ): Promise<TransactionDocument> {
    const wallet = await this.webWalletService.findWalletByUserId(userId);
    if (!wallet) {
      throw new NotFoundException('User wallet not found');
    }

    await this.webWalletService.updateWalletBalance(
      wallet.id,
      wallet.balance - amount,
    );

    const transaction = await this.create({
      walletId: wallet.id,
      refId,
      balanceBefore: wallet.balance,
      balanceAfter: wallet.balance - amount,
      amount,
      type: TransactionType.PAYMENT,
      status: TransactionStatus.COMPLETED,
      description: 'Payment for order ' + refId,
    });

    return transaction;
  }

  async depositToWalletId(userId: string, amount: number) {
    if (amount == 0) {
      throw new BadRequestException('Amount deposit must be larger than 0');
    }

    const wallet = await this.webWalletService.findWalletByUserId(userId);
    const refId = 'DEPOSIT_' + new mongoose.Types.ObjectId().toString();

    if (!wallet) {
      throw new NotFoundException('Wallet not found of user');
    }

    const transaction = await this.create({
      walletId: wallet.id,
      refId,
      balanceBefore: Math.round(wallet.balance * 100) / 100,
      balanceAfter: Math.round((wallet.balance + amount) * 100) / 100,
      amount,
      type: TransactionType.DEPOSIT,
      status: TransactionStatus.PENDING,
      description: 'Deposit to wallet ID' + wallet.id,
    });

    return {
      _id: transaction._id,
      walletId: transaction.walletId,
      balanceAfter: transaction.balanceAfter,
      balanceBefore: transaction.balanceBefore,
      amount: transaction.amount,
      type: transaction.type,
      status: transaction.status,
    } as Partial<TransactionDocument>;
  }

  async onPaymentSuccess(
    transaction: Partial<TransactionDocument>,
  ): Promise<string> {
    if (!transaction._id) {
      throw new BadRequestException('Transaction ID is required');
    }

    const wallet = await this.webWalletService.findWalletById(
      transaction.walletId!,
    );
    if (!wallet) {
      throw new NotFoundException('User wallet not found');
    }

    await this.webWalletService.updateWalletBalance(
      wallet.id,
      transaction.amount!,
    );

    await this.updateTransaction(transaction._id.toString(), {
      status: TransactionStatus.COMPLETED,
    });

    return wallet.userId;
  }

  async onPaymentFail(transaction: Partial<TransactionDocument>) {
    if (!transaction._id) {
      throw new BadRequestException('Transaction ID is required');
    }

    await this.updateTransaction(transaction._id.toString(), {
      status: TransactionStatus.FAILED,
    });
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
