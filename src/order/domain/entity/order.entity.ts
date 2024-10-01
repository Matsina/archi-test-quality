import { OrderItem } from '../entity/order-item.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Expose } from 'class-transformer';
import { BadRequestException } from '@nestjs/common';

export interface ItemDetail {
  productName: string;
  price: number;
}

export interface CreateOrder {
  items: ItemDetail[];
  customerName: string;
  shippingAddress: string;
  invoiceAddress: string;
}

export enum OrderStatus {
  PENDING = 'PENDING',
  PAID = 'PAID',
  SHIPPED = 'SHIPPED',
  DELIVERED = 'DELIVERED',
  CANCELED = 'CANCELED',
}

@Entity()
export class Order {
  static MAX_ITEMS = 5;
  static MIN_ITEMS = 3;
  static AMOUNT_MINIMUM = 10;
  static AMOUNT_MAXIMUM = 500;
  static SHIPPING_COST = 5;

  @CreateDateColumn()
  @Expose({ groups: ['group_orders'] })
  createdAt: Date;

  @PrimaryGeneratedColumn()
  @Expose({ groups: ['group_orders'] })
  id: string;

  @Column({ nullable: true })
  @Expose({ groups: ['group_orders'] })
  private price: number;

  @Column()
  @Expose({ groups: ['group_orders'] })
  private customerName: string;

  @OneToMany(() => OrderItem, (orderItem) => orderItem.order, {
    nullable: true,
  })
  @Expose({ groups: ['group_orders'] })
  orderItems: OrderItem[];

  @Column({ nullable: true })
  @Expose({ groups: ['group_orders'] })
  private shippingAddress: string | null;

  invoiceAddress: string | null;

  @Column({ nullable: true })
  @Expose({ groups: ['group_orders'] })
  private shippingAddressSetAt: Date | null;

  @Column()
  @Expose({ groups: ['group_orders'] })
  private status: string;

  @Column({ nullable: true })
  @Expose({ groups: ['group_orders'] })
  private paidAt: Date | null;

  public constructor(CreateOrder: CreateOrder) {
    if (!CreateOrder) {
      this.createdAt = new Date();
      this.price = 0;
      this.customerName = 'Sample Text';
      this.shippingAddress = null;
      this.invoiceAddress = null;
      this.shippingAddressSetAt = null;
      this.status = 'PENDING';
      this.paidAt = null;
      this.orderItems = null;
      return;
    }

    const { items, customerName, shippingAddress, invoiceAddress } =
      CreateOrder;

    if (
      !customerName ||
      !items ||
      items.length === 0 ||
      !shippingAddress ||
      !invoiceAddress
    ) {
      throw new BadRequestException('Missing required fields');
    }

    if (items.length > Order.MAX_ITEMS) {
      throw new BadRequestException(
        'Cannot create order with more than 5 items',
      );
    }

    const totalAmount = this.calculateOrderAmount(items);
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

  pay(): void {
    if (this.status !== OrderStatus.PENDING) {
      throw new Error('Order can only be paid if it is in PENDING status.');
    }

    if (this.price > Order.AMOUNT_MAXIMUM) {
      throw new Error('Order amount exceeds the maximum limit of 500€.');
    }
    this.status = OrderStatus.PAID;
    this.paidAt = new Date('NOW');
  }

  setShippingAddress(shippingAddress: string): void {
    if (this.orderItems.length <= Order.MIN_ITEMS) {
      throw new Error(
        'L’ajout de l’adresse de livraison n’est possible que si la commande contient plus de 3 items.',
      );
    }

    if (this.status !== OrderStatus.PENDING && !this.shippingAddress) {
      throw new Error(
        'La livraison est possible que si la commande est en cours ou si l’adresse de livraison a été renseignée.',
      );
    }

    this.shippingAddress = shippingAddress;
    this.price += Order.SHIPPING_COST;
    this.shippingAddressSetAt = new Date();
    this.status = OrderStatus.SHIPPED;
  }

  setInvoiceAddress(invoiceAddress: string): void {
    if (!this.shippingAddress) {
      throw new Error(
        'Une adresse de livraison doit être présente pour que celle de facturation soit remplie.',
      );
    }
    if (!invoiceAddress) {
      this.invoiceAddress = this.shippingAddress;
    }
  }
}
