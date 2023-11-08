import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class JwtAuthGuardIsAdmin extends AuthGuard('admin-jwt') {}
