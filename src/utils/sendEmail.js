const { SendEmailCommand } = require("@aws-sdk/client-ses");
const { sesClient } = require("./sesClient.js");

const createSendEmailCommand = (toAddress, fromAddress,body,subject) => {
    return new SendEmailCommand({
      Destination: {
        /* required */
        CcAddresses: [
          /* more items */
        ],
        ToAddresses: [
          toAddress,
          /* more To-email addresses */
        ],
      },
      Message: {
        /* required */
        Body: {
          /* required */
          Html: {
            Charset: "UTF-8",
            Data:  `<h1> ${body} </h1>`,
          },
          Text: {
            Charset: "UTF-8",
            Data: "This is Email Body Text",
          },
        },
        Subject: {
          Charset: "UTF-8",
          Data: subject || "This is Subject Text",
        },
      },
      Source: fromAddress,
      ReplyToAddresses: [
        /* more items */
      ],
    });
  };


  const run = async (subject,body) => {
    const sendEmailCommand = createSendEmailCommand(
      "akashs3468@gmail.com",
      "akash@devswipe.xyz",
      body,
      subject
    );
  
    try {
      return await sesClient.send(sendEmailCommand);
    } catch (caught) {
      if (caught instanceof Error && caught.name === "MessageRejected") {
        /** @type { import('@aws-sdk/client-ses').MessageRejected} */
        const messageRejectedError = caught;
        return messageRejectedError;
      }
      throw caught;
    }
  };
  
  // snippet-end:[ses.JavaScript.email.sendEmailV3]
  module.exports = { run };