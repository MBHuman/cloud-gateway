import { Controller } from '@nestjs/common';
import { RouteCheckerService } from './route-checker.service';
import { MessagePattern, Payload } from '@nestjs/microservices';

@Controller()
export class RouteCheckerController {
  constructor(private readonly routeCheckerService: RouteCheckerService) {}

  @MessagePattern({ cmd: 'check_access' })
  async handleCheckAccess(@Payload() data: { userId: string; resourceId: string }) {
    const { userId, resourceId } = data;
    const isAllowed = await this.routeCheckerService.checkUserAccess(userId, resourceId);
    return isAllowed;
  }
}
