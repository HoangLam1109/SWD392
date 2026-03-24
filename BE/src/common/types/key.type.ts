export type CreateGameKeyInput = {
  gameId: string;
  keyCode: string;
  status: string;
  orderDetailId?: string;
  assignedAt?: Date;
  activatedAt?: Date;
};
