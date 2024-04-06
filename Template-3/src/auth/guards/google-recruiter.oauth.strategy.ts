import { Inject, Injectable } from '@nestjs/common';
import { ConfigType } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { configDotenv } from 'dotenv';
// import { User } from '../../users/entities/user.entity';
import { Recruiter } from 'src/employer/entities/employer.entity';
import { Strategy, VerifyCallback } from 'passport-google-oauth2';

configDotenv();

@Injectable()
export class GoogleStrategyRecruiter extends PassportStrategy(
  Strategy,
  'google',
) {
  constructor() {
    // @InjectRepository(User) private userRepository: Repository<User>,
    super({
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: process.env.CALLBACK_URL_RECRUITER,
      scope: ['profile', 'email'],
    });
  }

  async validate(
    _accessToken: string,
    _refreshToken: string,
    profile: any,
    done: VerifyCallback,
  ): Promise<any> {
    const { id, name, emails, photos } = profile;

    const user = {
      provider: 'google',
      providerId: id,
      email: emails[0].value,
      name: `${name.givenName} ${name.familyName}`,
      picture: photos[0].value,
    };

    console.log(user + 'user');
    done(null, user);
  }
}
