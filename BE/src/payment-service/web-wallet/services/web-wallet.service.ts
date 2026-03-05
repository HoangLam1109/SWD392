import { Injectable } from '@nestjs/common';
import { CreateWebWalletDto } from '../dto/create-web-wallet.dto';
import { UpdateWebWalletDto } from '../dto/update-web-wallet.dto';
import { WebWalletRepository } from '../repositories/web-wallet.repository';
import { WebWalletDocument } from '../entities/web-wallet.entity';
import { PaginationOptionsDto } from '../../../common/dto/pagination-option.dto';
import { PaginationResponseDto } from '../../../common/dto/pagination-response.dto';
import { PaginationService } from '../../../common/services/pagination.service';

@Injectable()
export class WebWalletService {
  constructor(
    private readonly webWalletRepository: WebWalletRepository,
    private readonly paginationService: PaginationService,
  ) {}

  async create(createWebWalletDto: CreateWebWalletDto) {
    return await this.webWalletRepository.create(createWebWalletDto);
  }

  async findWalletById(id: string) {
    return await this.webWalletRepository.findById(id);
  }

  async findWalletByUserId(userId: string) {
    return await this.webWalletRepository.findByUserId(userId);
  }

  async findAll() {
    return await this.webWalletRepository.findAll();
  }

  async findAllWithPagination(
    options: PaginationOptionsDto,
  ): Promise<PaginationResponseDto<WebWalletDocument>> {
    return this.paginationService.paginate(this.webWalletRepository, options);
  }

  async updateWallet(
    id: string,
    updateWebWalletDto: UpdateWebWalletDto,
  ): Promise<WebWalletDocument | null> {
    return await this.webWalletRepository.updateById(id, updateWebWalletDto);
  }

  async updateWalletBalance(id: string, balance: number) {
    return await this.webWalletRepository.updateById(id, { balance });
  }

  async depositBalance(id: string, balance: number) {
    const wallet = await this.findWalletByUserId(id);
    if (wallet) {
      await this.webWalletRepository.updateById(wallet._id.toString(), {
        balance: wallet.balance + balance,
      });
    }
  }

  async deleteWallet(id: string) {
    return await this.webWalletRepository.deleteById(id);
  }
}
