export interface BaseUser {
  id: string;
  type: 'guest' | 'logged';
  name?: string;
}
