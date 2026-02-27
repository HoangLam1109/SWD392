import { Model } from 'mongoose';
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import {
  SystemRequirement,
  SystemRequirementDocument,
  ISystemRequirement,
} from '../entities/system_requirement.entity';

export interface ISystemRequirementRepository {
  findById(
    id: string,
    fields?: string,
  ): Promise<SystemRequirementDocument | null>;
  findByGameId(gameId: string): Promise<SystemRequirementDocument[]>;
  create(requirementData: any): Promise<SystemRequirementDocument>;
  updateById(
    id: string,
    requirementData: any,
  ): Promise<SystemRequirementDocument | null>;
  deleteById(id: string): Promise<SystemRequirementDocument | null>;
  findAll(fields?: string): Promise<SystemRequirementDocument[]>;
  findWithQuery(
    query: Record<string, any>,
    options: { limit: number; sortBy: string; sortOrder: string },
  ): Promise<SystemRequirementDocument[] | undefined>;
  countDocument(query: Record<string, any>): Promise<number>;
}

@Injectable()
export class SystemRequirementRepository
  implements ISystemRequirementRepository
{
  constructor(
    @InjectModel(SystemRequirement.name, 'GAME_DB')
    private systemRequirementModel: Model<SystemRequirementDocument>,
  ) {}

  async findById(
    id: string,
    fields?: string,
  ): Promise<SystemRequirementDocument | null> {
    return await this.systemRequirementModel.findOne(
      { _id: id },
      fields ||
        '_id gameId requirementType os processor memory graphics storage additionalNotes',
    );
  }

  async findByGameId(gameId: string): Promise<SystemRequirementDocument[]> {
    return await this.systemRequirementModel
      .find({ gameId })
      .sort({ requirementType: 1 })
      .lean();
  }

  async create(
    requirementData: any,
  ): Promise<SystemRequirementDocument> {
    const requirement = new this.systemRequirementModel(requirementData);
    return await requirement.save();
  }

  async updateById(
    id: string,
    requirementData: Partial<ISystemRequirement>,
  ): Promise<SystemRequirementDocument | null> {
    return await this.systemRequirementModel
      .findByIdAndUpdate(id, requirementData, { new: true })
      .orFail(new NotFoundException('System requirement not found'))
      .exec();
  }

  async deleteById(id: string): Promise<SystemRequirementDocument | null> {
    return await this.systemRequirementModel
      .findByIdAndDelete(id)
      .orFail(new NotFoundException('System requirement not found'))
      .exec();
  }

  async findAll(fields?: string): Promise<SystemRequirementDocument[]> {
    return await this.systemRequirementModel
      .find({}, fields)
      .sort({ gameId: 1, requirementType: 1 });
  }

  async findWithQuery(
    query: Record<string, any>,
    options: {
      limit: number;
      sortBy: string;
      sortOrder: string;
    },
  ): Promise<SystemRequirementDocument[] | undefined> {
    const sortField = options?.sortBy || '_id';
    const sortDirection = options.sortOrder === 'asc' ? 1 : -1;
    const sortObj: Record<string, 1 | -1> = { [sortField]: sortDirection };

    return await this.systemRequirementModel
      .find(query)
      .sort(sortObj)
      .collation({ locale: 'en', strength: 2 })
      .limit(options?.limit)
      .lean();
  }

  async countDocument(query: Record<string, any>): Promise<number> {
    return await this.systemRequirementModel.countDocuments(query);
  }
}
