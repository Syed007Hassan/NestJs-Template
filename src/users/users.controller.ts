import {
  Body,
  Controller,
  Post,
  Get,
  Patch,
  Delete,
  Param,
  Query,
  NotFoundException,
  Res,
  Session,
  Request,
  UseInterceptors,
  UseGuards,
  HttpStatus,
  HttpCode,
} from '@nestjs/common';
import { CreateUserDto } from './dtos/create-user-dto';
import { UpdateUserDto } from './dtos/update-user.dto';
import { UsersService } from './users.service';
import { UserDto } from './dtos/user.dto';
import { Serialize } from '../interceptors/serialize.interceptor';
import { AuthService } from './auth/auth.service';
import { Response } from 'express';
import { CurrentUser } from './decorators/current-user-decorator';
import { CurrentUserInterceptor } from './interceptors/current-user-intetrceptor';
import { User } from './user.entity';
import { AuthGuard } from '../guards/auth.guards';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Users')
@Controller('auth')
// @Serialize(UserDto)
// @UseInterceptors(CurrentUserInterceptor)
export class UsersController {
  constructor(
    private usersService: UsersService,
    private authService: AuthService,
  ) {}

  //use guards to protect routes from unauthorized access
  // @UseGuards(AuthGuard)
  @Get('/whoami')
  whoAmI(@Request() req) {
    return req.user;
  }

  @HttpCode(HttpStatus.OK)
  @Post('/signup')
  async createUser(@Body() body: CreateUserDto, @Res() res: Response) {
    const result = await this.authService.signup(body.email, body.password);
    res.setHeader('Authorization', `Bearer ${result}`);

    // session.userId = user.id;

    return result;
  }

  @UseGuards(AuthGuard)
  @HttpCode(HttpStatus.OK)
  @Post('/signin')
  async signin(
    @Body() body: CreateUserDto,
    @Res() res: Response,
    @Session() session: any,
  ) {
    const result = await this.authService.signin(body.email, body.password);

    if (!result) {
      throw new NotFoundException('user not found');
    }

    res.setHeader('Authorization', `Bearer ${result}`);

    return res.send(result);
  }

  @Post('/signOut')
  singOut(@Session() session: any) {
    session.userId = null;
  }

  // @UseInterceptors(new SerializeInterceptor(UserDto))
  // ClassSerializerInterceptor is used to exclude the password property from the response
  @Get('/:id')
  async findUser(@Param('id') id: string) {
    const user = await this.usersService.findOne(parseInt(id));
    if (!user) {
      throw new NotFoundException('user not found');
    }
    return user;
  }

  @Get()
  async findAllUsers(@Query('email') email: string) {
    const users = await this.usersService.findByEmail(email);
    if (!users) {
      throw new NotFoundException('user not found');
    }
    return users;
  }

  @Delete('/:id')
  removeUser(@Param('id') id: string) {
    return this.usersService.remove(parseInt(id));
  }

  @Patch('/:id')
  updateUser(@Param('id') id: string, @Body() body: UpdateUserDto) {
    return this.usersService.update(parseInt(id), body);
  }
}
