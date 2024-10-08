import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import OrderRepository from './infrastructure/order.repository';
import OrderController from './presentation/order.controller';
import { Order } from './domain/entity/order.entity';
import { OrderItem } from './domain/entity/order-item.entity';
import { CreateOrderService } from './use-case/create-order.service';
import { PayOrderService } from './use-case/pay-order.service';
import { SetShippingAddressService } from './use-case/set-shipping-address.service';
import { SetInvoiceAddressService } from './use-case/set-invoice-address.service';
import { CancelOrderService } from './use-case/cancel-order.service';

@Module({
  imports: [TypeOrmModule.forFeature([Order, OrderItem])],
  controllers: [OrderController],
  providers: [
    {
      provide: 'OrderRepositoryInterface',
      useClass: OrderRepository,
    },
    CreateOrderService,
    PayOrderService,
    SetShippingAddressService,
    SetInvoiceAddressService,
    CancelOrderService
  ],
})
export class OrderModule {}
