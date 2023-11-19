import { Inject, Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from '../entities/user.entity';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { InjectRepository } from '@nestjs/typeorm';
import { HttpService } from '@nestjs/axios';
import { Cache } from 'cache-manager';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { exec } from 'child_process';
import { writeFile } from 'fs/promises';
import { join, resolve } from 'path';
import { promises as fs } from 'fs';
import * as Docker from 'dockerode';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private readonly userRepo: Repository<User>,
    private readonly httpService: HttpService,
    @Inject(CACHE_MANAGER) private cacheService: Cache,
  ) {}

  async loadDataBaseDump() {
    // Define the path to the dump file
    const dumpFilePath = resolve(
      __dirname,
      '../../src/dbDumpFile/postgres.tar',
    );

    // Check if the dump file exists
    try {
      await fs.access(dumpFilePath);
    } catch (error) {
      console.error(`Dump file not found: ${dumpFilePath}`);
      return;
    }

    //pg restore database dump
    // const command = `docker-compose exec postgres pg_restore --verbose --clean --no-acl --no-owner -h ${process.env.PG_HOST} -U ${process.env.PG_USER} -d ${process.env.PG_DB} ${dumpFilePath}`;
    const command = `"/c/Program Files/Docker/Docker/resources/bin/docker-compose" logs postgres`;

    try {
      const docker = new Docker({ socketPath: '/var/run/docker.sock' });

      docker.listContainers((err, containers) => {
        if (err) {
          console.log('Error:', err);
        } else {
          console.log('Container Information:', containers);
        }
      });

      // const container = docker.getContainer('postgres');

      // console.log('container', container);

      // const stream = await container.logs({
      //   follow: true,
      //   stdout: true,
      //   stderr: true,
      // });

      // stream.on('data', (data) => console.log(data.toString()));
      // stream.on('end', () => console.log('End of logs'));
    } catch (error) {
      console.error(`Error is: ${error}`);
    }
  }

  // try {
  //   const result = await new Promise((resolve, reject) => {
  //     exec(command, (error, stdout, stderr) => {
  //       if (error) {
  //         console.error(`exec error: ${error}`);
  //         reject(error);
  //         return;
  //       }
  //       console.log(`stdout: ${stdout}`);
  //       console.error(`stderr: ${stderr}`);
  //       resolve({ stdout, stderr });
  //     });
  //   });
  //   return result;
  // } catch (error) {
  //   console.error(`Error executing pg_restore: ${error}`);
  // }

  async create(createUserDto: CreateUserDto): Promise<User> {
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

  update(id: number, updateUserDto: UpdateUserDto) {
    return `This action updates a #${id} user`;
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }

  async getPokemon(id: number): Promise<string> {
    // check if data is in cache:
    const cachedData = await this.cacheService.get<{ name: string }>(
      id.toString(),
    );
    if (cachedData) {
      console.log(`Getting data from cache!`);
      return `${cachedData.name}`;
    }

    // if not, call API and set the cache:
    const { data } = await this.httpService.axiosRef.get(
      `https://pokeapi.co/api/v2/pokemon/${id}`,
    );
    await this.cacheService.set(id.toString(), data);
    return await `${data.name}`;
  }
}
