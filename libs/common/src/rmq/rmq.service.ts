import { Injectable } from '@nestjs/common';
import { RmqOptions, Transport, RmqContext } from '@nestjs/microservices';
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

  ack(context: RmqContext): void {
    // Returns the reference to the original RMQ channel.
    const channel = context.getChannelRef();
    // Returns the original message (with properties, fields, and content).
    const originalMessage = channel.ack(context.getMessage());

    channel.ack(originalMessage);
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
