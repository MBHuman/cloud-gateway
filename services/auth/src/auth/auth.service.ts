import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { RedisService } from 'nestjs-redis';
import { Redis } from 'ioredis';

@Injectable()
export class AuthService {
  private redisClient: Redis;

  constructor(
    private readonly jwtService: JwtService,
    private readonly redisService: RedisService,
  ) {
    this.redisClient = this.redisService.getClient();
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
    const resources = await this.redisClient.smembers(`user:${userId}:resources`);
    return resources;
  }

  async addUserResource(userId: string, resource: string): Promise<void> {
    await this.redisClient.sadd(`user:${userId}:resources`, resource);
  }

  async removeUserResource(userId: string, resource: string): Promise<void> {
    await this.redisClient.srem(`user:${userId}:resources`, resource);
  }

  async handleCheckAccess(data: { userId: string; resourceId: string }): Promise<boolean> {
    const { userId, resourceId } = data;
    const resources = await this.getUserResources(userId);
    return resources.includes(resourceId);
  }
}
