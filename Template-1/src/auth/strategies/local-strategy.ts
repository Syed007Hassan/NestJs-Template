import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-local';
import { AuthService } from '../auth.service';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private authService: AuthService) {
    super();
  }

  async validate(userEmail: string, password: string) {
    const user = await this.authService.validateUser(userEmail, password);
    console.log(user + 'user');
    if (!user) {
      throw new UnauthorizedException();
    }
    return user;
  }
}
