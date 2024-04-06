import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  HttpCode,
  HttpStatus,
  UseGuards,
  Req,
  Res,
  Inject,
  UseInterceptors,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { ExistingUserDto } from 'src/user/dto/existing-user.dto';
import { LoginUserDto } from 'src/user/dto/login-user.dto';
import { JwtGuard } from './guards/jwt-auth.guard';
import { RoleGuard } from './guards/role-auth.guard';
import { Role } from './model/role.enum';
import { HasRoles } from './decorators/has-roles.decorator';
import { JwtDto } from './dto/jwt.dto';
import { CacheInterceptor } from '@nestjs/cache-manager';
import { GoogleOauthGuard } from './guards/google-recruiter.oauth.guard';
import { Response } from 'express';
import { FRONTEND_URL } from './dto/constants';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Get('google')
  @UseGuards(GoogleOauthGuard)
  async auth() {}

  // @Get('google/callback/recruiter')
  // @UseGuards(GoogleOauthGuard)
  // async googleAuthCallback(@Req() req, @Res() res: Response) {
  //   try {
  //     const token = await this.authService.oAuthLogin(req.user);
  //     console.log(JSON.stringify(token) + 'token');
  //     res.redirect(`${FRONTEND_URL}/oauth?token=${token.jwt}`);
  //   } catch (err) {
  //     res.status(500).send({ success: false, message: err.message });
  //   }
  // }


  // @ApiBearerAuth()
  // @HasRoles(Role.Employer)
  // @UseGuards(JwtGuard, RoleGuard)
  // @Post('registerCompanyEmployee/:companyId/:recruiterId')
  // async createCompanyEmployee(
  //   @Body() existingUserDto: AddCompanyEmployeeDto,
  //   @Param('companyId') companyId: string,
  //   @Param('recruiterId') recruiterId: string,
  // ) {
  //   try {
  //     const user = await this.authService.registerCompanyEmployee(
  //       existingUserDto,
  //       +companyId,
  //       +recruiterId,
  //     );
  //     return { success: true, data: user };
  //   } catch (err) {
  //     return { success: false, message: err.message };
  //   }
  // }

  @Post('registerApplicant')
  async create(@Body() existingUserDto: ExistingUserDto) {
    try {
      const user = await this.authService.registerUser(existingUserDto);
      return { success: true, data: user };
    } catch (err) {
      return { success: false, message: err.message };
    }
  }

  @Post('loginApplicant')
  @HttpCode(HttpStatus.OK)
  async login(@Body() loginUserDto: LoginUserDto) {
    try {
      const user = await this.authService.login(loginUserDto);
      return { success: true, data: user };
    } catch (err) {
      return { success: false, message: err.message };
    }
  }

  @Post('verify-jwt')
  @HttpCode(HttpStatus.OK)
  async verifyJwt(@Body() payload: JwtDto) {
    try {
      const user = await this.authService.verifyJwt(payload.jwt);
      return { success: true, data: user };
    } catch (err) {
      return { success: false, message: err.message };
    }
  }


}
