import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Transport, MicroserviceOptions } from '@nestjs/microservices';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ValidationPipe } from '@nestjs/common';
import * as fs from 'fs';
import * as path from 'path';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const config = new DocumentBuilder()
    .setTitle('Router service')
    .setVersion('1.0')
    .addTag('routes')
    .addBearerAuth()
    .build();
  const documentFactory = () => SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('swagger/api', app, documentFactory);
  app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.RMQ,
    options: {
      urls: [process.env.RABBITMQ_URL as string],
      queue: 'route_queue',
      queueOptions: {
        durable: false,
      },
    },
  });
  console.log(`rmq url ${process.env.RABBITMQ_URL}`)
  app.useGlobalPipes(new ValidationPipe());

  // Ensure the directory exists
  const swaggerDir = path.resolve('./swagger');
  if (!fs.existsSync(swaggerDir)) {
    fs.mkdirSync(swaggerDir, { recursive: true });
  }

  // Write the Swagger file
  fs.writeFileSync(path.join(swaggerDir, 'swagger.json'), JSON.stringify(documentFactory(), null, 2));
  console.log('Swagger JSON file has been generated!');
  await app.startAllMicroservices();
  await app.listen(process.env.PORT || 3002);
}
bootstrap();
