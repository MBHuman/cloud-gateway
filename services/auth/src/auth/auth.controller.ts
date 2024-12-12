import { Controller, Get, Post, Body, Param, UseGuards } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import { AuthService } from './auth.service';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  // HTTP API для получения ресурсов пользователя
  @UseGuards(JwtAuthGuard)
  @Get('users/:userId/resources')
  getUserResources(@Param('userId') userId: string) {
    return this.authService.getUserResources(userId);
  }

  // HTTP API для добавления ресурса пользователю
  @UseGuards(JwtAuthGuard)
  @Post('users/:userId/resources')
  addUserResource(
    @Param('userId') userId: string,
    @Body('resource') resource: string,
  ) {
    return this.authService.addUserResource(userId, resource);
  }

  // HTTP API для удаления ресурса у пользователя
  @UseGuards(JwtAuthGuard)
  @Post('users/:userId/resources/remove')
  removeUserResource(
    @Param('userId') userId: string,
    @Body('resource') resource: string,
  ) {
    return this.authService.removeUserResource(userId, resource);
  }

  // RabbitMQ: обработка запроса на получение ресурсов пользователя
  @MessagePattern({ cmd: 'get_user_resources' })
  async handleGetUserResources(data: { userId: string }) {
    console.log(`userId ${data.userId}`)
    return this.authService.getUserResources(data.userId);
  }

  // RabbitMQ: обработка добавления ресурса пользователю
  @MessagePattern({ cmd: 'add_user_resource' })
  async handleAddUserResource(data: { userId: string; resource: string }) {
    return this.authService.addUserResource(data.userId, data.resource);
  }

  // RabbitMQ: обработка удаления ресурса у пользователя
  @MessagePattern({ cmd: 'remove_user_resource' })
  async handleRemoveUserResource(data: { userId: string; resource: string }) {
    return this.authService.removeUserResource(data.userId, data.resource);
  }
}
