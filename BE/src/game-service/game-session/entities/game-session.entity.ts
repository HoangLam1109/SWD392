import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export interface IGameSession {
	library_game_id: string;
	session_score: number;
	session_duration: number;
	started_at?: Date;
	ended_at?: Date;
}

export type GameSessionDocument = HydratedDocument<GameSession>;

@Schema({
	timestamps: {
		createdAt: 'created_at',
		updatedAt: 'updated_at',
	},
})
export class GameSession {
	@Prop({ required: true, ref: 'LibraryGame', index: true })
	library_game_id: string;

	@Prop({ required: true, default: 0 })
	session_score: number;

	@Prop({ required: true, default: 0 })
	session_duration: number;

	@Prop({ default: Date.now })
	started_at?: Date;

	@Prop()
	ended_at?: Date;
}

export const GameSessionSchema = SchemaFactory.createForClass(GameSession);
GameSessionSchema.index({ library_game_id: 1, started_at: -1 });

