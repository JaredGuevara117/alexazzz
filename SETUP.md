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

### ActivateEnvironmentIntent / ActivateEnvironmentSimpleIntent
- **Ejemplos**: "Activa [nombre del entorno]", "Encender [nombre del entorno]"
- **Función**: Activa un entorno específico

### DeactivateEnvironmentIntent / DeactivateEnvironmentSimpleIntent
- **Ejemplos**: "Apaga [nombre del entorno]", "Desactiva [nombre del entorno]"
- **Función**: Desactiva un entorno específico

### ListEnvironmentsIntent
- **Ejemplos**: "Lista mis entornos", "Qué entornos tengo"
- **Función**: Lista todos los entornos disponibles

## Solución de Problemas

### Problema: "No encontré un entorno llamado undefined"

Si tienes este problema, es porque Alexa no está reconociendo correctamente el nombre del entorno. Soluciones:

1. **Usa los intents simples**: Los intents `ActivateEnvironmentSimpleIntent` y `DeactivateEnvironmentSimpleIntent` usan slots de texto libre que son más flexibles.

2. **Actualiza el modelo de interacción**: Usa el archivo `interaction-model-updated.json` que incluye los intents simples.

3. **Verifica los logs**: El código ahora incluye debugging que muestra en la consola qué está recibiendo Alexa.

### Debugging

El código ahora incluye logs detallados que te ayudarán a identificar problemas:

- Revisa la consola del servidor para ver los logs de debugging
- Los logs mostrarán el intent completo y el valor extraído del slot

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

## Modelo de Interacción

Usa el archivo `interaction-model-updated.json` que incluye:
- Intents originales con slots tipados
- Intents simples con slots de texto libre (AMAZON.SearchQuery)
- Mayor flexibilidad para reconocer nombres de entornos
