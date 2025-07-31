export class JoinSessionDto {
  userIdentifier: string;
  userType: 'guest' | 'logged';
}
