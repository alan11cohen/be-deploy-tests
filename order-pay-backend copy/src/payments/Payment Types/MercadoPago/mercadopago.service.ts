import { Injectable } from '@nestjs/common';
import { MercadoPagoConfig, Payment, Preference } from 'mercadopago';
import { MercadopagoPaymentDto } from './mercadopago-payment.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Payment as PaymentEntity } from '../../payment.entity';
@Injectable()
export class MercadopagoService {
  private readonly mp;

  constructor(
    @InjectRepository(PaymentEntity)
    private readonly paymentRepository: Repository<PaymentEntity>,
    ) {
    this.mp = new MercadoPagoConfig({
      accessToken: process.env.MP_ACCESS_TOKEN!,
    });
  }

  async createCheckoutPreference(dto: MercadopagoPaymentDto) {
      const preference = new Preference(this.mp);
      const response = await preference.create({
        body: {
          items: [
            {
              title: dto.description ?? 'Pago en OrderPay',
              quantity: 1,
              unit_price: dto.amount,
              currency_id: dto.currency,
              id: ''
            },
          ],
          back_urls: {
            success: dto.successUrl ?? process.env.MP_SUCCESS_URL ?? 'https://tusitio.com/success',
            failure: dto.failureUrl ?? process.env.MP_FAILURE_URL ?? 'https://tusitio.com/failure',
            pending: dto.pendingUrl ?? process.env.MP_PENDING_URL ?? 'https://tusitio.com/pending',
          },
          external_reference: String(dto.sessionId),
          auto_return: 'approved'
        }
      });

    return response;
  }

  async getPaymentById(paymentId: string) {
    const payment = new Payment(this.mp);
    return await payment.get({ id: paymentId });
  }

  async savePayment(paymentData: any) {
    return await this.paymentRepository.save({
      sessionId: paymentData.sessionId,
      amount: paymentData.amount,
      currency: paymentData.currency,
      type: paymentData.type,
    });
  }
}
