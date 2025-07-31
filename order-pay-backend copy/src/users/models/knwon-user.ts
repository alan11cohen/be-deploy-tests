import { BaseUser } from './base-user';

export class KnownUser implements BaseUser {
  id: string;
  type: 'logged' = 'logged';
  email: string;
}