import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import {
	GameSession,
	GameSessionDocument,
	IGameSession,
} from '../entities/game-session.entity';

export interface IGameSessionRepository {
	findById(id: string): Promise<GameSessionDocument | null>;
	create(gameSessionData: Partial<IGameSession>): Promise<GameSessionDocument>;
	sumSessionDurationByLibraryGameId(libraryGameId: string): Promise<number>;
	updateById(
		id: string,
		gameSessionData: Partial<IGameSession>,
	): Promise<GameSessionDocument | null>;
	deleteById(id: string): Promise<GameSessionDocument | null>;
	findAll(): Promise<GameSessionDocument[]>;
	findWithQuery(
		query: Record<string, any>,
		options: { limit: number; sortBy: string; sortOrder: string },
	): Promise<GameSessionDocument[] | undefined>;
	countDocument(query: Record<string, any>): Promise<number>;
}

@Injectable()
export class GameSessionRepository implements IGameSessionRepository {
	constructor(
		@InjectModel(GameSession.name, 'GAME_DB')
		private gameSessionModel: Model<GameSessionDocument>,
	) {}

	async findById(id: string): Promise<GameSessionDocument | null> {
		return await this.gameSessionModel.findById(id);
	}

	async create(gameSessionData: Partial<IGameSession>): Promise<GameSessionDocument> {
		const gameSession = new this.gameSessionModel(gameSessionData);
		return await gameSession.save();
	}

	async sumSessionDurationByLibraryGameId(libraryGameId: string): Promise<number> {
		const result = await this.gameSessionModel.aggregate([
			{ $match: { library_game_id: libraryGameId } },
			{
				$group: {
					_id: null,
					total: { $sum: '$session_duration' },
				},
			},
		]);

		return result[0]?.total ?? 0;
	}

	async updateById(
		id: string,
		gameSessionData: Partial<IGameSession>,
	): Promise<GameSessionDocument | null> {
		return await this.gameSessionModel
			.findByIdAndUpdate(id, gameSessionData, { returnDocument: 'after' })
			.orFail(new NotFoundException('Game session not found'))
			.exec();
	}

	async deleteById(id: string): Promise<GameSessionDocument | null> {
		return await this.gameSessionModel
			.findByIdAndDelete(id)
			.orFail(new NotFoundException('Game session not found'))
			.exec();
	}

	async findAll(): Promise<GameSessionDocument[]> {
		return await this.gameSessionModel.find();
	}

	async findWithQuery(
		query: Record<string, any>,
		options: { limit: number; sortBy: string; sortOrder: string },
	): Promise<GameSessionDocument[] | undefined> {
		const sortField = options?.sortBy || '_id';
		const sortDirection = options.sortOrder === 'asc' ? 1 : -1;
		const sortObj: Record<string, 1 | -1> = { [sortField]: sortDirection };

		return await this.gameSessionModel
			.find(query)
			.sort(sortObj)
			.collation({ locale: 'en', strength: 2 })
			.limit(options?.limit)
			.lean();
	}

	async countDocument(query: Record<string, any>): Promise<number> {
		return await this.gameSessionModel.countDocuments(query);
	}
}

