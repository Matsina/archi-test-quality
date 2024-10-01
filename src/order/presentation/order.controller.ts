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
import { SetShippingAddressService } from '../use-case/set-shipping-address.service';
import { SetInvoiceAddressService } from '../use-case/set-invoice-address.service';

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
    private readonly setShippingAddressService: SetShippingAddressService,
    private readonly setInvoiceAddressService: SetInvoiceAddressService,
  ) {}

  @Get()
  async getOrders() {
    return 'All orders';
  }

  @Post()
  async createOrder(@Body() body: CreateOrder): Promise<Order> {
    return await this.createOrderService.createOrder(body);
  }

  @Post()
  async payOrder(@Param('id') id: string): Promise<Order> {
    return await this.payOrderService.payOrder(id);
  }

  @Post()
  async shippingAddress(
    @Param('id') id: string,
    @Body('shippingAddress') shippingAddress: string,
  ): Promise<Order> {
    return await this.setShippingAddressService.shippingAddress(
      id,
      shippingAddress,
    );
  }

  @Post()
  async invoiceAddress(
    @Param('id') id: string,
    @Body('invoiceAddress') invoiceAddress: string,
  ): Promise<Order> {
    return await this.setInvoiceAddressService.invoiceAddress(
      id,
      invoiceAddress,
    );
  }
}
