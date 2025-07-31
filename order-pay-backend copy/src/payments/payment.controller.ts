import { Body, Headers, Controller, Post } from '@nestjs/common';
import { GenericPaymentService } from './Payment Types/GenericPayment/generic-payment.service';
import { GenericPaymentDto } from './Payment Types/GenericPayment/generic-payment.dto';
import { MercadopagoService } from './Payment Types/MercadoPago/mercadopago.service';
import { MercadopagoPaymentDto } from './Payment Types/MercadoPago/mercadopago-payment.dto';
import { PaymentType } from './payment-types';

@Controller('payments')
export class PaymentController {
  constructor(
    private readonly genericPaymentService: GenericPaymentService,
    private readonly mercadopagoService: MercadopagoService,
  ) {}

  @Post()
  processPayment(@Body() body: { dto: GenericPaymentDto }) {
    return this.genericPaymentService.processPayment(body.dto);
  }

  @Post('mercadopago')
  createMercadoPagoCheckout(@Body() body: MercadopagoPaymentDto ) {
    return this.mercadopagoService.createCheckoutPreference(body);
  }

  @Post('mercadopago/webhook')
  async handleMercadopagoWebhook(
    @Body() body: any,
    @Headers('x-signature') signature: string
  ) {
    const { type, action, data } = body;

    if (type === 'payment' && action === 'payment.updated' && data?.id) {
      try {
        const payment = await this.mercadopagoService.getPaymentById(data.id);

        const { status, external_reference, id, transaction_amount, currency_id } = payment;

        if (status === 'approved') {
          const sessionId = Number(external_reference);

          const payment = {
            sessionId: sessionId,
            amount: transaction_amount,
            currency: currency_id,
            type: PaymentType.MERCADOPAGO,
          };

          return await this.mercadopagoService.savePayment(payment);

        } else {
          console.log(`Payment ${id} recibido pero no aprobado: ${status}`);
        }
      } catch (err) {
        console.error('Error al procesar el webhook de MercadoPago:', err);
      }
    } else {
      console.log('Webhook no relacionado a pago aprobado, ignorado.');
    }

    return { received: true };
  }
}