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
        
        // Debug: Imprimir información del intent
        console.log('Intent completo:', JSON.stringify(intent, null, 2));
        
        const environmentNameSlot = intent.slots.environmentName;
        console.log('Slot environmentName:', JSON.stringify(environmentNameSlot, null, 2));
        
        let environmentName = null;
        
        if (environmentNameSlot && environmentNameSlot.value) {
            environmentName = environmentNameSlot.value;
        } else if (environmentNameSlot && environmentNameSlot.resolutions && 
                   environmentNameSlot.resolutions.resolutionsPerAuthority && 
                   environmentNameSlot.resolutions.resolutionsPerAuthority[0] &&
                   environmentNameSlot.resolutions.resolutionsPerAuthority[0].values &&
                   environmentNameSlot.resolutions.resolutionsPerAuthority[0].values[0]) {
            environmentName = environmentNameSlot.resolutions.resolutionsPerAuthority[0].values[0].value.name;
        }

        console.log('Environment name extraído:', environmentName);

        if (!environmentName) {
            return handlerInput.responseBuilder
                .speak('No pude entender el nombre del entorno. ¿Podrías repetirlo?')
                .reprompt('¿Qué entorno te gustaría activar?')
                .getResponse();
        }

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
        
        // Debug: Imprimir información del intent
        console.log('Intent completo:', JSON.stringify(intent, null, 2));
        
        const environmentNameSlot = intent.slots.environmentName;
        console.log('Slot environmentName:', JSON.stringify(environmentNameSlot, null, 2));
        
        let environmentName = null;
        
        if (environmentNameSlot && environmentNameSlot.value) {
            environmentName = environmentNameSlot.value;
        } else if (environmentNameSlot && environmentNameSlot.resolutions && 
                   environmentNameSlot.resolutions.resolutionsPerAuthority && 
                   environmentNameSlot.resolutions.resolutionsPerAuthority[0] &&
                   environmentNameSlot.resolutions.resolutionsPerAuthority[0].values &&
                   environmentNameSlot.resolutions.resolutionsPerAuthority[0].values[0]) {
            environmentName = environmentNameSlot.resolutions.resolutionsPerAuthority[0].values[0].value.name;
        }

        console.log('Environment name extraído:', environmentName);

        if (!environmentName) {
            return handlerInput.responseBuilder
                .speak('No pude entender el nombre del entorno. ¿Podrías repetirlo?')
                .reprompt('¿Qué entorno te gustaría desactivar?')
                .getResponse();
        }

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
                    .reprompt('¿Te gustaría hacer algo más?')
                    .withShouldEndSession(false)
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
                .withShouldEndSession(false)
                .getResponse();

        } catch (error) {
            console.error('Error listing environments:', error);
            return handlerInput.responseBuilder
                .speak('Lo siento, tuve un problema al obtener la lista de entornos. Inténtalo de nuevo.')
                .reprompt('¿Qué te gustaría hacer?')
                .withShouldEndSession(false)
                .getResponse();
        }
    }
};

