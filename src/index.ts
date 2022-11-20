import {SSM} from 'aws-sdk';
import {APIGatewayProxyEventV2, APIGatewayProxyResultV2} from "aws-lambda";
import * as Discord from 'discord-interactions';

export const handler = async (event: APIGatewayProxyEventV2): Promise<APIGatewayProxyResultV2> => {
    const awsSSM = new SSM();
    const publicKey = await awsSSM.getParameter({
        Name: process.env.PUBLIC_KEY_PARAM_NAME,
        WithDecryption: true
    }).promise();

    // 署名の検証
    const signature = event.headers['x-signature-ed25519'];
    const timestamp = event.headers['x-signature-timestamp'];
    const isValidRequest = Discord.verifyKey(event.body, signature as String, timestamp as String, publicKey.Parameter?.Value as String);
    console.info('isValidRequest:', isValidRequest);

    if (!isValidRequest) {
        return {
            statusCode: 401,
            body: JSON.stringify({
                message: "Bad request signature"
            })
        };
    }

    const requestBody = JSON.parse(event.body);
    const interactionType = requestBody.type;
    console.info('Interaction type:', interactionType);

    if (interactionType === Discord.InteractionType.PING) {
        // ACK
        return {
            statusCode: 200,
            body: JSON.stringify({
                type: Discord.InteractionResponseType.PONG
            })
        };
    } else if (interactionType === Discord.InteractionType.APPLICATION_COMMAND) {
        return {
            statusCode: 200,
            body: JSON.stringify({
                type: Discord.InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
                data: {
                    content: 'スプラシューターを使うでし！'
                }
            })
        };
    }
};