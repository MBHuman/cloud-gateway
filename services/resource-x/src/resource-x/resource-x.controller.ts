import { Controller, Get, Post, Delete, Param, Body } from '@nestjs/common';
import { ResourceXService } from './resource-x.service';

@Controller()
export class ResourceXController {
  constructor(private readonly resourceXService: ResourceXService) {}

  @Post(':resourceId')
  createResource(
    @Param('resourceId') resourceId: string,
    @Body() data: any,
  ) {
    this.resourceXService.createResource(resourceId, data);
    return { message: 'Resource created successfully' };
  }

  @Get(':resourceId')
  getResource(@Param('resourceId') resourceId: string) {
    const resource = this.resourceXService.getResource(resourceId);
    if (!resource) {
      return { message: 'Resource not found' };
    }
    return resource;
  }

  @Delete(':resourceId')
  deleteResource(@Param('resourceId') resourceId: string) {
    this.resourceXService.deleteResource(resourceId);
    return { message: 'Resource deleted successfully' };
  }
}
