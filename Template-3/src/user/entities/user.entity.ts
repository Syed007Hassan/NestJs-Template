import {
  BeforeInsert,
  BeforeUpdate,
  Column,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  OneToOne,
} from 'typeorm';
import * as bcrypt from 'bcrypt';
import { Role } from '../../auth/model/role.enum';
import { Application } from '../../application/entities/application.entity';
import { ApplicantDetails } from './applicant.details.entity';
import { AppliedJob } from 'src/job/entities/appliedJob.entity';
import { HiredApplicant } from 'src/job/entities/hiredApplicant.entity';

@Entity()
export class Applicant {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: false })
  name: string;

  @Column({ nullable: false, unique: true })
  email: string;

  @Column({ nullable: false })
  password: string;

  @Column({ nullable: true, default: Role.Employee })
  role: string;

  @OneToMany(() => Application, (application) => application.applicant)
  applications: Application[];

  @OneToMany(() => AppliedJob, (appliedJob) => appliedJob.applicant)
  appliedJobs: AppliedJob[];

  @OneToOne(
    () => ApplicantDetails,
    (applicantDetails) => applicantDetails.applicant,
  )
  applicantDetails: ApplicantDetails;

  @OneToOne(() => HiredApplicant, (hiredApplicant) => hiredApplicant.applicant)
  hiredApplicant: HiredApplicant;
}
