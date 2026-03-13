import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, PipelineStage } from 'mongoose';
import {
	ILibraryGame,
	LibraryGame,
	LibraryGameDocument,
} from '../entites/library-game.entity';

export interface ILibraryGameRepository {
	findById(id: string): Promise<LibraryGameDocument | null>;
	create(libraryGameData: Partial<ILibraryGame>): Promise<LibraryGameDocument>;
	updateById(
		id: string,
		libraryGameData: Partial<ILibraryGame>,
	): Promise<LibraryGameDocument | null>;
	deleteById(id: string): Promise<LibraryGameDocument | null>;
	findAll(): Promise<LibraryGameDocument[]>;
	findWithQuery(
		query: Record<string, any>,
		options: { limit: number; sortBy: string; sortOrder: string },
	): Promise<LibraryGameDocument[] | undefined>;
	countDocument(query: Record<string, any>): Promise<number>;
	findHighestScoreLeaderboardByUser(limit: number, gameId?: string): Promise<any[]>;
}

@Injectable()
export class LibraryGameRepository implements ILibraryGameRepository {
	constructor(
		@InjectModel(LibraryGame.name, 'GAME_DB')
		private libraryGameModel: Model<LibraryGameDocument>,
	) {}

	async findById(id: string): Promise<LibraryGameDocument | null> {
		return await this.libraryGameModel.findById(id);
	}

	async create(
		libraryGameData: Partial<ILibraryGame>,
	): Promise<LibraryGameDocument> {
		const libraryGame = new this.libraryGameModel(libraryGameData);
		return await libraryGame.save();
	}

	async updateById(
		id: string,
		libraryGameData: Partial<ILibraryGame>,
	): Promise<LibraryGameDocument | null> {
		return await this.libraryGameModel
			.findByIdAndUpdate(id, libraryGameData, { new: true })
			.orFail(new NotFoundException('Library game not found'))
			.exec();
	}

	async deleteById(id: string): Promise<LibraryGameDocument | null> {
		return await this.libraryGameModel
			.findByIdAndDelete(id)
			.orFail(new NotFoundException('Library game not found'))
			.exec();
	}

	async findAll(): Promise<LibraryGameDocument[]> {
		return await this.libraryGameModel.find();
	}

	async findWithQuery(
		query: Record<string, any>,
		options: {
			limit: number;
			sortBy: string;
			sortOrder: string;
		},
	): Promise<LibraryGameDocument[] | undefined> {
		const sortField = options?.sortBy || '_id';
		const sortDirection = options.sortOrder === 'asc' ? 1 : -1;
		const sortObj: Record<string, 1 | -1> = { [sortField]: sortDirection };

		return await this.libraryGameModel
			.find(query)
			.sort(sortObj)
			.collation({ locale: 'en', strength: 2 })
			.limit(options?.limit)
			.lean();
	}

	async countDocument(query: Record<string, any>): Promise<number> {
		return await this.libraryGameModel.countDocuments(query);
	}

	async findHighestScoreLeaderboardByUser(
		limit: number,
		gameId?: string,
	): Promise<any[]> {
		const pipeline: PipelineStage[] = [];

		if (gameId?.trim()) {
			pipeline.push({
				$match: {
					game_id: gameId.trim(),
				},
			});
		}

		pipeline.push(
			{
				$sort: {
					user_id: 1,
					highest_score: -1,
					last_played_at: -1,
				},
			},
			{
				$group: {
					_id: '$user_id',
					user_id: { $first: '$user_id' },
					game_id: { $first: '$game_id' },
					highest_score: { $first: '$highest_score' },
					total_playtime: { $first: '$total_playtime' },
					last_played_at: { $first: '$last_played_at' },
					status: { $first: '$status' },
				},
			},
			{
				$sort: {
					highest_score: -1,
					last_played_at: -1,
				},
			},
			{ $limit: limit },
			{
				$project: {
					_id: 0,
					user_id: 1,
					game_id: 1,
					highest_score: 1,
					total_playtime: 1,
					last_played_at: 1,
					status: 1,
				},
			},
		);

		return await this.libraryGameModel.aggregate(pipeline);
	}
}

