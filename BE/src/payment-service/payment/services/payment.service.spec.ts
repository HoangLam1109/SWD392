import { Test, TestingModule } from '@nestjs/testing';
import { PaymentService } from './payment.service';
import { TransactionService } from '../../transaction/services/transaction.service';
import { PaymentRepository } from '../repositories/payment.repository';
import { OrderService } from '../../order/services/order.service';
import { PaginationService } from '../../../common/services/pagination.service';

/* eslint-disable @typescript-eslint/unbound-method */

jest.mock('vnpay', () => ({
  VNPay: jest.fn().mockImplementation(() => ({
    verifyReturnUrl: jest.fn(),
  })),
  ignoreLogger: jest.fn(),
}));

jest.mock('../../../config/vnpay.config', () => ({
  vnpay: {
    verifyReturnUrl: jest.fn(),
  },
}));

describe('PaymentService', () => {
  let service: PaymentService;
  let orderService: jest.Mocked<OrderService>;
  let transactionService: jest.Mocked<TransactionService>;
  let paymentRepository: jest.Mocked<PaymentRepository>;

  beforeEach(async () => {
    const mockOrderService = {
      interalFindOrderById: jest.fn(),
      onPaymentSuccess: jest.fn(),
      onPaymentFail: jest.fn(),
    };

    const mockTransactionService = {
      findTransactionById: jest.fn(),
      onPaymentSuccess: jest.fn(),
      onPaymentFail: jest.fn(),
    };

    const mockPaymentRepository = {
      create: jest.fn(),
      findById: jest.fn(),
      findAll: jest.fn(),
      updateById: jest.fn(),
      deleteById: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PaymentService,
        {
          provide: OrderService,
          useValue: mockOrderService,
        },
        {
          provide: TransactionService,
          useValue: mockTransactionService,
        },
        {
          provide: PaymentRepository,
          useValue: mockPaymentRepository,
        },
        {
          provide: PaginationService,
          useValue: {
            paginate: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<PaymentService>(PaymentService);
    orderService = module.get(OrderService);
    transactionService = module.get(TransactionService);
    paymentRepository = module.get(PaymentRepository);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('handleReturn', () => {
    const mockQuery = {
      vnp_TxnRef: 'txn123',
      vnp_TransactionNo: 'trans123',
      vnp_Amount: '100000',
    } as any;

    beforeEach(() => {
      // eslint-disable-next-line @typescript-eslint/no-require-imports
      const { vnpay } = require('../../../config/vnpay.config');
      vnpay.verifyReturnUrl.mockReturnValue({
        isSuccess: false,
        vnp_TxnRef: 'txn123',
        vnp_TransactionNo: 'trans123',
        vnp_Amount: '100000',
      });
    });

    it('should handle verify failure for order', async () => {
      const mockOrder = { _id: 'orderId', userId: 'userId' };
      // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
      orderService.interalFindOrderById.mockResolvedValue(mockOrder as any);

      // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
      const result = await service.handleReturn(mockQuery);

      expect(orderService.interalFindOrderById).toHaveBeenCalledWith('txn123');
      expect(orderService.onPaymentFail).toHaveBeenCalledWith(mockOrder);
      expect(result).toEqual({ success: false, orderId: 'orderId' });
      expect(paymentRepository.create).not.toHaveBeenCalled();
    });

    it('should handle verify failure for transaction', async () => {
      const mockTransaction = { _id: 'transId', walletId: 'walletId' };
      orderService.interalFindOrderById.mockResolvedValue(null);
      transactionService.findTransactionById.mockResolvedValue(
        // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
        mockTransaction as any,
      );

      // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
      const result = await service.handleReturn(mockQuery);

      expect(orderService.interalFindOrderById).toHaveBeenCalledWith('txn123');
      expect(transactionService.findTransactionById).toHaveBeenCalledWith(
        'txn123',
      );
      expect(transactionService.onPaymentFail).toHaveBeenCalledWith(
        mockTransaction,
      );
      expect(result).toEqual({ success: false, walletId: 'walletId' });
      expect(paymentRepository.create).not.toHaveBeenCalled();
    });
  });
});
