import { Controller, Get, Post, Body, Param, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  // Получить доступные ресурсы для пользователя
  @UseGuards(JwtAuthGuard)
  @Get('users/:userId/resources')
  getUserResources(@Param('userId') userId: string) {
    return this.authService.getUserResources(userId);
  }

  // Добавить ресурс пользователю
  @UseGuards(JwtAuthGuard)
  @Post('users/:userId/resources')
  addUserResource(
    @Param('userId') userId: string,
    @Body('resource') resource: string,
  ) {
    return this.authService.addUserResource(userId, resource);
  }

  // Удалить ресурс у пользователя
  @UseGuards(JwtAuthGuard)
  @Post('users/:userId/resources/remove')
  removeUserResource(
    @Param('userId') userId: string,
    @Body('resource') resource: string,
  ) {
    return this.authService.removeUserResource(userId, resource);
  }
}
