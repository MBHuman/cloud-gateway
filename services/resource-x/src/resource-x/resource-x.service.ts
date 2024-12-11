import { Injectable } from '@nestjs/common';

@Injectable()
export class ResourceXService {
  private resources: Record<string, any> = {};

  createResource(resourceId: string, data: any): void {
    this.resources[resourceId] = data;
  }

  getResource(resourceId: string): any {
    return this.resources[resourceId];
  }

  deleteResource(resourceId: string): void {
    delete this.resources[resourceId];
  }
}
