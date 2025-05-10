const cron = require('node-cron');
const {subDays,startOfDay,endOfDay} = require('date-fns');
const connectionRequestsModel = require('../models/connectionRequests');
const sendEmail = require('../utils/sendEmail');


console.log("Cron job started...");
cron.schedule("03 2 * * *", async () => {
    // 
  console.log('Cron job ran at', new Date().toLocaleTimeString());
  console.log("Running job every minute for testing...");
  // Send email to all users who got request yesterday

  const yesterday = subDays(new Date(),1);
  // gives yesterdays date
  //calculate start of yesterday & end
  const startofYesterday = startOfDay(yesterday);
  const endofYesterday = endOfDay(yesterday);

  try{
      const pendingRequests = await connectionRequestsModel.find({
          status: "interested",
          createdAt : {
              $gte: startofYesterday,
              $lt: endofYesterday,
          }
      }).populate("fromUserId toUserId");


      //unique emails of users who got requests yesterday
      // we are using set to get unique emails
      const listofEmails = [...new Set(
          pendingRequests.map((request) => {
              return request.toUserId.emailID;
          })
      )];

      console.log("CRON", listofEmails);

      for(const email of listofEmails){
          // send emails
          try{
              const res = await sendEmail.run(
                  "New Friend Request Pending",
                  "You have a new friend request pending. Please check your account for more details");
                  console.log("Email sent to: ",email); 
          }catch(err){
              console.log("Error in sending email: ",err.message);
          }

      }
  }
  catch(err){
      console.log("Error in cron job: ",err.message);
  }

});
