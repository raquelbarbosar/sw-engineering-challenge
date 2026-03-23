export interface IRent {
  id: string;
  lockerId: string;
  weight: number;
  size: RENT_SIZE;
  status: RENT_STATUS;
}

export enum RENT_SIZE {
  XS = 'XS',
  S = 'S',
  M = 'M',
  L = 'L',
  XL = 'XL',
}

export enum RENT_STATUS {
  CREATED = 'CREATED',
  WAITING_DROPOFF = 'WAITING_DROPOFF',
  WAITING_PICKUP = 'WAITING_PICKUP',
  DELIVERED = 'DELIVERED',
}
