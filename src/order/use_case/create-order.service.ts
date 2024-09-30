import { BadRequestException, Injectable } from '@nestjs/common';
import { Order } from '../domain/entity/order.entity';

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
  public createOrder(createOrderDto: CreateOrder): string {
    const { items, customerName, shippingAddress, invoiceAddress } =
      createOrderDto;

    this.validateFields(createOrderDto);
    this.validateItemCount(items);
    const totalAmount = this.calculateOrderAmount(items);

    return 'OK';
  }
  private validateFields(createOrderDto: CreateOrder) {
    const { items, customerName, shippingAddress, invoiceAddress } =
      createOrderDto;

    if (
      !customerName ||
      !items ||
      items.length === 0 ||
      !shippingAddress ||
      !invoiceAddress
    ) {
      throw new BadRequestException('Missing required fields');
    }
  }

  private validateItemCount(items: ItemDetail[]) {
    if (items.length > Order.MAX_ITEMS) {
      throw new BadRequestException(
        'Cannot create order with more than 5 items',
      );
    }
  }

  private calculateOrderAmount(items: ItemDetail[]): number {
    const totalAmount = items.reduce((sum, item) => sum + item.price, 0);

    if (totalAmount < Order.AMOUNT_MINIMUM) {
      throw new BadRequestException(
        'Cannot create order with total amount less than 10€',
      );
    }
    return totalAmount;
  }
}
