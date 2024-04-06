import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { Applicant } from './entities/user.entity';
import { ApplicantDetails } from './entities/applicant.details.entity';
import { Repository, Raw } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { InjectRepository } from '@nestjs/typeorm';
import { ApplicantDetailsDto } from './dto/applicantDetails.dto';
import { Application } from 'src/application/entities/application.entity';
import { Job } from 'src/job/entities/job.entity';
import { WorkFlow } from 'src/workflow/entities/workflow.entity';
import { Stage } from 'src/workflow/entities/stage.entity';
@Injectable()
export class UserService {
  constructor(
    @InjectRepository(Applicant)
    private readonly userRepo: Repository<Applicant>,
    @InjectRepository(ApplicantDetails)
    private readonly applicantDetailsRepo: Repository<ApplicantDetails>,
    @InjectRepository(Application)
    private readonly applicationRepo: Repository<Application>,
    @InjectRepository(Job)
    private readonly jobRepo: Repository<Job>,
    @InjectRepository(WorkFlow)
    private readonly workflowRepo: Repository<WorkFlow>,
    @InjectRepository(Stage)
    private readonly stageRepo: Repository<Stage>,
  ) {}

  async create(createUserDto: CreateUserDto): Promise<Applicant> {
    const saltRounds = 10;
    const hash = bcrypt.hashSync(createUserDto.password, saltRounds);
    const newUser = await this.userRepo.create({
      ...createUserDto,
      password: hash,
    });

    await this.userRepo.save(newUser);

    return newUser;
  }

  async findAll() {
    const users = await this.userRepo.find();
    if (!users) {
      throw new Error('No users found');
    }
    return users;
  }

  async findOneByEmail(email: string) {
    const user = await this.userRepo.findOneBy({ email });
    return user;
  }

  findOne(id: number) {
    const user = this.userRepo.findOneBy({ id });
    return user;
  }

  async createApplicantDetails(
    id: number,
    applicantDetailsDto: ApplicantDetailsDto,
  ) {
    const user = await this.userRepo.findOneBy({ id });

    if (!user) {
      throw new Error('Applicant not found');
    }

    const existingApplicantDetails = await this.applicantDetailsRepo.findOne({
      where: { applicant: { id: id } },
      relations: ['applicant'],
    });

    if (existingApplicantDetails) {
      const updatedApplicantDetails = await this.applicantDetailsRepo.merge(
        existingApplicantDetails,
        applicantDetailsDto,
      );

      return await this.applicantDetailsRepo.save(updatedApplicantDetails);
    } else {
      const newUserApplicantDetails = await this.applicantDetailsRepo.create({
        ...applicantDetailsDto,
        applicant: user,
      });
      return await this.applicantDetailsRepo.save(newUserApplicantDetails);
    }
  }

  async findApplicantDetails(id: number) {
    const user = await this.userRepo.findOneBy({ id });

    if (!user) {
      throw new Error('Applicant not found');
    }

    const applicantDetails = await this.applicantDetailsRepo.findOne({
      where: { applicant: { id: id } },
      relations: ['applicant'],
    });

    if (!applicantDetails) {
      throw new Error('Applicant details not found');
    }

    return applicantDetails;
  }

  //
  async updateContact(id: number, updateUserDto) {
    const user = await this.applicantDetailsRepo.findOne({
      where: { applicant: { id: id } },
      relations: ['applicant'],
    });

    if (!user) {
      throw new Error('User not found');
    }

    const updatedUser = await this.applicantDetailsRepo.merge(
      user,
      updateUserDto,
    );

    return await this.applicantDetailsRepo.save(updatedUser);
  }

  async updateEducationDetails(id: number, updateUserDto) {
    const user = await this.applicantDetailsRepo.findOne({
      where: { applicant: { id: id } },
      relations: ['applicant'],
    });

    if (!user) {
      throw new Error('User not found');
    }

    const updatedUser = await this.applicantDetailsRepo.merge(
      user,
      updateUserDto,
    );

    return await this.applicantDetailsRepo.save(updatedUser);
  }

