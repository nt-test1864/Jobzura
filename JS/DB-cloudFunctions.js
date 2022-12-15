var Moralis = require("moralis/node");


// ETH Server
//const serverUrl = "https://rbfqybjb4vga.usemoralis.com:2053/server"
//const appId = "FltzNNp8ebZsRkVnPTd6RKWTF2XoTLmVDMHSicVd"

// Matic Server 
const serverUrl = "https://gbmvbywfzibe.usemoralis.com:2053/server"
const appId = "6KNO1YxYUUp26EgElEHsfQ8ywPTJfs6D1C2H2yMR"
Moralis.start({ serverUrl, appId });


export async function GetMyNotifications(UserWallet){
  const params =  { UserWallet : UserWallet };
  return Moralis.Cloud.run("GetMyNotifications", params);
}
export async function GetMyNotificationUnreadCount(UserWallet){
  const params =  { UserWallet : UserWallet };
  return Moralis.Cloud.run("GetMyNotificationUnreadCount", params);
}

export async function DoesAliasBelongToWallet(Address, Alias){
  const params =  { Address : Address, Alias: Alias };
  return Moralis.Cloud.run("DoesAliasBelongToWallet", params);
}

export async function GetWalletFromAlias(Alias){
  const params =  { Alias: Alias };
  return Moralis.Cloud.run("GetWalletFromAlias", params);
}

export async function GetMaxJobzuraAgreementID(){
  return Moralis.Cloud.run("GetMaxJobzuraAgreementID");
}

export async function GetMaxJobsID(){
  return Moralis.Cloud.run("GetMaxJobsID");
}

export async function GetTotalNumberOfJobs(){
  return Moralis.Cloud.run("GetTotalNumberOfJobs");
}

export async function GetAllJobs(){
  return Moralis.Cloud.run("GetAllJobs");
}

export async function GetUserJobs(UserWallet){
  const params =  { UserWallet : UserWallet };
  return Moralis.Cloud.run("GetUserJobs", params);
}

export async function GetJob(JobID){
  const params =  { JobID : parseInt(JobID) };
  return Moralis.Cloud.run("GetJob", params);
}

export async function AppendRatingToJob(JobID, Rating){
  const params =  { JobID : parseInt(JobID), Rating : parseInt(Rating) };
  return Moralis.Cloud.run("AppendRatingToJob", params);
}

export async function DeleteJob(JobID){
  const query = new Moralis.Query("Jobs");
  query.equalTo("id_", parseInt(JobID));
  const object = await query.first();
  await object.destroy();
  return "Job Deleted";
}

export async function GetAllAgreements(){
  return Moralis.Cloud.run("GetAllAgreements");
}

export async function GetSellerAgreements(UserWallet){
  const query = new Moralis.Query("Jobzura_Agreements");
  query.equalTo("SellerWallet", UserWallet);
  const results = await query.find();
  return results;
}

export async function GetBuyerAgreements(UserWallet){
  const query = new Moralis.Query("Jobzura_Agreements");
  query.equalTo("BuyerWallet", UserWallet);
  const results = await query.find();
  return results;
}
  
export async function GetMaxReviewsID(){
  return Moralis.Cloud.run("GetMaxReviewsID");
}

export async function GetTotalNumberOfReviews(){
  return Moralis.Cloud.run("GetTotalNumberOfReviews");
}

export async function GetAllReviews(){
  return Moralis.Cloud.run("GetAllReviews");
}

export async function GetUserReviews(UserWallet){
  const params =  { UserWallet : UserWallet };
  return Moralis.Cloud.run("GetUserReviews", params);
}

export async function GetReview(ReviewID){
  const params =  { ReviewID : parseInt(ReviewID) };
  return Moralis.Cloud.run("GetReview", params);
}

export async function AppendLikeAndDislikeToReview(ReviewID, Likes, Dislikes){
  const params =  { ReviewID : parseInt(ReviewID), Likes : parseInt(Likes), Dislikes : parseInt(Dislikes) };
  return Moralis.Cloud.run("AppendLikeAndDislikeToReview", params);
}

export async function GetContract(ContractID){
  const params =  { ContractID : parseInt(ContractID) };
  return Moralis.Cloud.run("GetContract", params);
}

