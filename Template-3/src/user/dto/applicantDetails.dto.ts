import { ApiProperty } from '@nestjs/swagger';
import {
  IsString,
  IsNumber,
  IsNotEmpty,
  IsBoolean,
  IsDate,
  IsArray,
  IsOptional,
} from 'class-validator';

class LocationDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  area: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  city: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  country: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  latitude: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  longitude: string;
}

class EducationDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  degree: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  institution: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  startDate: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  endDate: string;
}

class ExperienceDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  company: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  title: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  startDate: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  endDate: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  description: string;
}

export class ApplicantDetailsDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  dob: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  gender: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  aboutMe: string;

  @ApiProperty()
  @IsOptional()
  @IsString()
  profilePicture: string;

  @ApiProperty({ type: [EducationDto] })
  @IsNotEmpty()
  @IsArray()
  education: EducationDto[];

  @ApiProperty({ type: [String] })
  @IsNotEmpty()
  @IsArray()
  skills: string[];

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  phoneNo: string;

  @ApiProperty()
  @IsNotEmpty()
  location: LocationDto;

  @ApiProperty({ type: [ExperienceDto] })
  @IsNotEmpty()
  @IsArray()
  experience: ExperienceDto[];

  @ApiProperty()
  @IsNotEmpty()
  @IsBoolean()
  relocation: boolean;

  @ApiProperty()
  @IsOptional()
  @IsString()
  resume: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  languages: string;
}
