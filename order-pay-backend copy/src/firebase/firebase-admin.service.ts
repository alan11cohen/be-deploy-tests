import { Injectable } from '@nestjs/common';
import * as admin from 'firebase-admin';

@Injectable()
export class FirebaseAdminService {
  public readonly auth: admin.auth.Auth;

  constructor() {
    if (process.env.USE_FIREBASE)
    this.auth = admin.auth();
  }
}