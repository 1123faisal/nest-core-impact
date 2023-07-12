import { BadRequestException, Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-local';
import { CoachsAuthService } from './coachs-auth.service';

@Injectable()
export class CoachLocalStrategy extends PassportStrategy(
  Strategy,
  'coach-local',
) {
  constructor(private coachService: CoachsAuthService) {
    super({ usernameField: 'email' });
  }

  async validate(email: string, password: string): Promise<any> {
    const { passIsValid, user } = await this.coachService.validateUser(
      email,
      password,
    );

    if (!user) {
      throw new BadRequestException('Invalid Credentials');
    }
    return user;
  }
}
