import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { KafkajsModule } from 'src/kafkajs/kafkajs.module';
import { DepositConsumer } from './deposit.consumer';
import { DepositService } from './deposit.service';
import { Deposit } from './entities/deposit.entity';
import { DepositRepository } from './repository/deposite.repository';

@Module({
  imports: [KafkajsModule, TypeOrmModule.forFeature([Deposit])],
  providers: [DepositService, DepositConsumer, DepositRepository],
})
export class DepositModule {}
