export interface System {
    id?: string;
    _id?: string;
    gameId: string;
    requirementType: string;
    os: string;
    processor: string;
    memory: string;
    graphics: string;
    storage: string;
    additionalNotes: string;
}