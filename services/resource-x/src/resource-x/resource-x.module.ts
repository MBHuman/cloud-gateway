import { Module } from '@nestjs/common';
import { ResourceXController } from './resource-x.controller';
import { ResourceXService } from './resource-x.service';

@Module({
  controllers: [ResourceXController],
  providers: [ResourceXService],
})
export class ResourceXModule {}