  async updateExperienceDetails(id: number, updateUserDto) {
    const user = await this.applicantDetailsRepo.findOne({
      where: { applicant: { id: id } },
      relations: ['applicant'],
    });

    if (!user) {
      throw new Error('User not found');
    }

    const updatedUser = await this.applicantDetailsRepo.merge(
      user,
      updateUserDto,
    );

    return await this.applicantDetailsRepo.save(updatedUser);
  }

  async updateSkills(id: number, updateUserDto) {
    const user = await this.applicantDetailsRepo.findOne({
      where: { applicant: { id: id } },
      relations: ['applicant'],
    });

    if (!user) {
      throw new Error('User not found');
    }

    const updatedUser = await this.applicantDetailsRepo.merge(
      user,
      updateUserDto,
    );

    return await this.applicantDetailsRepo.save(updatedUser);
  }

  async findAllJobApplicationsCount(id: number) {
    const user = await this.userRepo.findOneBy({ id });

    if (!user) {
      throw new Error('User not found');
    }

    const applications = await this.applicationRepo.find({
      where: { applicant: { id: id } },
      relations: ['applicant', 'job', 'stage'],
    });

    if (!applications) {
      throw new Error('No applications found');
    }

    return applications.length;
  }

  async findAllJobApplicationsByStatusCount(id: number, status: string) {
    const user = await this.userRepo.findOneBy({ id });

    if (!user) {
      throw new Error('User not found');
    }

    const applications = await this.applicationRepo.find({
      where: {
        applicant: { id: id },
        status: Raw((columnAlias) => `LOWER(${columnAlias}) = LOWER(:status)`, {
          status,
        }),
      },
      relations: ['applicant', 'job', 'stage'],
    });

    if (applications.length === 0) {
      throw new Error('No applications found');
    }

    return applications.length;
  }

  async findRecentJobApplicationsWithFeedback(id: number) {
    const user = await this.userRepo.findOneBy({ id });

    if (!user) {
      throw new Error('User not found');
    }

    const applications = await this.applicationRepo.find({
      where: {
        applicant: { id: id },
        status: Raw((columnAlias) => `LOWER(${columnAlias}) = LOWER(:status)`, {
          status: 'rejected',
        }),
        applicationFeedback: Raw((columnAlias) => `${columnAlias} IS NOT NULL`),
      },
      relations: ['applicant', 'job', 'stage'],
    });

    if (applications.length === 0) {
      throw new Error('No applications found');
    }

    const mappedApplications = applications.map((application) => ({
      jobTitle: application.job.jobTitle,
      jobLocation: application.job.jobLocation,
      jobSkills: application.job.jobSkills,
      applicationStatus: application.status,
      applicationDate:
        new Date(application.applicationDate).getDate() +
        '/' +
        new Date(application.applicationDate).getMonth() +
        '/' +
        new Date(application.applicationDate).getFullYear(),
      applicationFeedback: application.applicationFeedback,
      applicationRating: application.applicationRating,
      stageName: application.stage.stageName,
      stageCategory: application.stage.category,
    }));
    return mappedApplications;
  }

  async findAllJobApplicationsByMonth(id: number) {
    const user = await this.userRepo.findOneBy({ id });

    if (!user) {
      throw new Error('User not found');
    }

    const applications = await this.applicationRepo.find({
      where: { applicant: { id: id } },
      relations: ['applicant', 'job', 'stage'],
    });

    if (!applications) {
      throw new Error('No applications found');
    }

    const applicationsByMonth = applications.reduce((acc, application) => {
      const date = new Date(application.applicationDate);
      const yearMonth = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`; // getMonth() returns a zero-based value (0-11)

      if (!acc[yearMonth]) {
        acc[yearMonth] = 0;
      }

      acc[yearMonth]++;

      return acc;
    }, {});

    return applicationsByMonth;
  }

  remove(id: number) {
    return `#${id} user deleted`;
  }
}
