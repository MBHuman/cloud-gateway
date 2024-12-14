import { Controller, Get, Post, Body, Param, UseGuards, Request } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import { AuthService } from './auth.service';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { LocalAuthGuard } from 'src/common/guards/local-auth.guard';
import { ApiBasicAuth, ApiBearerAuth, ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { AuthInfoDto } from './dto/authInfo.dto';
import { Auth } from './entities/auth.entity';
import { RefreshDto } from './dto/refresh.dto';
import { UserInfo } from 'src/users/users.service';
import { ResourcesDto } from './dto/resources.dto';

@Controller('auth')
@ApiTags('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @UseGuards(LocalAuthGuard)
  @ApiOperation({summary: "login with username and password"})
  @ApiBody({type: AuthInfoDto})
  @ApiResponse({status: 201, type: Auth})
  @Post('login')
  async login(@Request() req) {
    return this.authService.login(req.user);
  }

  @Post('refresh')
  @ApiOperation({summary: "refresh token"})
  @ApiResponse({status: 201, type: Auth})
  async refresh(@Body() refreshDto: RefreshDto): Promise<Auth> {
    return this.authService.refresh(refreshDto.refreshToken);
  }

  @UseGuards(JwtAuthGuard)
  @ApiOperation({summary: "get profile info"})
  @ApiResponse({type: UserInfo})
  @ApiBearerAuth()
  @Get('profile')
  getProfile(@Request() req) {
    return req.user;
  }

  // HTTP API для получения ресурсов пользователя
  @UseGuards(JwtAuthGuard)
  @ApiOperation({summary: "get user resources"})
  @ApiResponse({type: UserInfo})
  @ApiBearerAuth()
  @Get('users/:userId/resources')
  getUserResources(@Param('userId') userId: string) {
    return this.authService.getUserResources(userId);
  }

  // HTTP API для добавления ресурса пользователю
  @UseGuards(JwtAuthGuard)
  @ApiOperation({summary: "add user resource"})
  @ApiBearerAuth()
  @ApiResponse({status: 201})
  @Post('users/:userId/resources')
  addUserResource(@Body() resource: ResourcesDto, @Param("userId") userId: string) {
    return this.authService.addUserResource(userId, resource.resource);
  }

  // HTTP API для удаления ресурса у пользователя
  @UseGuards(JwtAuthGuard)
  @ApiOperation({summary: "delete user resource"})
  @ApiBearerAuth()
  @Post('users/:userId/resources/remove')
  @ApiResponse({status: 201})
  removeUserResource(@Body() resource: ResourcesDto, @Param("userId") userId: string) {
    return this.authService.removeUserResource(userId, resource.resource);
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