export async function GetUsersDetails(UserWallet){
  const params =  { UserWallet : UserWallet };
  // return Moralis.Cloud.run("GetUsersDetails", params);
  let results=Moralis.Cloud.run("GetUsersDetails", params);
  return results;

  // if (results.length <= 0) {
  //   const query = new UserParticipationData();
  
  //   // query.equalTo("userAddress", request.params.UserWallet);

  //     // const userProfile = new Users();
  //     query.set("userAddress", UserWallet.toLowerCase());
  //     // userProfile.increment(Property);
  
  //     await query.save().then(
  //       (query) => {
  //         console.log(
  //           `Failed` // `Number of ${Property} updated, with objectId: ${userProfile.id}`
  //         );
  //       },
  //       (error) => {
  //         console.log(
  //           `Updated` // `Failed to update ${Property}, with error code: ${userProfile.message}`
  //         );
  //       }
  //     );
  
  //     const params =  { UserWallet : UserWallet };
  //     // return Moralis.Cloud.run("GetUsersDetails", params);
  //     results=Moralis.Cloud.run("GetUsersDetails", params);
  //     // const query2 = new Moralis.Query(Users);
  //     // query2.equalTo("userAddress", UserWallet.toLowerCase());
  //     // results = await query2.find();
  //   }
  //   return results;
}

export async function IsUserAlreadyInDB(Table, UserWallet){
  const params =  { Table: Table, UserWallet : UserWallet };
  return Moralis.Cloud.run("IsUserAlreadyInDB", params);
}

export async function GetReferredBy(ReferralCodeUsed){
  const params =  { ReferralCodeUsed : ReferralCodeUsed };
  return Moralis.Cloud.run("GetReferredBy", params);
}

export async function GetReferralChain3(UserWallet){
  const params =  { UserWallet : UserWallet };
  return Moralis.Cloud.run("GetReferralChain3", params);
}

export async function GetUserProfile(UserWallet){
  // const params =  { UserWallet : UserWallet };
  // return Moralis.Cloud.run("GetUserProfile", params);

  const Users = Moralis.Object.extend("Users");
  const query1 = new Moralis.Query(Users);
  query1.equalTo("userAddress", UserWallet.toLowerCase());
  let results = await query1.find();

  if (results.length <= 0) {
    const userProfile = new Users();
    userProfile.set("userAddress", UserWallet.toLowerCase());
    // userProfile.increment(Property);

    await userProfile.save().then(
      (userProfile) => {
        console.log(
          `Failed` // `Number of ${Property} updated, with objectId: ${userProfile.id}`
        );
      },
      (error) => {
        console.log(
          `Updated` // `Failed to update ${Property}, with error code: ${userProfile.message}`
        );
      }
    );

    const query2 = new Moralis.Query(Users);
    query2.equalTo("userAddress", UserWallet.toLowerCase());
    results = await query2.find();
  }

  return results;
}

export async function GetUserMessages(messageSender, messageReceiver){
  const params = { messageSender : messageSender, messageReceiver : messageReceiver };
  return Moralis.Cloud.run("GetUserMessages", params);
}

export async function GetUserMessagesPair(messageSender, messageReceiver){
  const params = { messageSender : messageSender, messageReceiver : messageReceiver };
  return Moralis.Cloud.run("GetUserMessagesPair", params);
}

export async function GetUserDisputeMessages(messageSender, messageReceiver){
  const params = { messageSender : messageSender, messageReceiver : messageReceiver };
  return Moralis.Cloud.run("GetUserDisputeMessages", params);
}

export async function GetUserDisputeMessagesPair(messageSender, messageReceiver){
  const params = { messageSender : messageSender, messageReceiver : messageReceiver };
  return Moralis.Cloud.run("GetUserDisputeMessagesPair", params);
}

export async function GetAllUsers(){
  const query = new Moralis.Query("Users");
  const results = await query.find();
  
  var users = []
  for(let i = 0; i < results.length; i++){
    users.push({
      userAddress: results[i].get("userAddress"),
      userHeadline: results[i].get("Headline"),
      userDescription: results[i].get("Description"),
      userTimezone: results[i].get("Timezone"),
      userSkills: results[i].get("Skills"),
      userCreated: results[i].get("createdAt"),
    })
  }
  
  return users;
}

export async function GetAllMessages(){
  const query = new Moralis.Query("Messages");
  const results = await query.find();
  
  var messages = []
  for(let i = 0; i < results.length; i++){
    messages.push(results[i])
  }
  
  return messages;
}

export async function GetAllDisputeMessages(){
  const query = new Moralis.Query("DisputeMessages");
  const results = await query.find();
  
  var messages = []
  for(let i = 0; i < results.length; i++){
    messages.push(results[i])
  }
  
  return messages;
}
