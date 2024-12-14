import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserInfo, UsersService } from 'src/users/users.service';
import { Auth } from './entities/auth.entity';
import { AuthInfoDto } from './dto/authInfo.dto';
import { ApiOperation, ApiTags } from '@nestjs/swagger';

@Injectable()
export class AuthService {

  private userResources: Map<string, Set<string>>

  constructor(
    private usersService: UsersService,
    private jwtService: JwtService
  ) {
    this.userResources = new Map();
  }

  async validateUser(username: string, pass: string): Promise<any> {
    const user = await this.usersService.findOne(username);
    if (user && user.password === pass) {
      const { password, ...result } = user;
      return result;
    }
    return null;
  }

  async login(user: UserInfo) {
    const payload = { username: user.username, sub: user.userId };
    const accessToken = this.jwtService.sign(payload, { expiresIn: '1d' });
    const refreshToken = this.jwtService.sign(payload, { expiresIn: '7d' });
    return {
      accessToken,
      refreshToken,
    };
  }
  
  async refresh(refreshToken: string): Promise<Auth> {
    try {
      const payload = this.jwtService.verify(refreshToken);
      const newPayload = { username: payload.username, sub: payload.sub };
      const accessToken = this.jwtService.sign(newPayload, { expiresIn: '1d' });
      const newRefreshToken = this.jwtService.sign(newPayload, { expiresIn: '7d' });
      return {
        accessToken,
        refreshToken: newRefreshToken,
      };
    } catch (e) {
      throw new UnauthorizedException('Invalid refresh token');
    }
  }


  async getUserResources(userId: string): Promise<string[]> {
    // Получаем ресурсы пользователя
    if(!this.userResources.has(userId)) {
      return [];
    }
    const resources = Array.from(this.userResources.get(userId));
    console.log(`getUserResources: ${JSON.stringify(this.userResources, null, 2)}`);
    return resources;
  }
  
  async addUserResource(userId: string, resource: string): Promise<void> {
    if(!this.userResources.has(userId)) {
      this.userResources.set(userId, new Set())
    }
    this.userResources.get(userId).add(resource);
  }
  
  async removeUserResource(userId: string, resource: string): Promise<void> {
    this.userResources.get(userId).delete(resource);
  }

  async handleCheckAccess(data: { userId: string; resourceId: string }): Promise<boolean> {
    const { userId, resourceId } = data;
    const resources = await this.getUserResources(userId);
    return resources.includes(resourceId);
  }
}
