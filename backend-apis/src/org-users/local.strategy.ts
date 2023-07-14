import { BadRequestException, Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-local';
import { OrgUsersService } from './org-users.service';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy, 'org-local') {
  constructor(private orgUserService: OrgUsersService) {
    super({ usernameField: 'email' });
  }

  async validate(email: string, password: string): Promise<any> {
    const { passIsValid, user } = await this.orgUserService.validateUser(
      email,
      password,
    );
    if (!user) {
      throw new BadRequestException('Invalid Credentials');
    }
    return user;
  }
}
