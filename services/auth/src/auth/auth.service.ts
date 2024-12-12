import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class AuthService {

  constructor(
    private usersService: UsersService,
    private jwtService: JwtService
  ) {}

  async validateUser(username: string, pass: string): Promise<any> {
    const user = await this.usersService.findOne(username);
    if (user && user.password === pass) {
      const { password, ...result } = user;
      return result;
    }
    return null;
  }

  async login(user: any) {
    const payload = { username: user.username, sub: user.userId };
    return {
      access_token: this.jwtService.sign(payload),
    };
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
