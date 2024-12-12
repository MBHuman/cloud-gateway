import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Transport, MicroserviceOptions } from '@nestjs/microservices';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  // Настройка микросервиса для обработки сообщений RabbitMQ
  app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.RMQ,
    options: {
      urls: [process.env.RABBITMQ_URL as string],
      queue: 'auth_queue',
      queueOptions: {
        durable: false,
      },
    },
  });
  console.log(`rmq url ${process.env.RABBITMQ_URL}`)
  await app.startAllMicroservices();
  await app.listen(process.env.PORT || 3001);
}
bootstrap();
