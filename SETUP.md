# Configuración del Skill de Alexa con MongoDB

## Variables de Entorno

Crea un archivo `.env` en la raíz del proyecto con las siguientes variables:

```env
# MongoDB Connection String
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/database_name?retryWrites=true&w=majority

# Server Port (optional, defaults to 3000)
PORT=3000
```

## Instalación

1. Instala las dependencias:
```bash
npm install
```

2. Configura las variables de entorno en el archivo `.env`

3. Ejecuta el servidor:
```bash
npm start
```

## Intents Disponibles

### ActivateEnvironmentIntent
- **Ejemplos**: "Activa [nombre del entorno]", "Encender [nombre del entorno]"
- **Función**: Activa un entorno específico

### DeactivateEnvironmentIntent
- **Ejemplos**: "Apaga [nombre del entorno]", "Desactiva [nombre del entorno]"
- **Función**: Desactiva un entorno específico

### ListEnvironmentsIntent
- **Ejemplos**: "Lista mis entornos", "Qué entornos tengo"
- **Función**: Lista todos los entornos disponibles

## Estructura de la Base de Datos

El skill utiliza el modelo `Entorno` que incluye:
- nombre: Nombre del entorno
- horaInicio/horaFin: Horarios de activación
- sensores: Array de sensores configurados
- diasSemana: Días de la semana para activación
- playlist: Lista de reproducción asociada
- estado: Estado activo/inactivo del entorno

## Despliegue en Render

1. Sube el código a GitHub
2. Conecta el repositorio a Render
3. Configura las variables de entorno en Render
4. El endpoint será: `https://tu-app.onrender.com/alexa`
