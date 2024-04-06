import { Inject, Injectable } from '@nestjs/common';
import { ExistingUserDto } from 'src/user/dto/existing-user.dto';
import { UserService } from 'src/user/user.service';
import * as bcrypt from 'bcrypt';
import { LoginUserDto } from '../user/dto/login-user.dto';
import { JwtService } from '@nestjs/jwt';
import { Role } from './model/role.enum';
import { HttpService } from '@nestjs/axios';
import { Cache } from 'cache-manager';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';


@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
    @Inject(CACHE_MANAGER) private cacheService: Cache,
  ) {}

  async login(loginUserDto: LoginUserDto) {
    const user = await this.validateUser(
      loginUserDto.email,
      loginUserDto.password,
      loginUserDto.role,
    );

    const payload = {
      email: user.email,
      name: user.name,
      role: user.role,
      id: user.id,
    };
    const jwt = await this.jwtService.signAsync(payload);
    return { jwt };
  }

  async registerUser(user: ExistingUserDto) {
    const findUser = await this.userService.findOneByEmail(user.email);
    if (findUser) {
      throw new Error('User already exists');
    }
    const newUser = await this.userService.create(user);
    return { name: newUser.name, email: newUser.email, role: newUser.role };
  }

  async doesPasswordMatch(password: string, hashedPassword: string) {
    return bcrypt.compareSync(password, hashedPassword); // true
  }

  async validateUser(email: string, password: string, role: string) {
    const user = await this.userService.findOneByEmail(email);
    if (!user) {
      throw new Error('User not found');
    }
    const isPasswordMatching = await this.doesPasswordMatch(
      password,
      user.password,
    );
    if (!isPasswordMatching) {
      throw new Error('Invalid credentials');
    }
    return { name: user.name, email: user.email, role: user.role, id: user.id };
  }

  async verifyJwt(jwt: string) {
    const payloadReturn = await this.jwtService.verifyAsync(jwt);

    //Check if token is expired
    // if (payloadReturn.exp < Date.now()) {
    //   throw new Error('Token expired');
    // }

    return payloadReturn;
  }


}
