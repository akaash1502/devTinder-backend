const { SESClient } = require("@aws-sdk/client-ses");
// Set the AWS Region.
const REGION = process.env.AWS_REGION;;
// Create SES service object.
const sesClient = new SESClient({ 
    region: REGION, 
    credentials : {
    accessKeyId: process.env.AWS_ACCESS_KEY,
    secretAccessKey: process.env.AWS_SES_SECRET,
    },
});

module.exports = { sesClient };
// snippet-end:[ses.JavaScript.createclientv3]