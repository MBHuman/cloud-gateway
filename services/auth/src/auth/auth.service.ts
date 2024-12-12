import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {

  constructor(
    private readonly jwtService: JwtService,
  ) {
  }

  async validateUser(token: string): Promise<any> {
    try {
      const decoded = this.jwtService.verify(token);
      const userId = decoded.sub;
      const user = await this.getUserResources(userId);
      if (!user) {
        throw new UnauthorizedException();
      }
      return user;
    } catch (error) {
      throw new UnauthorizedException();
    }
  }

  async getUserResources(userId: string): Promise<string[]> {
    // const resources = await this.redisClient.smembers(`user:${userId}:resources`);
    const resources = ['resource']
    return resources;
  }

  async addUserResource(userId: string, resource: string): Promise<void> {
    console.log(`add user resource ${userId} ${resource}`)
    // await this.redisClient.sadd(`user:${userId}:resources`, resource);
  }

  async removeUserResource(userId: string, resource: string): Promise<void> {
    console.log(`removeUserResources ${userId} ${resource}`)
    // await this.redisClient.srem(`user:${userId}:resources`, resource);
  }

  async handleCheckAccess(data: { userId: string; resourceId: string }): Promise<boolean> {
    const { userId, resourceId } = data;
    const resources = await this.getUserResources(userId);
    return resources.includes(resourceId);
  }
}
