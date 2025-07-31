import { BaseUser } from './base-user';

export class GuestUser implements BaseUser {
  id: string;
  type: 'guest' = 'guest';
}
