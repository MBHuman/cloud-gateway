import { Module } from '@nestjs/common';
import { RouteCheckerModule } from './route-checker/route-checker.module';
import { ClientsModule, Transport } from '@nestjs/microservices';

@Module({
  imports: [
    RouteCheckerModule,
  ],
})
export class AppModule { }
