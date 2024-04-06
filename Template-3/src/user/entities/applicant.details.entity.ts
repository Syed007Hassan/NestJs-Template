import {
  BeforeInsert,
  BeforeUpdate,
  Column,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  JoinColumn,
  OneToOne,
} from 'typeorm';
import { Applicant } from './user.entity';
import { Education } from '../dto/education.interface';
import { ApplicantLocation } from '../dto/applicantLocation.interface';
import { Experience } from '../dto/experience.interface';
@Entity('applicantDetails')
export class ApplicantDetails {
  @PrimaryGeneratedColumn()
  applicantDetailsId: number;

  @Column({ nullable: true })
  dob: string;

  @Column({ nullable: true })
  profilePicture: string;

  @Column({ nullable: true })
  gender: string;

  @Column({ nullable: true })
  aboutMe: string;

  @Column({ nullable: true })
  phoneNo: string;

  @Column({ nullable: true, type: 'jsonb' })
  education: Education[];

  @Column({ nullable: true, type: 'jsonb' })
  skills: string[];

  @Column({ nullable: true, type: 'jsonb' })
  location: ApplicantLocation;

  @Column({ nullable: true, type: 'jsonb' })
  experience: Experience[];

  @Column({ nullable: true })
  relocation: boolean;

  @Column({ nullable: true })
  resume: string;

  @Column({ nullable: true })
  languages: string;

  //
  @OneToOne(() => Applicant, (applicant) => applicant.applicantDetails, {
    cascade: true,
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'id' })
  applicant: Applicant;
}
