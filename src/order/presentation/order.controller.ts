import {
  Controller,
  Get,
  Body,
  Post,
  Param,
  NotFoundException,
} from '@nestjs/common';
import { CreateOrderService } from '../use-case/create-order.service';
import { PayOrderService } from '../use-case/pay-order.service';
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

@Controller('/orders')
export default class OrderController {
  constructor(
    private readonly createOrderService: CreateOrderService,
    private readonly payOrderService: PayOrderService,
  ) {}

  @Get()
  async getOrders() {
    return 'All orders';
  }

  @Post()
  async createOrder(@Body() body: CreateOrder): Promise<string> {
    return this.createOrderService.createOrder(body);
  }

  @Post(':id/pay')
  async payOrder(@Param('id') id: string): Promise<Order> {
    try {
      return this.payOrderService.payOrder(id);
    } catch (error) {
      throw new NotFoundException(error.message);
    }
  }
}
