import { Module } from '@nestjs/common';
import { ResourceXController } from './resource-x.controller';
import { ResourceXService } from './resource-x.service';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot(),
  ],
  controllers: [ResourceXController],
  providers: [ResourceXService],
})
export class ResourceXModule {}
