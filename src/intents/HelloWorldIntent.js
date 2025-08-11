const HelloWorldIntentHandler = {
    canHandle(handlerInput) {
        const { request } = handlerInput.requestEnvelope;
        return request.type === 'IntentRequest' && request.intent.name === 'HelloWorldIntent';
    },
    handle(handlerInput) {
        const speechText = 'Hola mundo.';

        return handlerInput.responseBuilder
            .speak(speechText)
            .reprompt('Hello world', speechText)
            .getResponse();
    }
}


module.exports = { HelloWorldIntentHandler };