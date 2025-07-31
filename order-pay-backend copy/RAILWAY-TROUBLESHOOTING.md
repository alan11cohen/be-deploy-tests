# 🔧 Railway Troubleshooting

## Error: "Nixpacks was unable to generate a build plan"

### Problema

Railway está usando Nixpacks en lugar de Docker, a pesar de tener un Dockerfile.

### ✅ Soluciones

#### 1. **Verificar railway.toml**

Asegurar que el archivo `railway.toml` tenga:

```toml
[build]
builder = "DOCKERFILE"
dockerfilePath = "Dockerfile"
```

#### 2. **Verificar Root Directory**

En Railway Dashboard → Settings → Build:

- **Root Directory**: `order-pay-backend/order-pay-backend`
- **Build Command**: (should be auto-detected)

#### 3. **Forzar Redeploy**

1. En Railway Dashboard
2. Latest Deployment → 3 dots → "Redeploy"
3. Asegurar que detecte el Dockerfile

#### 4. **Re-conectar Repositorio**

Si persiste el problema:

1. Disconnect GitHub repo
2. Re-connect y seleccionar nuevamente
3. Asegurar Root Directory correcto

#### 5. **Verificar Archivos**

En el directorio `order-pay-backend/order-pay-backend/`:

- ✅ `Dockerfile` existe
- ✅ `railway.toml` configurado
- ✅ `package.json` existe
- ✅ `.dockerignore` existe

### 🚨 Si Nixpacks Sigue Apareciendo

#### Opción A: Eliminar package.json temporalmente

```bash
# Renombrar temporalmente para forzar Docker
mv package.json package.json.backup
# Hacer commit y push
# Después restaurar:
mv package.json.backup package.json
```

#### Opción B: Usar Variables de Entorno

En Railway, agregar:

```
RAILWAY_DOCKERFILE_PATH=Dockerfile
```

#### Opción C: Crear nuevo servicio

1. En Railway, crear nuevo servicio
2. "Empty Service" → "Deploy from GitHub"
3. Configurar nuevamente

### ✅ Verificación Final

Una vez que Railway use Docker:

- Build logs deben mostrar pasos del Dockerfile
- No debe mencionar Nixpacks
- Deploy debe ser exitoso
- Health check debe responder: `/health`

### 📋 Archivos Importantes

- `Dockerfile` - Build instructions
- `railway.toml` - Railway configuration
- `.dockerignore` - Files to ignore
- `.railway-dockerfile` - Force Docker detection
