# Variables de Entorno para Railway

Configura estas variables en Railway Dashboard → Settings → Environment Variables:

## Database (Automático con Railway MySQL)

```bash
# Railway configurará automáticamente estas si agregas MySQL:
DATABASE_URL=mysql://user:pass@host:port/database

# O manualmente:
DB_HOST=containers-us-west-xxx.railway.app
DB_PORT=3306
DB_USER=root
DB_PASSWORD=generated-password
DB_NAME=railway
DB_SYNC=false  # IMPORTANTE: false en producción
```

## App Configuration

```bash
PORT=3000
NODE_ENV=production
```

## JWT

```bash
JWT_SECRET=tu-clave-jwt-super-secreta-para-produccion
```

## Firebase Admin SDK

```bash
FIREBASE_TYPE=service_account
FIREBASE_PROJECT_ID=tu-project-id
FIREBASE_PRIVATE_KEY_ID=tu-private-key-id
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\ntu-private-key\n-----END PRIVATE KEY-----\n"
FIREBASE_CLIENT_EMAIL=tu-service-account-email
FIREBASE_CLIENT_ID=tu-client-id
FIREBASE_AUTH_URI=https://accounts.google.com/o/oauth2/auth
FIREBASE_TOKEN_URI=https://oauth2.googleapis.com/token
FIREBASE_AUTH_PROVIDER_X509_CERT_URL=https://www.googleapis.com/oauth2/v1/certs
FIREBASE_CLIENT_X509_CERT_URL=tu-cert-url
FIREBASE_UNIVERSE_DOMAIN=googleapis.com
USE_FIREBASE=true
```

## CORS

```bash
CORS_ORIGINS=https://tu-frontend-url.vercel.app
```

## 📋 Checklist de Configuración

1. ✅ Crear proyecto en Railway
2. ✅ Conectar repositorio GitHub
3. ✅ Agregar servicio MySQL
4. ✅ Configurar todas las variables de entorno arriba
5. ✅ Deploy automático
6. ✅ Probar endpoint: `https://tu-app.railway.app/health`
