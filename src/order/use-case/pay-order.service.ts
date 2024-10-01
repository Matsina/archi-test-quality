import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { Order } from '../domain/entity/order.entity';
import OrderRepository from '../infrastructure/order.repository';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class PayOrderService {
  constructor(
    @InjectRepository(Order)
    private readonly orderRepository: OrderRepository,
  ) {}

  public async payOrder(orderId: string): Promise<Order> {
    const order = await this.orderRepository.findById(orderId);

    if (!order) {
      throw new NotFoundException('Pas de commande');
    }

    order.pay();

    return this.orderRepository.save(order);
  }
}
