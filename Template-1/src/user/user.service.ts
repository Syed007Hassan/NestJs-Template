import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/entities/user.entity';
import { Repository } from 'typeorm';
import { CreateUserDto, UpdateUserDto } from './dto/createUserDto';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private readonly userRepo: Repository<User>,
  ) {}
  async findOne(id: number) {
    return await this.userRepo.findOne({ where: { id: id } });
  }

  async findOneWithEmail(userEmail: string) {
    return await this.userRepo.findOne({ where: { email: userEmail } });
  }

  async create(createUserDto: CreateUserDto) {
    const userExists = await this.findOneWithEmail(createUserDto.email);

    if (userExists) {
      throw new BadRequestException('User already exists');
    }
    const user = await this.userRepo.create(createUserDto);
    await this.userRepo.save(user);
    const { password, ...result } = user;
    return result;
  }

  async update(id: number, updateUserDto: UpdateUserDto) {
    return await this.userRepo.update(id, updateUserDto);
  }
}