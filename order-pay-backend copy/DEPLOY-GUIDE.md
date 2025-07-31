# 🚀 Guía Completa de Despliegue - Backend

## 🛤️ Railway (Recomendado)

### Paso 1: Preparar el Repositorio

```bash
# Asegurar que todos los cambios estén commiteados
git add .
git commit -m "feat: prepare for Railway deployment"
git push origin main
```

### Paso 2: Crear Proyecto en Railway

1. Ve a [railway.app](https://railway.app)
2. Conecta tu cuenta de GitHub
3. Click en "New Project"
4. Selecciona "Deploy from GitHub repo"
5. Busca y selecciona tu repositorio
6. **IMPORTANTE**: Selecciona el directorio `order-pay-backend/order-pay-backend/`

### Paso 3: Agregar Base de Datos

1. En tu proyecto Railway, click "New Service"
2. Selecciona "Database" → "MySQL"
3. Railway creará automáticamente las variables de base de datos

### Paso 4: Configurar Variables de Entorno

En Settings → Environment Variables, agregar:

#### Database (Auto-configurado por Railway MySQL)

- `DB_SYNC=false` (¡IMPORTANTE para producción!)

#### App Configuration

- `PORT=3000`
- `NODE_ENV=production`

#### JWT

- `JWT_SECRET=tu-clave-jwt-super-secreta`

#### Firebase (copiar de tu .env local)

- `FIREBASE_TYPE=service_account`
- `FIREBASE_PROJECT_ID=tu-project-id`
- `FIREBASE_PRIVATE_KEY_ID=tu-key-id`
- `FIREBASE_PRIVATE_KEY=tu-private-key`
- `FIREBASE_CLIENT_EMAIL=tu-email`
- `FIREBASE_CLIENT_ID=tu-client-id`
- `FIREBASE_AUTH_URI=https://accounts.google.com/o/oauth2/auth`
- `FIREBASE_TOKEN_URI=https://oauth2.googleapis.com/token`
- `FIREBASE_AUTH_PROVIDER_X509_CERT_URL=https://www.googleapis.com/oauth2/v1/certs`
- `FIREBASE_CLIENT_X509_CERT_URL=tu-cert-url`
- `FIREBASE_UNIVERSE_DOMAIN=googleapis.com`
- `USE_FIREBASE=true`

#### CORS (actualizar después del deploy del frontend)

- `CORS_ORIGINS=https://tu-frontend.vercel.app`

### Paso 5: Deploy

1. Railway detectará automáticamente el `Dockerfile`
2. El deploy iniciará automáticamente
3. Monitorea los logs para cualquier error

### Paso 6: Verificar Deployment

Una vez deployado:

1. Ve a la URL de tu aplicación (ej: `https://tu-app.railway.app`)
2. Prueba el health check: `https://tu-app.railway.app/health`
3. Debería responder: `{"status":"ok","timestamp":"...","uptime":...}`

## 🔧 Configuración Post-Deploy

### 1. Actualizar CORS

Después de desplegar el frontend, actualiza:

```bash
CORS_ORIGINS=https://tu-frontend-vercel.vercel.app
```

### 2. Configurar Dominio Personalizado (Opcional)

1. En Railway Dashboard → Settings → Domains
2. Agregar tu dominio personalizado
3. Configurar DNS según las instrucciones

### 3. Monitoreo

- **Logs**: Railway Dashboard → Deployments → Ver logs
- **Métricas**: Dashboard muestra CPU, memoria, requests
- **Health Check**: `GET /health` endpoint

## 🐳 Alternativa: Otras Plataformas

### Heroku

```bash
# Instalar Heroku CLI
heroku login
heroku create tu-app-name
heroku addons:create cleardb:ignite
heroku config:set NODE_ENV=production
# ... configurar todas las variables de entorno
git push heroku main
```

### DigitalOcean App Platform

1. Conectar repositorio
2. Seleccionar Dockerfile
3. Configurar variables de entorno
4. Deploy

### AWS/Google Cloud

Requiere más configuración manual de contenedores y bases de datos.

## 🚨 Troubleshooting

### Error: "Cannot find module"

- Verificar que el build sea exitoso
- Revisar que `dist/main.js` exista en la imagen

### Error de Base de Datos

- Verificar variables `DB_*`
- Asegurar que `DB_SYNC=false` en producción
- Verificar conectividad de red

### Error de CORS

- Verificar `CORS_ORIGINS` incluya la URL del frontend
- Temporalmente usar `origin: true` para debug

### Error de Firebase

- Verificar todas las variables Firebase
- Asegurar que las llaves privadas tengan los saltos de línea correctos

## ✅ Checklist Final

- [ ] Código commiteado y pushed
- [ ] Proyecto creado en Railway
- [ ] Base de datos MySQL agregada
- [ ] Variables de entorno configuradas
- [ ] Deploy exitoso
- [ ] Health check responde OK
- [ ] Frontend puede conectarse al backend
- [ ] CORS configurado correctamente

## 📝 URLs Importantes

- **Backend**: `https://tu-app.railway.app`
- **Health Check**: `https://tu-app.railway.app/health`
- **API Docs**: `https://tu-app.railway.app/api` (si tienes Swagger)
- **Railway Dashboard**: `https://railway.app/dashboard`

¡Tu backend ya está listo para producción! 🎉
