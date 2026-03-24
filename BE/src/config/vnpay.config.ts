import { VNPay, ignoreLogger } from 'vnpay';

export const vnpay = new VNPay({
  tmnCode: process.env.VNPAY_TMN_CODE!,
  secureSecret: process.env.VNPAY_SECURE_SECRET!,
  vnpayHost: 'https://sandbox.vnpayment.vn',
  testMode: true,
  loggerFn: ignoreLogger,
});
