import { Inject, Injectable } from '@nestjs/common';
import { ExistingUserDto } from 'src/user/dto/existing-user.dto';
import { UserService } from 'src/user/user.service';
import * as bcrypt from 'bcrypt';
import { LoginUserDto } from '../user/dto/login-user.dto';
import { JwtService } from '@nestjs/jwt';
import { EmployerService } from 'src/employer/employer.service';
import { Role } from './model/role.enum';
import { ExistingEmployerDto } from 'src/employer/dto/existing-employer.dto';
import { LoginEmployerDto } from 'src/employer/dto/login-employer.dto';
import { HttpService } from '@nestjs/axios';
import { Cache } from 'cache-manager';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { CompanyService } from 'src/company/company.service';
import { CreateCompanyDto } from 'src/company/dto/create-company.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Recruiter } from 'src/employer/entities/employer.entity';
import { Repository } from 'typeorm';
import { AddCompanyEmployeeDto } from 'src/employer/dto/add-employee.company.dto';
import { Company } from 'src/company/entities/company.entity';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(Recruiter)
    private readonly employerRepo: Repository<Recruiter>,
    @InjectRepository(Company)
    private readonly companyRepo: Repository<Company>,
    private userService: UserService,
    private employerService: EmployerService,
    private jwtService: JwtService,
    private companyService: CompanyService,
    private readonly httpService: HttpService,
    @Inject(CACHE_MANAGER) private cacheService: Cache,
  ) {}

  // async oAuthLogin(user) {
  //   if (!user) {
  //     throw new Error('User not found!!!');
  //   }

  //   let userExist = await this.employerRepo.findOne({
  //     where: { email: user.email },
  //     relations: ['company'],
  //   });

  //   if (!userExist) {
  //     userExist = await this.registerEmployerOauth(user);
  //   }

  //   const payload = {
  //     recruiterId: userExist.recruiterId,
  //     email: userExist.email,
  //     name: userExist.name,
  //     companyId: userExist.company.companyId,
  //     role: userExist.role,
  //   };
  //   const jwt = await this.jwtService.sign(payload);

  //   return { jwt };
  // }

  // async registerEmployerOauth(user) {
  //   const findUser = await this.employerService.findOneByEmail(user.email);
  //   if (findUser) {
  //     throw new Error('Recruiter already exists with this email');
  //   }

  //   const company = await this.companyService.create({
  //     companyName: ' ',
  //     companyEmail: ' ',
  //     companyAddress: ' ',
  //     companyProfile: ' ',
  //     companyPhone: 0,
  //     companyWebsite: ' ',
  //   });

  //   const newUser = await this.employerRepo.create({
  //     name: user.name,
  //     email: user.email,
  //     password: '',
  //     phone: '',
  //     designation: '',
  //     role: Role.Employer,
  //     company,
  //   });

  //   return await this.employerRepo.save(newUser);
  // }


  async login(loginUserDto: LoginUserDto) {
    const user = await this.validateUser(
      loginUserDto.email,
      loginUserDto.password,
      loginUserDto.role,
    );

    const payload = {
      email: user.email,
      name: user.name,
      role: user.role,
      id: user.id,
    };
    const jwt = await this.jwtService.signAsync(payload);
    return { jwt };
  }

  async registerUser(user: ExistingUserDto) {
    const findUser = await this.userService.findOneByEmail(user.email);
    if (findUser) {
      throw new Error('User already exists');
    }
    const newUser = await this.userService.create(user);
    return { name: newUser.name, email: newUser.email, role: newUser.role };
  }

  async doesPasswordMatch(password: string, hashedPassword: string) {
    return bcrypt.compareSync(password, hashedPassword); // true
  }

  async validateUser(email: string, password: string, role: string) {
    const user = await this.userService.findOneByEmail(email);
    if (!user) {
      throw new Error('User not found');
    }
    const isPasswordMatching = await this.doesPasswordMatch(
      password,
      user.password,
    );
    if (!isPasswordMatching) {
      throw new Error('Invalid credentials');
    }
    return { name: user.name, email: user.email, role: user.role, id: user.id };
  }

  async verifyJwt(jwt: string) {
    const payloadReturn = await this.jwtService.verifyAsync(jwt);

    //Check if token is expired
    // if (payloadReturn.exp < Date.now()) {
    //   throw new Error('Token expired');
    // }

    return payloadReturn;
  }


}
