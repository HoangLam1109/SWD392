import { Model } from 'mongoose';
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import {
  Category,
  CategoryDocument,
  ICategory,
} from '../entities/category.entity';

export interface ICategoryRepository {
  findById(id: string, fields?: string): Promise<CategoryDocument | null>;
  findByGameId(gameId: string): Promise<CategoryDocument[]>;
  findByParentCategoryId(
    parentCategoryId: string,
  ): Promise<CategoryDocument[]>;
  findAllParentCategories(): Promise<CategoryDocument[]>;
  create(categoryData: any): Promise<CategoryDocument>;
  updateById(
    id: string,
    categoryData: any,
  ): Promise<CategoryDocument | null>;
  deleteById(id: string): Promise<CategoryDocument | null>;
  findAll(fields?: string): Promise<CategoryDocument[]>;
  findWithQuery(
    query: Record<string, any>,
    options: { limit: number; sortBy: string; sortOrder: string },
  ): Promise<CategoryDocument[] | undefined>;
  countDocument(query: Record<string, any>): Promise<number>;
}

@Injectable()
export class CategoryRepository implements ICategoryRepository {
  constructor(
    @InjectModel(Category.name, 'GAME_DB')
    private categoryModel: Model<CategoryDocument>,
  ) {}

  async findById(
    id: string,
    fields?: string,
  ): Promise<CategoryDocument | null> {
    return await this.categoryModel.findOne(
      { _id: id },
      fields ||
        '_id categoryName description parentCategoryId gameId created_at',
    );
  }

  async findByGameId(gameId: string): Promise<CategoryDocument[]> {
    return await this.categoryModel
      .find({ gameId })
      .sort({ categoryName: 1 })
      .lean();
  }

  async findByParentCategoryId(
    parentCategoryId: string,
  ): Promise<CategoryDocument[]> {
    return await this.categoryModel
      .find({ parentCategoryId })
      .sort({ categoryName: 1 })
      .lean();
  }

  async findAllParentCategories(): Promise<CategoryDocument[]> {
    return await this.categoryModel
      .find({ parentCategoryId: null })
      .sort({ categoryName: 1 })
      .lean();
  }

  async create(categoryData: any): Promise<CategoryDocument> {
    const category = new this.categoryModel(categoryData);
    return await category.save();
  }

  async updateById(
    id: string,
    categoryData: Partial<ICategory>,
  ): Promise<CategoryDocument | null> {
    return await this.categoryModel
      .findByIdAndUpdate(id, categoryData, { new: true })
      .orFail(new NotFoundException('Category not found'))
      .exec();
  }

  async deleteById(id: string): Promise<CategoryDocument | null> {
    return await this.categoryModel
      .findByIdAndDelete(id)
      .orFail(new NotFoundException('Category not found'))
      .exec();
  }

  async findAll(fields?: string): Promise<CategoryDocument[]> {
    return await this.categoryModel.find({}, fields).sort({ categoryName: 1 });
  }

  async findWithQuery(
    query: Record<string, any>,
    options: {
      limit: number;
      sortBy: string;
      sortOrder: string;
    },
  ): Promise<CategoryDocument[] | undefined> {
    const sortField = options?.sortBy || '_id';
    const sortDirection = options.sortOrder === 'asc' ? 1 : -1;
    const sortObj: Record<string, 1 | -1> = { [sortField]: sortDirection };

    return await this.categoryModel
      .find(query)
      .sort(sortObj)
      .collation({ locale: 'en', strength: 2 })
      .limit(options?.limit)
      .lean();
  }

  async countDocument(query: Record<string, any>): Promise<number> {
    return await this.categoryModel.countDocuments(query);
  }
}
