import { Controller, Logger } from '@nestjs/common';
import { Ctx, EventPattern, Payload, RmqContext } from '@nestjs/microservices';
import { BillingService } from './billing.service';

@Controller()
export class BillingController {
  logger = new Logger('BillingController');
  constructor(private readonly billingService: BillingService) {}

  // voy a recibir el EVENTO EMITIDO POR EL ORDERS MODULE, usar @EventPattern()
  @EventPattern('order_created')
  async handleOrderCreated(
    @Payload() payload: any,
    @Ctx() context: RmqContext,
  ) {
    this.logger.log(context, 'context');
    this.billingService.bill(payload);
  }
}
