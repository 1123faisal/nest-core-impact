import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { OrgUsersService } from './org-users.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'org-jwt') {
  constructor(private orgUserService: OrgUsersService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: process.env.JWT_SECRET,
    });
  }

  async validate(payload: any) {
    const user = await this.orgUserService.findUser({ _id: payload.id });
    if (!user) {
      throw new UnauthorizedException();
    }
    return user;
  }
}
