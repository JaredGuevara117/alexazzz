const LaunchRequest = {
    canHandle(handlerInput) {
      return handlerInput.requestEnvelope.request.type === 'LaunchRequest';
    },
    handle(handlerInput) {
      const speechText = 'Hola, bienvenido workspace, tu asistente de control de entornos configurados en tú aplicación.';
  
      return handlerInput.responseBuilder
        .speak(speechText)
        .reprompt(speechText)
        .getResponse();
  
    },
  };
  
  module.exports = { LaunchRequest }