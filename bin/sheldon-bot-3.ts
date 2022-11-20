#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from 'aws-cdk-lib';
import { SheldonBot3Stack } from '../lib/sheldon-bot-3-stack';

const app = new cdk.App();
new SheldonBot3Stack(app, 'SheldonBot3Stack', {
    tags: {
        APP: 'sheldon-bot-3'
    },
});