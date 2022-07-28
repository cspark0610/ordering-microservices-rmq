import { Injectable, Logger } from '@nestjs/common';

@Injectable()
export class BillingService {
  private readonly logger = new Logger(BillingService.name);

  async bill(payload: any) {
    this.logger.log(
      `BillingService.billing called... with payload : ${JSON.stringify(
        payload,
      )}`,
    );
  }
}
