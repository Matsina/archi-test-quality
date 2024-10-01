import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { Order } from '../domain/entity/order.entity';
import OrderRepository from '../infrastructure/order.repository';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class CancelOrderService {
  constructor(
    @InjectRepository(Order)
    private readonly orderRepository: OrderRepository,
  ) {}

  public async cancelOrder(
    orderId: string,
    cancellationReason: string,
  ): Promise<Order> {
    const order = await this.orderRepository.findById(orderId);

    if (!order) {
      throw new NotFoundException('Pas de commande');
    }

    order.cancel(cancellationReason);

    return this.orderRepository.save(order);
  }
}
