import { Test, TestingModule } from '@nestjs/testing';
import { WebWalletController } from './web-wallet.controller';
import { WebWalletService } from '../services/web-wallet.service';

describe('WebWalletController', () => {
  let controller: WebWalletController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [WebWalletController],
      providers: [WebWalletService],
    }).compile();

    controller = module.get<WebWalletController>(WebWalletController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
