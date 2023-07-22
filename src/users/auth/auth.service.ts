import { Injectable } from '@nestjs/common/decorators';
import { UsersService } from '../users.service';
import {
  BadRequestException,
  InternalServerErrorException,
} from '@nestjs/common';
import { randomBytes, scrypt as _scrypt } from 'crypto';
import { promisify } from 'util';
import { JwtService } from '@nestjs/jwt';

const scrypt = promisify(_scrypt);
@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async signup(email: string, password: string) {
    //see if email is in use

    const users = await this.usersService.findByEmail(email);

    if (users) {
      throw new BadRequestException('Email already in use');
    }

    const salt = randomBytes(8).toString('hex'); //generate salt
    const hash = (await scrypt(password, salt, 32)) as Buffer; //hash users password
    const result = salt + '.' + hash.toString('hex'); //store salt and hash together

    const user = await this.usersService.create(email, result); //create user

    const payload = { sub: user.id, username: user.email };

    // return { id: user.id, email: user.email, access_token: access_token };

    return {
      access_token: await this.jwtService.signAsync(payload),
    };
  }

  async signin(email: string, password: string) {
    try {
      const user = await this.usersService.findByEmail(email);

      if (!user) {
        throw new BadRequestException('Invalid credentials');
      }

      const [salt, storedHash] = user.password.split('.');
      const hash = (await scrypt(password, salt, 32)) as Buffer;
      if (storedHash !== hash.toString('hex')) {
        throw new BadRequestException('Invalid credentials');
      }

      const payload = { sub: user.id, username: user.email };
      return {
        access_token: await this.jwtService.signAsync(payload),
      };
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }
}
