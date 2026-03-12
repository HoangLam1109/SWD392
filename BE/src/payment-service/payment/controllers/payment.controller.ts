import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  Req,
  Res,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiQuery,
} from '@nestjs/swagger';
import { PaymentService } from '../services/payment.service';
import { CreatePaymentDto } from '../dto/create-payment.dto';
import { UpdatePaymentDto } from '../dto/update-payment.dto';
import { PaymentResponseDto } from '../dto/payment-response.dto';
import { CreatePaymentUrlDto } from '../dto/create-payment-url.dto';
import { PaginationOptionsDto } from '../../../common/dto/pagination-option.dto';
import { PaginationResponseDto } from '../../../common/dto/pagination-response.dto';
import type { Request, Response } from 'express';
import type { ReturnQueryFromVNPay } from 'vnpay';
import { Public } from 'src/auth/decorators/public.decorator';
import { CreateDepositUrlDto } from '../dto/create-deposit-url.dto';

@ApiBearerAuth()
@ApiTags('Payments')
@Controller('payments')
export class PaymentController {
  constructor(private readonly paymentService: PaymentService) {}

  @ApiOperation({ summary: 'Create a new payment' })
  @ApiResponse({
    status: 201,
    description: 'Payment created successfully',
    type: PaymentResponseDto,
  })
  @ApiResponse({
    status: 400,
    description: 'Bad request - invalid input data',
  })
  @Post()
  create(@Body() createPaymentDto: CreatePaymentDto) {
    return this.paymentService.createPayment(createPaymentDto);
  }

  @ApiOperation({ summary: 'Get all payments with pagination' })
  @ApiQuery({
    name: 'limit',
    required: false,
    type: Number,
    description: 'Number of items per page (default: 10)',
  })
  @ApiQuery({
    name: 'sortBy',
    required: false,
    type: String,
    description: 'Field to sort by (default: _id)',
  })
  @ApiQuery({
    name: 'sortOrder',
    required: false,
    enum: ['asc', 'desc'],
    description: 'Sort order (default: desc)',
  })
  @ApiQuery({
    name: 'cursor',
    required: false,
    type: String,
    description: 'Cursor for pagination',
  })
  @ApiQuery({
    name: 'search',
    required: false,
    type: String,
    description: 'Search keyword',
  })
  @ApiQuery({
    name: 'searchField',
    required: false,
    type: String,
    description: 'Field to search in',
  })
  @ApiResponse({
    status: 200,
    description: 'List of all payments with pagination',
    type: PaginationResponseDto,
  })
  @Get()
  findAll(@Query() query: PaginationOptionsDto) {
    return this.paymentService.findAllWithPagination(query);
  }

  @ApiOperation({ summary: 'Get payment by ID' })
  @ApiResponse({
    status: 200,
    description: 'Payment found',
    type: PaymentResponseDto,
  })
  @ApiResponse({
    status: 404,
    description: 'Payment not found',
  })
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.paymentService.findPaymentById(id);
  }

  @ApiOperation({ summary: 'Get payment by transaction code' })
  @ApiResponse({
    status: 200,
    description: 'Payment found',
    type: PaymentResponseDto,
  })
  @ApiResponse({
    status: 404,
    description: 'Payment not found',
  })
  @Get('transaction/:transactionCode')
  findByTransactionCode(@Param('transactionCode') transactionCode: string) {
    return this.paymentService.findByCode(transactionCode);
  }

  @ApiOperation({ summary: 'Update payment' })
  @ApiResponse({
    status: 200,
    description: 'Payment updated successfully',
  })
  @ApiResponse({
    status: 404,
    description: 'Payment not found',
  })
  @Patch(':id')
  update(@Param('id') id: string, @Body() updatePaymentDto: UpdatePaymentDto) {
    return this.paymentService.updatePayment(id, updatePaymentDto);
  }

  @ApiOperation({ summary: 'Delete payment' })
  @ApiResponse({
    status: 200,
    description: 'Payment deleted successfully',
  })
  @ApiResponse({
    status: 404,
    description: 'Payment not found',
  })
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.paymentService.deletePayment(id);
  }

  @ApiOperation({ summary: 'Create VNPay payment URL' })
  @ApiResponse({
    status: 201,
    description: 'Payment URL created successfully',
    type: 'redirectUrl',
  })
  @ApiResponse({
    status: 400,
    description: 'Bad request',
  })
  @Post('/vnpay/create-deposit-url')
  async createDepositUrl(
    @Body() createDepositUrlDto: CreateDepositUrlDto,
    @Req() req: Request,
  ) {
    const ipAddr =
      (req.headers['x-forwarded-for'] as string) ||
      req.socket.remoteAddress ||
      '127.0.0.1';
    return await this.paymentService.createVnpayUrl(
      createDepositUrlDto.transactionId,
      createDepositUrlDto.amount,
      ipAddr,
    );
  }

  @ApiOperation({ summary: 'Create VNPay payment URL' })
  @ApiResponse({
    status: 201,
    description: 'Payment URL created successfully',
    type: 'redirectUrl',
  })
  @ApiResponse({
    status: 400,
    description: 'Bad request',
  })
  @Post('/vnpay/create-url')
  async createPaymentUrl(
    @Body() createPaymentUrlDto: CreatePaymentUrlDto,
    @Req() req: Request,
  ) {
    const ipAddr =
      (req.headers['x-forwarded-for'] as string) ||
      req.socket.remoteAddress ||
      '127.0.0.1';
    return await this.paymentService.createVnpayUrl(
      createPaymentUrlDto.orderId,
      createPaymentUrlDto.totalPrice,
      ipAddr,
    );
  }

  @ApiOperation({ summary: 'Handle VNPay IPN' })
  @ApiResponse({
    status: 200,
    description: 'IPN handled successfully',
  })
  @ApiResponse({
    status: 400,
    description: 'Bad request',
  })
  @ApiOperation({ summary: 'Handle VNPay return' })
  @ApiResponse({
    status: 302,
    description: 'Redirect to success or failure page',
  })
  @Get('/vnpay/ipn')
  async vnpayIpn(@Query() query: ReturnQueryFromVNPay) {
    return this.paymentService.handleIpn(query);
  }

  @ApiOperation({ summary: 'Handle VNPay return' })
  @ApiResponse({
    status: 302,
    description: 'Redirect to success or failure page',
  })
  @Public()
  @Get('/vnpay/return')
  async vnpayReturn(
    @Query() query: ReturnQueryFromVNPay,
    @Res() res: Response,
  ) {
    const result = await this.paymentService.handleReturn(query);

    if (result.success) {
      const redirectUrl = result.orderId
        ? `${process.env.FRONTEND_URL}/payment/success?orderId=${result.orderId.toString()}`
        : result.walletId
          ? `${process.env.FRONTEND_URL}/payment/success?walletId=${result.walletId}`
          : `${process.env.FRONTEND_URL}/payment/success?orderId=unknown`;
      res.redirect(redirectUrl);
    } else {
      const redirectUrl = result.orderId
        ? `${process.env.FRONTEND_URL}/payment/failed?orderId=${result.orderId.toString()}`
        : result.walletId
          ? `${process.env.FRONTEND_URL}/payment/failed?walletId=${result.walletId}`
          : `${process.env.FRONTEND_URL}/payment/failed?orderId=unknown`;
      res.redirect(redirectUrl);
    }
  }
}
