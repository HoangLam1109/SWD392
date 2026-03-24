export interface GameSession {
    _id: string;
    libraryGameId: string;
    sessionScore: number;
    sessionDuration: number;
    startedAt: Date;
    endedAt: Date;
}