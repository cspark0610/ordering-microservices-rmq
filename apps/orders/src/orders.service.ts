import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { lastValueFrom } from 'rxjs';
import { BILLING_SERVICE } from './constants/services';
import { CreateOrderRequest } from './dto/create-order.request';
import { OrdersRepository } from './orders.repository';

@Injectable()
export class OrdersService {
  constructor(
    private readonly ordersRepository: OrdersRepository,
    @Inject(BILLING_SERVICE) private billingClient: ClientProxy,
  ) {}

  async createOrder(request: CreateOrderRequest) {
    // refactor this to use billingClient
    const session = await this.ordersRepository.startTransaction();

    try {
      const order = await this.ordersRepository.create(request, { session });

      await lastValueFrom(
        // el emit devuelve un observable que debe ser tranformada a promise usando el metodo lastValueFrom de rxjs
        this.billingClient.emit('order_created', { request }),
      );

      // en este punto commiteamos la transaccion si lo anterior se ejecuto sin problemas
      await session.commitTransaction();
      return order;
    } catch (error) {
      await session.abortTransaction();
      //console.log(error, 'error');
      throw error;
    }
  }

  async getOrders() {
    return this.ordersRepository.find({});
  }
}
