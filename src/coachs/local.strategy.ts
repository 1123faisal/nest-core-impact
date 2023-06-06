import { BadRequestException, Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-local';
import { CoachsService } from './coachs.service';
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
    const user = await this.coachService.validateUser(email, password);

    if (!user) {
      throw new BadRequestException('Invalid Email or Password.');
    }
    return user;
  }
}
