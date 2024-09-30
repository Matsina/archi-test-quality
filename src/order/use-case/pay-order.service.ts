import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { Order } from '../domain/entity/order.entity';

@Injectable()
export class PayOrderService {
  private orders: Order[] = [];

  constructor() {
    const fakeOrder = new Order();
    fakeOrder.id = '1';
    fakeOrder.customerName = 'Francis';
    fakeOrder.status = 'PENDING';
    fakeOrder.price = 50;
    this.orders.push(fakeOrder);
  }

  public payOrder(orderId: string): Order {
    const order = this.orders.find((o) => o.id === orderId);

    if (!order) {
      throw new NotFoundException('Order not found');
    }

    if (order.status === 'PAID') {
      throw new BadRequestException('Order is already paid');
    }

    order.status = 'PAID';
    order.paidAt = new Date();

    return order;
  }
}
