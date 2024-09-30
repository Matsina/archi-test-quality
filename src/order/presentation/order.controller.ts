import { Controller, Get, Post } from '@nestjs/common';

@Controller('/orders')
export default class OrderController {
  @Get()
  async getOrders() {
    return 'All orders';
  }

  @Post()
  async create() {
    return 'This action adds a new cat';
  }
}
