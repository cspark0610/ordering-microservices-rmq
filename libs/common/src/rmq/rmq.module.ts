import { DynamicModule, Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { RmqService } from './rmq.service';

interface RmqModuleOptions {
  name: string;
}

// este RmqModule es un modulo que se importa en el modulo sobre el cual vamos a hacer la conexion de microservicios
@Module({
  providers: [RmqService],
  exports: [RmqService],
})
export class RmqModule {
  static register({ name }: RmqModuleOptions): DynamicModule {
    return {
      module: RmqModule,
      imports: [
        ClientsModule.registerAsync([
          {
            name,
            useFactory: async (configService: ConfigService) => {
              return {
                transport: Transport.RMQ,
                options: {
                  urls: [configService.get<string>('RABBIT_MQ_URI')],
                  queue: configService.get<string>(`RABBIT_MQ_${name}_QUEUE`),
                },
              };
            },
            inject: [ConfigService],
          },
        ]),
      ],
      // vamos a registrar el modulo de Rmq en el modulo  de orders
      exports: [ClientsModule],
    };
  }
}
