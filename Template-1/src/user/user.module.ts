import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CommentService } from 'src/comment/comment.service';
import { User } from 'src/entities/user.entity';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { JwtStrategy } from 'src/auth/strategies/jwt-strategy';
import { RefreshJwtStrategy } from 'src/auth/strategies/refreshToken.strategy';
import { LocalStrategy } from 'src/auth/strategies/local-strategy';
import { AuthService } from 'src/auth/auth.service';

@Module({
  imports: [TypeOrmModule.forFeature([User])],
  controllers: [UserController],
  providers: [
    UserService,
    CommentService,
    LocalStrategy,
    JwtStrategy,
    RefreshJwtStrategy,
    AuthService,
  ],
})
export class UserModule {}
