import { JwtAuthGuard, RmqService } from '@app/common';
import { Controller, Logger, UseGuards } from '@nestjs/common';
import { Ctx, EventPattern, Payload, RmqContext } from '@nestjs/microservices';
import { BillingService } from './billing.service';

@Controller()
export class BillingController {
  logger = new Logger('BillingController');
  constructor(
    private readonly billingService: BillingService,
    private readonly rmqService: RmqService,
  ) {}

  // voy a recibir el EVENTO EMITIDO POR EL ORDERS MODULE, usar @EventPattern()
  @EventPattern('order_created')
  @UseGuards(JwtAuthGuard)
  async handleOrderCreated(
    @Payload() payload: any,
    @Ctx() context: RmqContext,
  ) {
    this.billingService.bill(payload);
    // una vez que ejecuto el metodo de bill, hacemos el ACKNOLEGEMENT del mensaje que se recibio
    this.rmqService.ack(context);
  }
}
