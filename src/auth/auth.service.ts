import { Injectable } from '@nestjs/common';
import { UserService } from 'src/user/user.service';
import * as bcrypt from 'bcrypt';
import { User } from 'src/entities/user.entity';
import { JwtService } from '@nestjs/jwt';
import { LoginDto } from './dto/LoginDto';
@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private jwtService: JwtService,
  ) {}

  async validateUser(userEmail: string, password: string) {
    console.log('hello');
    const user = await this.userService.findOneWithEmail(userEmail);
    if (user && (await bcrypt.compare(password, user.password))) {
      const { password, ...result } = user;
      return result;
    }
    return null;
  }

  async login(user: LoginDto) {
    const payload = {
      email: user.email,
      sub: {
        password: user.password,
      },
    };

    return {
      ...user,
      accessToken: this.jwtService.sign(payload),
      refreshToken: this.jwtService.sign(payload, { expiresIn: '7d' }),
    };
  }

  async refreshToken(user: User) {
    const payload = {
      username: user.email,
      sub: {
        name: user.name,
      },
    };

    return {
      accessToken: this.jwtService.sign(payload),
    };
  }
}
