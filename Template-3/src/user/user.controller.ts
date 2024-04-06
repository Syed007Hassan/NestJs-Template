import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  UseGuards,
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { ApiBearerAuth, ApiBody, ApiTags } from '@nestjs/swagger';
import { ApplicantDetailsDto } from './dto/applicantDetails.dto';
import { HasRoles } from 'src/auth/decorators/has-roles.decorator';
import { Role } from 'src/auth/model/role.enum';
import { JwtGuard } from 'src/auth/guards/jwt-auth.guard';
import { RoleGuard } from 'src/auth/guards/role-auth.guard';

@ApiTags('User/Candidate')
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('create')
  async create(@Body() createUserDto: CreateUserDto) {
    try {
      const user = await this.userService.create(createUserDto);
      return { success: true, data: user };
    } catch (err) {
      return { success: false, message: err.message };
    }
  }

  @Get('findAll')
  async findAll() {
    try {
      const users = await this.userService.findAll();
      return { success: true, data: users };
    } catch (err) {
      return { success: false, message: err.message };
    }
  }

  @Get('findOne/:id')
  findOne(@Param('id') id: string) {
    return this.userService.findOne(+id);
  }

  @Get('findOneByEmail/:email')
  async findOneByEmail(@Param('email') email: string) {
    try {
      const user = await this.userService.findOneByEmail(email);
      return { success: true, data: user };
    } catch (err) {
      return { success: false, message: err.message };
    }
  }

  @ApiBearerAuth()
  @HasRoles(Role.Employee)
  @UseGuards(JwtGuard, RoleGuard)
  @Post('createApplicantDetails/:id')
  async createApplicantDetails(
    @Param('id') id: string,
    @Body() applicantDetailsDto: ApplicantDetailsDto,
  ) {
    try {
      const user = await this.userService.createApplicantDetails(
        +id,
        applicantDetailsDto,
      );
      return { success: true, data: user };
    } catch (err) {
      return { success: false, message: err.message };
    }
  }

  @Get('findApplicantDetails/:id')
  async findApplicantDetails(@Param('id') id: string) {
    try {
      const user = await this.userService.findApplicantDetails(+id);
      return { success: true, data: user };
    } catch (err) {
      return { success: false, message: err.message };
    }
  }

  @ApiBearerAuth()
  @HasRoles(Role.Employee)
  @UseGuards(JwtGuard, RoleGuard)
  @Patch('updateContactDetails/:id')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        phoneNo: { type: 'string' },
        location: {
          type: 'object',
          properties: {
            area: { type: 'string' },
            city: { type: 'string' },
            country: { type: 'string' },
            latitude: { type: 'string' },
            longitude: { type: 'string' },
          },
        },
      },
    },
  })
  async update(@Param('id') id: string, @Body() updateUserDto) {
    try {
      const user = await this.userService.updateContact(+id, updateUserDto);
      return { success: true, data: user };
    } catch (err) {
      return { success: false, message: err.message };
    }
  }

  @ApiBearerAuth()
  @HasRoles(Role.Employee)
  @UseGuards(JwtGuard, RoleGuard)
  @Patch('updateEducationDetails/:id')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        education: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              degree: { type: 'string' },
              institution: { type: 'string' },
              startDate: { type: 'string' },
              endDate: { type: 'string' },
            },
          },
        },
      },
    },
  })
  async updateEducationDetails(@Param('id') id: string, @Body() updateUserDto) {
    try {
      const user = await this.userService.updateEducationDetails(
        +id,
        updateUserDto,
      );
      return { success: true, data: user };
    } catch (err) {
      return { success: false, message: err.message };
    }
  }

  @ApiBearerAuth()
  @HasRoles(Role.Employee)
  @UseGuards(JwtGuard, RoleGuard)
  @Patch('updateExperienceDetails/:id')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        experience: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              company: { type: 'string' },
              title: { type: 'string' },
              startDate: { type: 'string' },
              endDate: { type: 'string' },
              description: { type: 'string' },
            },
          },
        },
      },
    },
  })
  async updateExperienceDetails(
    @Param('id') id: string,
    @Body() updateUserDto,
  ) {
    try {
      const user = await this.userService.updateExperienceDetails(
        +id,
        updateUserDto,
      );
      return { success: true, data: user };
    } catch (err) {
      return { success: false, message: err.message };
    }
  }

  @ApiBearerAuth()
  @HasRoles(Role.Employee)
  @UseGuards(JwtGuard, RoleGuard)
  @Patch('updateSkillDetails/:id')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        aboutMe: { type: 'string' },
        skills: {
          type: 'array',
          items: { type: 'string' },
        },
      },
    },
  })
  async updateSkills(@Param('id') id: string, @Body() updateUserDto) {
    try {
      const user = await this.userService.updateSkills(+id, updateUserDto);
      return { success: true, data: user };
    } catch (err) {
      return { success: false, message: err.message };
    }
  }

  @Get('findAllJobApplicationsByStatusCount/:id/:status')
  async findAllJobApplicationsByStatus(
    @Param('id') id: string,
    @Param('status') status: string,
  ) {
    try {
      const applications =
        await this.userService.findAllJobApplicationsByStatusCount(+id, status);
      return { success: true, data: applications };
    } catch (err) {
      return { success: false, message: err.message };
    }
  }

  @Get('findRecentJobApplicationsWithFeedback/:id')
  async findRecentJobApplicationsWithFeedback(@Param('id') id: string) {
    try {
      const applications =
        await this.userService.findRecentJobApplicationsWithFeedback(+id);
      return { success: true, data: applications };
    } catch (err) {
      return { success: false, message: err.message };
    }
  }

  @Get('findAllJobApplicationsCount/:id')
  async findAllJobApplications(@Param('id') id: string) {
    try {
      const applications =
        await this.userService.findAllJobApplicationsCount(+id);
      return { success: true, data: applications };
    } catch (err) {
      return { success: false, message: err.message };
    }
  }

  @Get('findAllJobApplicationsByMonth/:id')
  async findAllJobApplicationsByMonth(@Param('id') id: string) {
    try {
      const applications =
        await this.userService.findAllJobApplicationsByMonth(+id);
      return { success: true, data: applications };
    } catch (err) {
      return { success: false, message: err.message };
    }
  }

  @Delete('delete/:id')
  remove(@Param('id') id: string) {
    return this.userService.remove(+id);
  }
}
