import { Module } from '@nestjs/common';
import { ResourceXModule } from './resource-x/resource-x.module';
import { HttpModule } from '@nestjs/axios';

@Module({
  imports: [
    HttpModule,
    ResourceXModule,
  ],
})
export class AppModule {}
