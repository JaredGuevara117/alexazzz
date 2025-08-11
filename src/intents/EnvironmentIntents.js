const { IntentRequest } = require('ask-sdk-model');
const Entorno = require('../../models/Entorno');

const ActivateEnvironmentIntent = {
    canHandle(handlerInput) {
        return handlerInput.requestEnvelope.request.type === 'IntentRequest'
            && handlerInput.requestEnvelope.request.intent.name === 'ActivateEnvironmentIntent';
    },
    async handle(handlerInput) {
        const { requestEnvelope, attributesManager } = handlerInput;
        const intent = requestEnvelope.request.intent;
        const environmentName = intent.slots.environmentName.value;

        try {
            // Buscar el entorno por nombre (asumiendo que no hay autenticación por ahora)
            const entorno = await Entorno.findOne({ nombre: environmentName });

            if (!entorno) {
                return handlerInput.responseBuilder
                    .speak(`No encontré un entorno llamado ${environmentName}. ¿Podrías verificar el nombre?`)
                    .reprompt('¿Qué entorno te gustaría activar?')
                    .getResponse();
            }

            // Activar el entorno
            entorno.estado = true;
            await entorno.save();

            return handlerInput.responseBuilder
                .speak(`Perfecto, he activado el entorno ${environmentName}. Los sensores y dispositivos están configurados según tu escenario.`)
                .getResponse();

        } catch (error) {
            console.error('Error activating environment:', error);
            return handlerInput.responseBuilder
                .speak('Lo siento, tuve un problema al activar el entorno. Inténtalo de nuevo.')
                .reprompt('¿Qué entorno te gustaría activar?')
                .getResponse();
        }
    }
};

const DeactivateEnvironmentIntent = {
    canHandle(handlerInput) {
        return handlerInput.requestEnvelope.request.type === 'IntentRequest'
            && handlerInput.requestEnvelope.request.intent.name === 'DeactivateEnvironmentIntent';
    },
    async handle(handlerInput) {
        const { requestEnvelope } = handlerInput;
        const intent = requestEnvelope.request.intent;
        const environmentName = intent.slots.environmentName.value;

        try {
            // Buscar el entorno por nombre
            const entorno = await Entorno.findOne({ nombre: environmentName });

            if (!entorno) {
                return handlerInput.responseBuilder
                    .speak(`No encontré un entorno llamado ${environmentName}. ¿Podrías verificar el nombre?`)
                    .reprompt('¿Qué entorno te gustaría desactivar?')
                    .getResponse();
            }

            // Desactivar el entorno
            entorno.estado = false;
            await entorno.save();

            return handlerInput.responseBuilder
                .speak(`Listo, he desactivado el entorno ${environmentName}. Todos los dispositivos han vuelto a su estado normal.`)
                .getResponse();

        } catch (error) {
            console.error('Error deactivating environment:', error);
            return handlerInput.responseBuilder
                .speak('Lo siento, tuve un problema al desactivar el entorno. Inténtalo de nuevo.')
                .reprompt('¿Qué entorno te gustaría desactivar?')
                .getResponse();
        }
    }
};

const ListEnvironmentsIntent = {
    canHandle(handlerInput) {
        return handlerInput.requestEnvelope.request.type === 'IntentRequest'
            && handlerInput.requestEnvelope.request.intent.name === 'ListEnvironmentsIntent';
    },
    async handle(handlerInput) {
        try {
            // Obtener todos los entornos (asumiendo que no hay autenticación por ahora)
            const entornos = await Entorno.find({});

            if (!entornos || entornos.length === 0) {
                return handlerInput.responseBuilder
                    .speak('No tienes entornos configurados aún. Puedes crear entornos desde tu aplicación móvil.')
                    .getResponse();
            }

            const nombresEntornos = entornos.map(entorno => entorno.nombre);
            let speechText;

            if (nombresEntornos.length === 1) {
                speechText = `Tienes un entorno llamado ${nombresEntornos[0]}.`;
            } else {
                const ultimo = nombresEntornos.pop();
                speechText = `Tus entornos son: ${nombresEntornos.join(', ')} y ${ultimo}.`;
            }

            speechText += ' Puedes decir "activa" seguido del nombre del entorno para activarlo, o "apaga" para desactivarlo.';

            return handlerInput.responseBuilder
                .speak(speechText)
                .reprompt('¿Qué entorno te gustaría activar o desactivar?')
                .getResponse();

        } catch (error) {
            console.error('Error listing environments:', error);
            return handlerInput.responseBuilder
                .speak('Lo siento, tuve un problema al obtener la lista de entornos. Inténtalo de nuevo.')
                .getResponse();
        }
    }
};

module.exports = {
    ActivateEnvironmentIntent,
    DeactivateEnvironmentIntent,
    ListEnvironmentsIntent
};
