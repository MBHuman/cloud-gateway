
import { Injectable } from '@nestjs/common';

// This should be a real class/interface representing a user entity
export type User = any;

@Injectable()
export class UsersService {
  private readonly users = [
    {
      userId: '50679805-21ac-4948-ad43-9ac27f0b1480',
      username: 'john',
      password: 'changeme',
    },
    {
      userId: 'e8f0cc1b-2113-4efc-bbe9-7ed6a9d45d23',
      username: 'maria',
      password: 'guess',
    },
  ];

  async findOne(username: string): Promise<User | undefined> {
    return this.users.find(user => user.username === username);
  }
}
