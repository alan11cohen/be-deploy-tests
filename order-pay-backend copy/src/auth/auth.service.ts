import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { FirebaseAdminService } from '../firebase/firebase-admin.service'; 

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    private firebaseAdminService: FirebaseAdminService, 
  ) {}

  async loginWithFirebaseToken(firebaseIdToken: string) {
    try {
      const decodedToken = await this.firebaseAdminService.auth.verifyIdToken(firebaseIdToken);


      //TODO:
      //    - Buscar el usuario en base de datos 
      //    - Crear el usuario en base de datos si es la primera vez que inicia sesión
      //    - Obtener roles o permisos personalizados para este usuario

      const payload = { uid: decodedToken.uid, email: decodedToken.email };

      return {
        access_token: this.jwtService.sign(payload),
        user: {
          uid: decodedToken.uid,
          email: decodedToken.email,
          name: decodedToken.name || null,
          picture: decodedToken.picture || null,
        },
      };

    } catch (error) {
      console.error('Error al verificar Firebase ID Token:', error.message);
      throw new UnauthorizedException('Invalid Firebase ID Token');
    }
  }
}
