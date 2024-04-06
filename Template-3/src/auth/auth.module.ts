import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UserModule } from 'src/user/user.module';
import { JwtModule } from '@nestjs/jwt';
import { JwtGuardStrategy } from './guards/jwt-auth.strategy';
import { JwtGuard } from './guards/jwt-auth.guard';
import { EmployerModule } from 'src/employer/employer.module';
import { HttpModule, HttpService } from '@nestjs/axios';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { CompanyModule } from 'src/company/company.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Recruiter } from 'src/employer/entities/employer.entity';
import { Company } from 'src/company/entities/company.entity';
import { GoogleOauthGuard } from './guards/google-recruiter.oauth.guard';
import { GoogleStrategyRecruiter } from './guards/google-recruiter.oauth.strategy';
@Module({
  imports: [
    TypeOrmModule.forFeature([Recruiter, Company]),
    HttpModule,
    UserModule,
    EmployerModule,
    CompanyModule,
    JwtModule.registerAsync({
      useFactory: () => ({
        secret: process.env.JWT_SECRET,
        signOptions: {
          expiresIn: '3d',
        },
        global: true,
      }),
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtGuardStrategy, JwtGuard, GoogleStrategyRecruiter],
})
export class AuthModule {}
