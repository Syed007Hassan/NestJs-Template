import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Applicant } from './entities/user.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ApplicantDetails } from './entities/applicant.details.entity';


@Module({
  imports: [
    TypeOrmModule.forFeature([
      Applicant,
      ApplicantDetails,
    ]),
  ],
  controllers: [UserController],
  providers: [UserService],
  exports: [UserService],
})
export class UserModule {}
