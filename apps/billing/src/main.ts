import { RmqService } from '@app/common';
import { NestFactory } from '@nestjs/core';
import { BillingModule } from './billing.module';

async function bootstrap() {
  const app = await NestFactory.create(BillingModule);
  const rmqService: RmqService = app.get<RmqService>(RmqService);

  // creamos ahora una conexion a rabbitmq con microservicios
  app.connectMicroservice(rmqService.getOptions('BILLING'));
  await app.startAllMicroservices();
}
bootstrap();
