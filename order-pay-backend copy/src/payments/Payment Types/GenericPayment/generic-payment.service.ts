import { Injectable } from "@nestjs/common";
import { GenericPaymentDto } from "./generic-payment.dto";
import { Payment } from "../../payment.entity";
import { Repository } from "typeorm";
import { InjectRepository } from "@nestjs/typeorm";
import { PaymentType } from "../../payment-types";

@Injectable()
export class GenericPaymentService {

  constructor(
      @InjectRepository(Payment)
      private readonly paymentRepository: Repository<Payment>
  ) {}

  async processPayment(dto: GenericPaymentDto) {

    // Here you would implement the logic to process the payment depending on the External service used.
    // This could involve calling an external API, saving the payment details to a database, etc.

    const successful = true; // Simulating a successful payment processing
    let result: Payment;
    if (successful) {
      result = await this.paymentRepository.save({
        sessionId: dto.sessionId,
        amount: dto.amount,
        currency: dto.currency,
        type: PaymentType.GENERIC
      });

      return {
        message: "GenericPayment processed",
        data: {
          result
        }
      };
    }
  }
}
