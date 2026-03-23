export interface ILocker {
  id: string;
  bloqId: string;
  status: LOCKER_STATUS;
  isOccupied: boolean;
}

export enum LOCKER_STATUS {
  CLOSED = 'CLOSED',
  OPEN = 'OPEN',
}
