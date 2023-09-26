// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: MIT-0

// import data from "./backend/serverless/appconfig.json";
const data = [];
const appConfigJson = Object.assign(
  {},
  ...data.map((x) => ({ [x.OutputKey]: x.OutputValue }))
);

const appConfig = {
  apiGatewayInvokeUrl:
    "https://ea29n64qa1.execute-api.us-east-1.amazonaws.com/prod/" ||
    appConfigJson.apiGatewayInvokeUrl,
  cognitoUserPoolId: "us-east-1_f3gzDm9ii" || appConfigJson.cognitoUserPoolId,
  cognitoAppClientId:
    "2bsbmvoc0vuvtoolpq31n7escu" || appConfigJson.cognitoAppClientId,
  cognitoIdentityPoolId:
    "us-east-1:088a74e6-ab01-4720-ab14-b0cb4fbbd502" ||
    appConfigJson.cognitoIdentityPoolId,
  appInstanceArn:
    "arn:aws:chime:us-east-1:926181945916:app-instance/64912f49-3282-4676-b800-8ed5bde7a444" ||
    appConfigJson.appInstanceArn,
  region: "us-east-1", // Only supported region for Amazon Chime SDK Messaging as of this writing
  attachments_s3_bucket_name:
    "credit-butterfly-dev-chat-chatattachmentsbucket-1qxv220ucra6b" ||
    appConfigJson.attachmentsS3BucketName,
};
export default appConfig;
