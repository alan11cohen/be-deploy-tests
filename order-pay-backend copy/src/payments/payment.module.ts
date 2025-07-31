import { Module } from '@nestjs/common';
import { PaymentController } from './payment.controller';
import { GenericPaymentService } from './Payment Types/GenericPayment/generic-payment.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Payment } from './payment.entity';
import { MercadopagoService } from './Payment Types/MercadoPago/mercadopago.service';

@Module({
  imports: [TypeOrmModule.forFeature([Payment])],
  controllers: [PaymentController],
  providers: [GenericPaymentService, MercadopagoService],
})
export class PaymentModule {}