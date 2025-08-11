const Alexa = require('ask-sdk-core');

const { SessionEndedRequest, HelpIntent, CancelAndStopIntentHandler, UnhandledIntent } = require('./intents/AmazonIntents');
const { HelloWorldIntentHandler } = require('./intents/HelloWorldIntent');
const { LaunchRequest } = require('./intents/LaunchIntent');
const { ActivateEnvironmentIntent, DeactivateEnvironmentIntent, ListEnvironmentsIntent, ActivateEnvironmentSimpleIntent, DeactivateEnvironmentSimpleIntent } = require('./intents/EnvironmentIntents');

const createSkill = () => {
    const skillbuilder = Alexa.SkillBuilders.custom();
    return skillbuilder.addRequestHandlers(
        LaunchRequest,
        HelloWorldIntentHandler,
        ActivateEnvironmentIntent,
        DeactivateEnvironmentIntent,
        ActivateEnvironmentSimpleIntent,
        DeactivateEnvironmentSimpleIntent,
        ListEnvironmentsIntent,
        SessionEndedRequest,
        HelpIntent,
        CancelAndStopIntentHandler,
        UnhandledIntent
    )
        .withApiClient(new Alexa.DefaultApiClient())
        .withCustomUserAgent('workspace/v1')
        .create()
}

module.exports = { createSkill }