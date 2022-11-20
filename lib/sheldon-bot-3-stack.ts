import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import { Architecture, FunctionUrlAuthType, Runtime } from 'aws-cdk-lib/aws-lambda';
import { NodejsFunction } from 'aws-cdk-lib/aws-lambda-nodejs';
import { ManagedPolicy } from '@aws-cdk/aws-iam'

export class SheldonBot3Stack extends cdk.Stack {
    accountId: string
    constructor(scope: Construct, id: string, props?: cdk.StackProps) {
        super(scope, id, props);

        // AWSアカウントID
        this.accountId = cdk.Stack.of(this).account;

        const botFunction = new NodejsFunction(this, 'main', {
            runtime: Runtime.NODEJS_16_X,
            architecture: Architecture.ARM_64,
            entry: './src/index.ts',
            handler: 'handler',
            timeout: cdk.Duration.seconds(30),
            memorySize: 256,
            environment: {
                'GUILD_ID': '',
                'DISCORD_TOKEN': '',
                'PUBLIC_KEY_PARAM_NAME': '/sheldon-bot/public-key',
                'APP_ID_PARAM_NAME': '/sheldon-bot/app-id'
            }
        });
        // 実行ロール
        botFunction.role?.addManagedPolicy(
            ManagedPolicy.fromAwsManagedPolicyName('AmazonSSMReadOnlyAccess')
        );
        // 関数URL
        botFunction.addFunctionUrl({
            authType: FunctionUrlAuthType.NONE,
        });
    }
}
