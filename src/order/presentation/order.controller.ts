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
import { ShippingOrderService } from '../use-case/shipping-order.service';

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
    private readonly shippingOrderService: ShippingOrderService,
  ) {}

  @Get()
  async getOrders() {
    return 'All orders';
  }

  @Post()
  async createOrder(@Body() body: CreateOrder): Promise<string> {
    return this.createOrderService.createOrder(body);
  }

  @Post()
  async payOrder(@Param('id') id: string): Promise<Order> {
    return await this.payOrderService.payOrder(id);
  }

  @Post()
  async shipOrder(
    @Param('id') id: string,
    @Body('shippingAddress') shippingAddress: string,
  ): Promise<Order> {
    return await this.shippingOrderService.shipOrder(id, shippingAddress);
  }
}
