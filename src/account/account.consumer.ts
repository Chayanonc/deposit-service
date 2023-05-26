import { Injectable, OnModuleInit } from '@nestjs/common';
import { ConsumerService } from 'src/kafkajs/consumer.service';
import { stringToJson } from 'src/utils/convert-json.util';

@Injectable()
export class DepositConsumer implements OnModuleInit {
  constructor(private readonly consumerService: ConsumerService) {}

  async onModuleInit() {
    // await this.consumerService.consume(
    //   { topic: 'account_check_user' },
    //   {
    //     eachMessage: async ({ topic, partition, message }) => {
    //       console.log({
    //         value: stringToJson(message),
    //         // value: message.value,
    //         topic: topic.toString(),
    //         partition: partition.toString(),
    //       });
    //     },
    //   },
    // );
  }
}