const ActivateEnvironmentSimpleIntent = {
    canHandle(handlerInput) {
        return handlerInput.requestEnvelope.request.type === 'IntentRequest'
            && handlerInput.requestEnvelope.request.intent.name === 'ActivateEnvironmentSimpleIntent';
    },
    async handle(handlerInput) {
        const { requestEnvelope } = handlerInput;
        const intent = requestEnvelope.request.intent;
        
        console.log('Intent simple completo:', JSON.stringify(intent, null, 2));
        
        // Intentar obtener el nombre del entorno de diferentes maneras
        let environmentName = null;
        
        // Método 1: Slot directo
        if (intent.slots.environmentName && intent.slots.environmentName.value) {
            environmentName = intent.slots.environmentName.value;
        }
        // Método 2: Slot de texto libre
        else if (intent.slots.environmentNameText && intent.slots.environmentNameText.value) {
            environmentName = intent.slots.environmentNameText.value;
        }
        // Método 3: Intentar extraer del texto completo
        else {
            const spokenText = requestEnvelope.request.intent.slots.environmentNameText ? 
                requestEnvelope.request.intent.slots.environmentNameText.value : '';
            
            // Buscar en la base de datos para encontrar coincidencias
            try {
                const entornos = await Entorno.find({});
                const nombresEntornos = entornos.map(e => e.nombre.toLowerCase());
                
                for (const nombre of nombresEntornos) {
                    if (spokenText.toLowerCase().includes(nombre.toLowerCase())) {
                        environmentName = nombre;
                        break;
                    }
                }
            } catch (error) {
                console.error('Error buscando entornos:', error);
            }
        }

        console.log('Environment name extraído (simple):', environmentName);

        if (!environmentName) {
            return handlerInput.responseBuilder
                .speak('No pude entender el nombre del entorno. ¿Podrías repetirlo?')
                .reprompt('¿Qué entorno te gustaría activar?')
                .getResponse();
        }

        try {
            const entorno = await Entorno.findOne({ nombre: environmentName });

            if (!entorno) {
                return handlerInput.responseBuilder
                    .speak(`No encontré un entorno llamado ${environmentName}. ¿Podrías verificar el nombre?`)
                    .reprompt('¿Qué entorno te gustaría activar?')
                    .getResponse();
            }

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

const DeactivateEnvironmentSimpleIntent = {
    canHandle(handlerInput) {
        return handlerInput.requestEnvelope.request.type === 'IntentRequest'
            && handlerInput.requestEnvelope.request.intent.name === 'DeactivateEnvironmentSimpleIntent';
    },
    async handle(handlerInput) {
        const { requestEnvelope } = handlerInput;
        const intent = requestEnvelope.request.intent;
        
        console.log('Intent simple completo:', JSON.stringify(intent, null, 2));
        
        let environmentName = null;
        
        if (intent.slots.environmentName && intent.slots.environmentName.value) {
            environmentName = intent.slots.environmentName.value;
        }
        else if (intent.slots.environmentNameText && intent.slots.environmentNameText.value) {
            environmentName = intent.slots.environmentNameText.value;
        }
        else {
            const spokenText = requestEnvelope.request.intent.slots.environmentNameText ? 
                requestEnvelope.request.intent.slots.environmentNameText.value : '';
            
            try {
                const entornos = await Entorno.find({});
                const nombresEntornos = entornos.map(e => e.nombre.toLowerCase());
                
                for (const nombre of nombresEntornos) {
                    if (spokenText.toLowerCase().includes(nombre.toLowerCase())) {
                        environmentName = nombre;
                        break;
                    }
                }
            } catch (error) {
                console.error('Error buscando entornos:', error);
            }
        }

        console.log('Environment name extraído (simple):', environmentName);

        if (!environmentName) {
            return handlerInput.responseBuilder
                .speak('No pude entender el nombre del entorno. ¿Podrías repetirlo?')
                .reprompt('¿Qué entorno te gustaría desactivar?')
                .getResponse();
        }

        try {
            const entorno = await Entorno.findOne({ nombre: environmentName });

            if (!entorno) {
                return handlerInput.responseBuilder
                    .speak(`No encontré un entorno llamado ${environmentName}. ¿Podrías verificar el nombre?`)
                    .reprompt('¿Qué entorno te gustaría desactivar?')
                    .getResponse();
            }

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

const ActivateEnvironmentFreeTextIntent = {
    canHandle(handlerInput) {
        return handlerInput.requestEnvelope.request.type === 'IntentRequest'
            && handlerInput.requestEnvelope.request.intent.name === 'ActivateEnvironmentFreeTextIntent';
    },
    async handle(handlerInput) {
        const { requestEnvelope } = handlerInput;
        const intent = requestEnvelope.request.intent;
        
        console.log('Intent free text completo:', JSON.stringify(intent, null, 2));
        
        // Obtener el texto completo hablado
        const spokenText = requestEnvelope.request.intent.slots.environmentNameFree ? 
            requestEnvelope.request.intent.slots.environmentNameFree.value : '';
        
        console.log('Texto hablado:', spokenText);
        
        if (!spokenText) {
            return handlerInput.responseBuilder
                .speak('No pude entender el nombre del entorno. ¿Podrías repetirlo?')
                .reprompt('¿Qué entorno te gustaría activar? Puedes decir "lista mis entornos" para ver los disponibles.')
                .withShouldEndSession(false)
                .getResponse();
        }

        try {
            // Buscar todos los entornos
            const entornos = await Entorno.find({});
            console.log('Entornos encontrados:', entornos.map(e => e.nombre));
            
            // Buscar coincidencia en el texto hablado
            let environmentName = null;
            const spokenTextLower = spokenText.toLowerCase();
            
            for (const entorno of entornos) {
                if (spokenTextLower.includes(entorno.nombre.toLowerCase())) {
                    environmentName = entorno.nombre;
                    break;
                }
            }
            
            console.log('Environment name encontrado:', environmentName);

            if (!environmentName) {
                return handlerInput.responseBuilder
                    .speak(`No encontré un entorno que coincida con "${spokenText}". ¿Podrías verificar el nombre?`)
                    .reprompt('¿Qué entorno te gustaría activar? Puedes decir "lista mis entornos" para ver los disponibles.')
                    .withShouldEndSession(false)
                    .getResponse();
            }

            // Activar el entorno
            const entorno = await Entorno.findOne({ nombre: environmentName });
            entorno.estado = true;
            await entorno.save();

            return handlerInput.responseBuilder
                .speak(`Perfecto, he activado el entorno ${environmentName}. Los sensores y dispositivos están configurados según tu escenario. ¿Hay algo más que te gustaría hacer?`)
                .reprompt('Puedes activar otro entorno, desactivar uno, o listar tus entornos. ¿Qué te gustaría hacer?')
                .withShouldEndSession(false)
                .getResponse();

        } catch (error) {
            console.error('Error activating environment:', error);
            return handlerInput.responseBuilder
                .speak('Lo siento, tuve un problema al activar el entorno. Inténtalo de nuevo.')
                .reprompt('¿Qué entorno te gustaría activar?')
                .withShouldEndSession(false)
                .getResponse();
        }
    }
};

const DeactivateEnvironmentFreeTextIntent = {
    canHandle(handlerInput) {
        return handlerInput.requestEnvelope.request.type === 'IntentRequest'
            && handlerInput.requestEnvelope.request.intent.name === 'DeactivateEnvironmentFreeTextIntent';
    },
    async handle(handlerInput) {
        const { requestEnvelope } = handlerInput;
        const intent = requestEnvelope.request.intent;
        
        console.log('Intent free text completo:', JSON.stringify(intent, null, 2));
        
        // Obtener el texto completo hablado
        const spokenText = requestEnvelope.request.intent.slots.environmentNameFree ? 
            requestEnvelope.request.intent.slots.environmentNameFree.value : '';
        
        console.log('Texto hablado:', spokenText);
        
        if (!spokenText) {
            return handlerInput.responseBuilder
                .speak('No pude entender el nombre del entorno. ¿Podrías repetirlo?')
                .reprompt('¿Qué entorno te gustaría desactivar? Puedes decir "lista mis entornos" para ver los disponibles.')
                .withShouldEndSession(false)
                .getResponse();
        }

        try {
            // Buscar todos los entornos
            const entornos = await Entorno.find({});
            console.log('Entornos encontrados:', entornos.map(e => e.nombre));
            
            // Buscar coincidencia en el texto hablado
            let environmentName = null;
            const spokenTextLower = spokenText.toLowerCase();
            
            for (const entorno of entornos) {
                if (spokenTextLower.includes(entorno.nombre.toLowerCase())) {
                    environmentName = entorno.nombre;
                    break;
                }
            }
            
            console.log('Environment name encontrado:', environmentName);

            if (!environmentName) {
                return handlerInput.responseBuilder
                    .speak(`No encontré un entorno que coincida con "${spokenText}". ¿Podrías verificar el nombre?`)
                    .reprompt('¿Qué entorno te gustaría desactivar? Puedes decir "lista mis entornos" para ver los disponibles.')
                    .withShouldEndSession(false)
                    .getResponse();
            }

            // Desactivar el entorno
            const entorno = await Entorno.findOne({ nombre: environmentName });
            entorno.estado = false;
            await entorno.save();

            return handlerInput.responseBuilder
                .speak(`Listo, he desactivado el entorno ${environmentName}. Todos los dispositivos han vuelto a su estado normal. ¿Hay algo más que te gustaría hacer?`)
                .reprompt('Puedes activar otro entorno, desactivar uno, o listar tus entornos. ¿Qué te gustaría hacer?')
                .withShouldEndSession(false)
                .getResponse();

        } catch (error) {
            console.error('Error deactivating environment:', error);
            return handlerInput.responseBuilder
                .speak('Lo siento, tuve un problema al desactivar el entorno. Inténtalo de nuevo.')
                .reprompt('¿Qué entorno te gustaría desactivar?')
                .withShouldEndSession(false)
                .getResponse();
        }
    }
};

const ExitSkillIntent = {
    canHandle(handlerInput) {
        return handlerInput.requestEnvelope.request.type === 'IntentRequest'
            && (handlerInput.requestEnvelope.request.intent.name === 'ExitSkillIntent' ||
                handlerInput.requestEnvelope.request.intent.name === 'AMAZON.StopIntent' ||
                handlerInput.requestEnvelope.request.intent.name === 'AMAZON.CancelIntent');
    },
    handle(handlerInput) {
        return handlerInput.responseBuilder
            .speak('Perfecto, me voy. ¡Que tengas un buen día!')
            .withShouldEndSession(true)
            .getResponse();
    }
};

module.exports = {
    ActivateEnvironmentIntent,
    DeactivateEnvironmentIntent,
    ListEnvironmentsIntent,
    ActivateEnvironmentSimpleIntent,
    DeactivateEnvironmentSimpleIntent,
    ActivateEnvironmentFreeTextIntent,
    DeactivateEnvironmentFreeTextIntent,
    ExitSkillIntent
};
