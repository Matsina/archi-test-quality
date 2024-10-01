import { BadRequestException, Injectable } from '@nestjs/common';
import { Order } from '../domain/entity/order.entity';
import { InjectRepository } from '@nestjs/typeorm';
import OrderRepository from '../infrastructure/order.repository';

interface ItemDetail {
  productName: string;
  price: number;
}

interface CreateOrder {
  items: ItemDetail[];
  customerName: string;
  shippingAddress: string;
  invoiceAddress: string;
}

@Injectable()
export class CreateOrderService {
  constructor(
    @InjectRepository(Order)
    private readonly orderRepository: OrderRepository,
  ) {}
  async createOrder(CreateOrder: CreateOrder): Promise<Order> {
    const order = new Order(CreateOrder);
    return await this.orderRepository.save(order);
  }
}
