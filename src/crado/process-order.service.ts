import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Order } from 'src/order/domain/entity/order.entity';
import { EmailService } from './email.service';
import { SmsService } from './sms.service';

@Injectable()
export class ProcessOrderService {
  constructor(
    @InjectRepository(Order)
    private orderRepository: Repository<Order>,
    private emailService: EmailService,
    private smsService: SmsService,
  ) {}

  async processOrder(orderId: string): Promise<void> {
    const order = await this.orderRepository.findOne({
      where: { id: orderId },
    });

    if (!order) {
      throw new Error(`Order with ID ${orderId} not found`);
    }

    const isValid = order.isValid();
    if (!isValid) {
      throw new Error('Order validation failed');
    }

    await this.emailService.sendOrderConfirmationEmail(order);
    await this.smsService.sendOrderConfirmationSms(order);

    await this.orderRepository.save(order);
  }
}
