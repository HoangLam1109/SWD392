import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { LibraryGameStatus } from '../enum/library-game-status.enum';

export interface ILibraryGame {
	user_id: string;
	game_id: string;
	key_id: string;
	highest_score: number;
	total_playtime: number;
	last_played_at?: Date;
	acquired_at?: Date;
	status: LibraryGameStatus;
}

export type LibraryGameDocument = HydratedDocument<LibraryGame>;

@Schema({
	timestamps: {
		createdAt: 'created_at',
		updatedAt: 'updated_at',
	},
})
export class LibraryGame {
	@Prop({ required: true, index: true, ref: 'User' })
	user_id: string;

	@Prop({ required: true, index: true, ref: 'Game' })
	game_id: string;

	@Prop({ required: true, ref: 'GameKey' })
	key_id: string;

	@Prop({ required: true, default: 0 })
	highest_score: number;

	@Prop({ required: true, default: 0 })
	total_playtime: number;

	@Prop()
	last_played_at?: Date;

	@Prop({ default: Date.now })
	acquired_at?: Date;

	@Prop({ required: true, enum: LibraryGameStatus, default: LibraryGameStatus.OWNED })
	status: LibraryGameStatus;
}

export const LibraryGameSchema = SchemaFactory.createForClass(LibraryGame);

// Optimize lookups and sorting for per-user highest-score leaderboard.
LibraryGameSchema.index({ game_id: 1, user_id: 1, highest_score: -1 });
LibraryGameSchema.index({ user_id: 1, highest_score: -1 });
