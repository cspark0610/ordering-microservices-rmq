import { Injectable } from '@nestjs/common';
import { RmqOptions, Transport } from '@nestjs/microservices';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class RmqService {
  constructor(private configService: ConfigService) {}

  getOptions(queue: string, noAck = false): RmqOptions {
    return {
      transport: Transport.RMQ,
      options: {
        urls: [this.configService.get<string>('RABBIT_MQ_URI')],
        queue: this.configService.get<string>(`RABBIT_MQ_${queue}_QUEUE`),
        noAck,
        persistent: true,
      },
    };
  }
}

/*
export interface RmqOptions {
    transport?: Transport.RMQ;
    options?: {
        urls?: string[] | RmqUrl[];
        queue?: string;
        prefetchCount?: number;
        isGlobalPrefetchCount?: boolean;
        queueOptions?: any;
        socketOptions?: any;
        noAck?: boolean;
        serializer?: Serializer;
        deserializer?: Deserializer;
        replyQueue?: string;
        persistent?: boolean;
        headers?: Record<string, string>;
        noAssert?: boolean;
    };
}
*/
