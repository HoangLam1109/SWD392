import { Test, TestingModule } from '@nestjs/testing';
import { WebWalletService } from './web-wallet.service';

describe('WebWalletService', () => {
  let service: WebWalletService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [WebWalletService],
    }).compile();

    service = module.get<WebWalletService>(WebWalletService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
