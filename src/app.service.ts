import { Injectable } from '@nestjs/common';
import { ProducerService } from './kafkajs/producer.service';

@Injectable()
export class AppService {
  constructor(private readonly producerService: ProducerService) {}

  getHello(): string {
    return 'Hello World!';
  }

  async createDeposit(data: any) {
    await this.producerService.produce({
      topic: 'account_check_user',
      messages: [
        {
          value: JSON.stringify({
            account_number: data.account_number,
            amount: data.amount,
            payment_type: data.payment_type,
          }),
        },
      ],
    });
  }
}
