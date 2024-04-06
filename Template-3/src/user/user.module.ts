import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Applicant } from './entities/user.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ApplicantDetails } from './entities/applicant.details.entity';
import { Application } from 'src/application/entities/application.entity';
import { Job } from 'src/job/entities/job.entity';
import { WorkFlow } from 'src/workflow/entities/workflow.entity';
import { Stage } from 'src/workflow/entities/stage.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Applicant,
      ApplicantDetails,
      Application,
      Job,
      WorkFlow,
      Stage,
    ]),
  ],
  controllers: [UserController],
  providers: [UserService],
  exports: [UserService],
})
export class UserModule {}
