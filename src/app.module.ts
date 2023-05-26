import { Module } from '@nestjs/common';
import { DepositConsumer } from './account/account.consumer';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { KafkajsModule } from './kafkajs/kafkajs.module';
import { DepositModule } from './deposit/deposit.module';
import { DatabaseModule } from './database/database.module';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    KafkajsModule,
    DepositModule,
    DatabaseModule,
    ConfigModule.forRoot(),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
