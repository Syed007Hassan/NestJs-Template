/* eslint-disable prettier/prettier */
import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { StripeService } from './stripe.service';
import { CreateStripeDto } from './dto/create-stripe.dto';
import { UpdateStripeDto } from './dto/update-stripe.dto';
import { Cart } from './entities/card.model';
import { ApiTags } from '@nestjs/swagger';
import { error } from 'console';

@Controller('stripe')
@ApiTags('stripe')
export class StripeController {
  constructor(private readonly stripeService: StripeService) {}

  @Post('checkout')
  checkout(@Body() body: { cart: Cart }) {
    try {
      const res = this.stripeService.checkout(body.cart);
      console.log(res + 'res');
      return res;
    } catch (e) {
      return error;
    }
  }

  // @Post()
  // create(@Body() createStripeDto: CreateStripeDto) {
  //   return this.stripeService.create(createStripeDto);
  // }

  @Get()
  findAll() {
    return this.stripeService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.stripeService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateStripeDto: UpdateStripeDto) {
    return this.stripeService.update(+id, updateStripeDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.stripeService.remove(+id);
  }
}
