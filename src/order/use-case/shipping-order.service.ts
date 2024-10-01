import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Order } from '../domain/entity/order.entity';
import OrderRepository from '../infrastructure/order.repository';

@Injectable()
export class ShippingOrderService {
  constructor(
    @InjectRepository(Order)
    private readonly orderRepository: OrderRepository,
  ) {}

  public async shipOrder(
    orderId: string,
    shippingAddress: string,
  ): Promise<Order> {
    const order = await this.orderRepository.findById(orderId);

    if (!order) {
      throw new NotFoundException('Pas de commande');
    }

    order.ship(shippingAddress);

    return this.orderRepository.save(order);
  }
}
