import { Module } from '@nestjs/common';
import { RouterModule } from './router/router.module';
import { ClientsModule, Transport } from '@nestjs/microservices';

@Module({
    imports: [
        RouterModule,
    ]
})
export class AppModule { }
