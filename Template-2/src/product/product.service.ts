/* eslint-disable @typescript-eslint/no-unused-vars */
import { Injectable } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Product } from './entities/product.entity';
import { Model } from 'mongoose';

@Injectable()
export class ProductService {
  constructor(
    @InjectModel('Product') private readonly productModel: Model<Product>,
  ) {}

  async create(createProductDto: CreateProductDto) {
    const newProduct = await this.productModel.create(createProductDto);
    return newProduct.save();
  }

  async findAll() {
    const allProducts = await this.productModel.find().exec();
    if (!allProducts) {
      throw new Error('No products found');
    }
    return allProducts;
  }

  async findOne(id: string) {
    const product = await this.productModel.findById(id).exec();
    if (!product) {
      throw new Error('Product not found');
    }

    return product;
  }

  async update(id: string, updateProductDto: UpdateProductDto) {
    const existingProduct = await this.productModel.findById(id).exec();
    if (!existingProduct) {
      throw new Error('Product not found');
    }
    const updatedProduct = Object.assign(existingProduct, updateProductDto);
    await updatedProduct.save();
    return updatedProduct;
  }

  async remove(id: string) {
    const product = await this.productModel.findById(id).exec();
    if (!product) {
      throw new Error('Product not found');
    }
    return product.deleteOne();
  }
}
