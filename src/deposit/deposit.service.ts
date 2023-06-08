import { Injectable } from '@nestjs/common';
import { ConsumerService } from 'src/kafkajs/consumer.service';
import { ProducerService } from 'src/kafkajs/producer.service';
import { DepositRepository } from './repository/deposite.repository';

interface IDepositProcess {
  account_number: string;
  balance: string;
  amount: string;
}

interface IDepositProcessSuccess {
  account_number: string;
  old_balance: string;
  new_balance: string;
  status: string;
}

@Injectable()
export class DepositService {
  constructor(
    private readonly consumerService: ConsumerService,
    private readonly depositRepository: DepositRepository,
    private readonly producerService: ProducerService,
  ) { }

  async depositProcess(data: any) {
    let accountNumber;
    let balance;
    let newBalance;
    let topic;
    if (data.payment_type === 'transfer') {
      accountNumber = data.to_account.account_number
      balance = data.to_account.old_balance
      newBalance = Number(balance) + Number(data.amount)
      data.to_account.new_balance = newBalance;
      topic = 'transfer_account_update_balance';
    } else {
      accountNumber = data.account_number
      balance = data.balance;
      newBalance = Number(balance) + Number(data.amount)
      topic = 'account_update_balance';
    }
    const deposit = await this.depositRepository.createDeposit({
      account_number: accountNumber,
      old_balance: balance,
      new_balance: newBalance,
      uuid: '0001',
      transaction_type: data.payment_type,
      amount: data.amount,
      transactionId: data.transactionId
    });
    await this.producerService.produce({
      topic: topic,
      messages: [
        {
          value: JSON.stringify(
            data
          ),
        },
      ],
    });
  }

  async depositProcessSuccess(data: IDepositProcessSuccess) {
    console.log('deposit success', data);
    return data;
  }

  async depositProcessFailed(data: any) {
    try {
      const deposit = await this.depositRepository.delete({ transactionId: data.transactionId })
      await this.producerService.produce({
        topic: "transfer_account_update_balance_failed",
        messages: [
          {
            value: JSON.stringify(data)
          }
        ]
      })
    } catch (error) {

    }
  }
}
