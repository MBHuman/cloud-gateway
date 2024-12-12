import { Controller, Get, Param, Query } from '@nestjs/common';
import { RouteCheckerService } from './route-checker.service';
import { MessagePattern, Payload } from '@nestjs/microservices';

@Controller('route-checker')
export class RouteCheckerController {
  constructor(private readonly routeCheckerService: RouteCheckerService) {}

  @Get('get_resoure')
  checkAccess(
    @Query('userId') userId: string,
    @Query('resourceId') resourceId: string,
  ) {
    console.log(`userId: ${userId} resourceId: ${resourceId}`)
    return this.handleCheckAccess({userId, resourceId})
  }

  @MessagePattern({ cmd: 'check_access' })
  async handleCheckAccess(@Payload() data: { userId: string; resourceId: string }) {
    const { userId, resourceId } = data;
    console.log(userId, resourceId)
    const isAllowed = await this.routeCheckerService.checkUserAccess(userId, resourceId);
    return isAllowed;
  }
}
