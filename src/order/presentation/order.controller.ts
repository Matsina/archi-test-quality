import { Controller, Get, Body, Post } from '@nestjs/common';
import { CreateOrderService } from '../use_case/create-order.service';

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
  constructor(private readonly createOrderService: CreateOrderService) {}

  @Get()
  async getOrders() {
    return 'All orders';
  }

  @Post()
  async createOrder(@Body() createOrderDto: CreateOrder): Promise<string> {
    return this.createOrderService.createOrder(createOrderDto);
  }
}
