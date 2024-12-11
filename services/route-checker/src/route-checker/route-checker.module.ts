import { Module } from '@nestjs/common';
import { RouteCheckerController } from './route-checker.controller';
import { RouteCheckerService } from './route-checker.service';
import { HttpModule } from '@nestjs/axios';

@Module({
  imports: [HttpModule],
  controllers: [RouteCheckerController],
  providers: [RouteCheckerService],
})
export class RouteCheckerModule {}
