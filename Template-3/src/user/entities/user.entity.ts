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
// import { ApplicantDetails } from './applicant.details.entity';

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

  // @OneToMany(() => Application, (application) => application.applicant)
  // applications: Application[];

  // @OneToMany(() => AppliedJob, (appliedJob) => appliedJob.applicant)
  // appliedJobs: AppliedJob[];

  // @OneToOne(
  //   () => ApplicantDetails,
  //   (applicantDetails) => applicantDetails.applicant,
  // )
  // applicantDetails: ApplicantDetails;

}
