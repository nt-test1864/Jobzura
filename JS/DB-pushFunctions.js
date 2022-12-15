var Moralis = require("moralis/node");
var referralCodes = require("referral-codes")
import {GetMaxJobsID, IsUserAlreadyInDB, GetMaxJobzuraAgreementID, GetReferredBy } from "./DB-cloudFunctions";


// ETH Server
//const serverUrl = "https://rbfqybjb4vga.usemoralis.com:2053/server"
//const appId = "FltzNNp8ebZsRkVnPTd6RKWTF2XoTLmVDMHSicVd"

// Matic Server
const serverUrl = "https://gbmvbywfzibe.usemoralis.com:2053/server";
const appId = "6KNO1YxYUUp26EgElEHsfQ8ywPTJfs6D1C2H2yMR";
Moralis.start({ serverUrl, appId });


// -------------------------------------------------------------------------------------------------------------------------

export async function SaveAliasToMoralisDB(address, alias) {

  const Aliases = Moralis.Object.extend("Aliases");
  const aliases = new Aliases();
  aliases.set("Address", address);
  aliases.set("Alias", alias);

  await aliases.save().then(
    (aliases) => {
      console.log("New object created with objectId: " + aliases.id);
    },
    (error) => {
      console.log(
        "Failed to create new object, with error code: " + error.message
      );
    }
  );
}


//------------------------------------------------------------------------------------------------
//                                    Notifications
//------------------------------------------------------------------------------------------------

export async function UpdateNotifications(Wallet, Description) {
  const Notifications = Moralis.Object.extend("Notifications");
  const notification = new Notifications();
  notification.set("Wallet", Wallet.toLowerCase());
  notification.set("Description", Description);

  await notification.save()
  .then((notification) => {
      console.log('New object created with objectId: ' + notification.id);
  }, (error) => {
      console.log('Failed to create new object, with error code: ' + error.message);
  });
}

export async function SetNotificationsAsRead(Wallet) {
  const query = new Moralis.Query("Notifications"); 
  query.equalTo("Wallet", Wallet);
  query.equalTo("Read", 0);
  var result = await query.find();

  for (const notification of result) {
      notification.set("Read", 1);
      await notification.save()
  }
  console.log('Success');
}
// ------------------------------------------------------------------------------------------------------------------------

// save Job post
export async function SaveJobToMoralisDB(
  seller,
  title,
  price,
  description,
  imageLinks
) {
  // get current length of the table -> new id = length + 1
  const maxJobID = await GetMaxJobsID();

  const Jobs = Moralis.Object.extend("Jobs");
  const job = new Jobs();
  job.set("Seller", seller.toLowerCase());
  job.set("Title", title);
  job.set("Description", description);
  job.set("Price", price);
  job.set("imageLinks", imageLinks);
  job.set("State", "active");
  job.set("id_", maxJobID + 1);

  await job.save().then(
    (job) => {
      console.log("New object created with objectId: " + job.id);
    },
    (error) => {
      console.log(
        "Failed to create new object, with error code: " + error.message
      );
    }
  );
}

// update Job post
  export async function UpdateJobToMoralisDB(objectId, title, price, description, TimeToDeliver) {
    const Jobs = Moralis.Object.extend("Jobs");
    const query = new Moralis.Query(Jobs);
    query.equalTo("objectId", objectId);
    const results_ = await query.find();

    if (results_.length > 0) {
      const job = results_[0];
      job.set("Title", title);
      job.set("Description", description);
      job.set("Price", price);
      job.set("TimeToDeliver", TimeToDeliver);
      
      await job.save().then(
      (job) => {
        console.log("Job object updated with objectId: " + objectId);
      },
      (error) => {
        console.log(
          "Failed to create update job object, with error code: " + error.message
        );
      }
    );
  }
}

// save Job post
export async function SaveJobStep1ToMoralisDB(
  res,
  objectId,
  seller,
  title,
  jobCategory,
  jobSubCategory,
  jobDescription
) {
  const Jobs = Moralis.Object.extend("Jobs");
  const query = new Moralis.Query(Jobs);
  query.equalTo("objectId", objectId);
  const results_ = await query.find();

  if (results_.length > 0) {
    const job = results_[0];
    job.set("Title", title);
    job.set("Category", jobCategory);
    job.set("SubCategory", jobSubCategory);
    job.set("Description", jobDescription);
    // job.set("TimeToDeliver", TimeToDeliver);

      await job.save().then(
      (job) => {
        console.log("Job object updated with objectId: " + objectId);
        // return objectId;
        res.status(201).json({ oId: objectId }); 
      },
      (error) => {
        console.log(
          "Failed to create update job object, with error code: " + error.message
        );
      })
  }else{
    // get current length of the table -> new id = length + 1
    const maxJobID = await GetMaxJobsID();

    const Jobs = Moralis.Object.extend("Jobs");
    const job = new Jobs();
    job.set("Seller", seller.toLowerCase());
    job.set("Title", title);
    job.set("Category", jobCategory);
    job.set("SubCategory", jobSubCategory);
    job.set("Description", jobDescription);
    job.set("State", "active");
    job.set("id_", maxJobID + 1);

    await job.save().then(
      (job) => {
        console.log("New object created with objectId: " + job.id);
        // return job.id;
        res.status(201).json({ oId: job.id }); 
      },
      (error) => {
        console.log(
          "Failed to create new object, with error code: " + error.message
        );
      }
    );
  }
  res.status(201).json({ oId: '' }); //return '';
}

// save Job post
export async function SaveJobStep2ToMoralisDB(
  objectId,
  seller,
  jobPriceCurrencyBasic,
  jobPriceBasic,
  jobDeliveryTime
) {
  const Jobs = Moralis.Object.extend("Jobs");
  const query = new Moralis.Query(Jobs);
  query.equalTo("objectId", objectId);
  const results_ = await query.find();

  if (results_.length > 0) {
    const job = results_[0];
    job.set("CurrencyTicker", jobPriceCurrencyBasic);
    job.set("Price", jobPriceBasic);
    job.set("TimeToDeliver", jobDeliveryTime);

      await job.save().then(
      (job) => {
        console.log("Job object updated with objectId: " + objectId);
      },
      (error) => {
        console.log(
          "Failed to create update job object, with error code: " + error.message
        );
      })
  }
}

// save Job post
export async function SaveJobStep3ToMoralisDB(
  objectId,
  seller,
  imageLinks
) {
  const Jobs = Moralis.Object.extend("Jobs");
  const query = new Moralis.Query(Jobs);
  query.equalTo("objectId", objectId);
  const results_ = await query.find();

  if (results_.length > 0) {
    const job = results_[0];
    job.set("imageLinks", imageLinks);

      await job.save().then(
      (job) => {
        console.log("Job object updated with objectId: " + objectId);
      },
      (error) => {
        console.log(
          "Failed to create update job object, with error code: " + error.message
        );
      })
  }
}

// save rating to the submit-review page
export async function SaveRatingToMoralisDB(
  rating,
  review,
  privateReview,
  jobID,
  jobSeller,
  jobBuyer,
  like,
  dislike,
) {

  // get current length of the table -> new id = length + 1
  const Ratings = Moralis.Object.extend("Ratings");
  const ratingObject = new Ratings();
  ratingObject.set("Rating", rating);
  ratingObject.set("Review", review);
  ratingObject.set("Private", privateReview);
  ratingObject.set("JobID", jobID);
  ratingObject.set("JobSeller", jobSeller.toLowerCase());
  ratingObject.set("JobBuyer", jobBuyer.toLowerCase());
  ratingObject.set("Like", like);
  ratingObject.set("Dislike", dislike);

  await ratingObject.save().then(
    (ratingObject) => {
      console.log("New object created with objectId: " + ratingObject.id);
    },
    (error) => {
      console.log(
        "Failed to create new object, with error code: " + error.message
      );
    }
  );
}

// create a new Referral Code for the user
export async function CreateReferralCode(UserAddress) {

  if(UserAddress.length != 42) { // should be 42 for EVM addresses
    console.log(`UserAddress.length is not 42, but: ${UserAddress.length}`);
    return;
  }

  const ReferralCodeGenerated = (referralCodes.generate({length: 32, count: 1}))[0];
  console.log(`ReferralCodeGenerated: ${ReferralCodeGenerated}`);

  // set all 3 variables
  const ReferralCodes = Moralis.Object.extend("ReferralCodes");
  const referralCode = new ReferralCodes();
  referralCode.set("UserAddress", UserAddress);
  referralCode.set("ReferralCodeGenerated", ReferralCodeGenerated);
  referralCode.set("Used", 0);

  await referralCode.save()
  .then((referralCode) => {
    console.log('New object created with objectId: ' + referralCode.id);
  }, (error) => {
    console.log('Failed to create new object, with error code: ' + error.message);
  });

  return ReferralCodeGenerated;
}


// add a referral code on Wallet connect
export async function UseReferralCode(UserAddress, ReferralCodeUsed) {

  // check if user is in the Table already (cuz if you found the site without the referral code, then dont add it later)
  const userAlreadyInDB = await IsUserAlreadyInDB("Referrals", UserAddress);
  console.log(`userAlreadyInDB: ${userAlreadyInDB}`);

  if(userAlreadyInDB) { // should be 42 for EVM addresses
    return "user already in DB";
  }

  // figure out 'referredBy'
  console.log(`ReferralCodeUsed: ${ReferralCodeUsed}`);
  const referredBy = await GetReferredBy(ReferralCodeUsed);
  console.log(`referredBy: ${referredBy}`);

  // set all 3 variables
  const ReferralCodes = Moralis.Object.extend("Referrals");
  const referralCode = new ReferralCodes();
  referralCode.set("UserAddress", UserAddress);
  referralCode.set("ReferralCodeUsed", ReferralCodeUsed);
  referralCode.set("ReferredBy", referredBy);

  await referralCode.save()
  .then((referralCode) => {
    console.log('New object created with objectId: ' + referralCode.id);
    IncreaseUsedReferralCodeCounter(ReferralCodeUsed);
    return "user added to DB";
  }, (error) => {
    console.log('Failed to create new object, with error code: ' + error.message);
    return "error adding user to DB";
  });
}


// create a new Referral Code for the user
export async function IncreaseUsedReferralCodeCounter(ReferralCodeUsed) {

  const ReferralCodes = Moralis.Object.extend("ReferralCodes");
  const query = new Moralis.Query(ReferralCodes);
  query.equalTo("ReferralCodeGenerated", ReferralCodeUsed);
  const results_ = await query.find();

  if (results_.length > 0) {
    const referral = results_[0];

    referral.set("Used", referral.get("Used") + 1);

    await referral.save()
    .then((referral) => {
      console.log('New object created with objectId: ' + referral.id);
    }, (error) => {
      console.log('Failed to create new object, with error code: ' + error.message);
    });
  }
}

// Contract Created by Seller
export async function UpdateContracts_ContractCreatedByBuyer(
  BuyerWallet,
  SellerWallet,
  index,
  JobID,
  Title,
  Description,
  hashDescription,
  Price,
  CurrencyTicker,
  ChainID,
  transactionHash,
  OfferValidUntil,
  TimeToDeliver,
  Arbiters
) {
  const maxJobzuraAgreementID = await GetMaxJobzuraAgreementID();

  const Agreements = Moralis.Object.extend("Jobzura_Agreements");
  const agreement = new Agreements();
  agreement.set("ContractStartedBy", "Buyer");
  agreement.set("BuyerWallet", BuyerWallet.toLowerCase());
  agreement.set("SellerWallet", SellerWallet.toLowerCase());
  agreement.set("index", index);
  agreement.set("JobID", JobID);
  agreement.set("Title", Title);
  agreement.set("Description", Description);
  agreement.set("hashDescription", hashDescription);
  agreement.set("Price", Price);
  agreement.set("CurrencyTicker", CurrencyTicker);
  agreement.set("ChainID", ChainID);
  agreement.set("CreatedTxHash", transactionHash);
  agreement.set("OfferValidUntil", OfferValidUntil);
  agreement.set("TimeToDeliver", TimeToDeliver);
  agreement.set("Arbiters", Arbiters.toLowerCase());
  agreement.set("State", "buyer_initialized_and_paid");
  agreement.set("ApprovedBy", ""); // ?
  agreement.set("id_", maxJobzuraAgreementID + 1);

  await agreement.save().then(
    (agreement) => {
      console.log("New object created with objectId: " + agreement.id);
    },
    (error) => {
      console.log(
        "Failed to create new object, with error code: " + error.message
      );
    }
  );
}

// Cancel Contract
export async function UpdateContracts_CancelContract(
  objectId,
  transactionHash
) {
  const Agreements = Moralis.Object.extend("Jobzura_Agreements");
  const query = new Moralis.Query(Agreements);
  query.equalTo("objectId", objectId);
  const results_ = await query.find();

  if (results_.length > 0) {
    const agreement = results_[0];
    agreement.set("State", "canceled");
    agreement.set("canceledTxHash", transactionHash);

    await agreement.save().then(
      (agreement) => {
        console.log("New object created with objectId: " + agreement.id);
      },
      (error) => {
        console.log(
          "Failed to create new object, with error code: " + error.message
        );
      }
    );
  }
}

// Accept Contract By Seller
export async function UpdateContracts_ContractAcceptedBySeller(
  SellerWallet,
  objectId,
  transactionHash
) {
  const Agreements = Moralis.Object.extend("Jobzura_Agreements");
  const query = new Moralis.Query(Agreements);
  query.equalTo("objectId", objectId);
  const results_ = await query.find();

  if (results_.length > 0) {
    const agreement = results_[0];
    agreement.set("State", "in progress");
    agreement.set("SellerWallet", SellerWallet.toLowerCase());
    agreement.set("AcceptedTxHash", transactionHash);

    await agreement.save().then(
      (agreement) => {
        console.log("New object created with objectId: " + agreement.id);
      },
      (error) => {
        console.log(
          "Failed to create new object, with error code: " + error.message
        );
      }
    );
  }
}

// Confirm Delivery
export async function UpdateContracts_ConfirmDelivery(
  objectId,
  transactionHash
) {
  const Agreements = Moralis.Object.extend("Jobzura_Agreements");
  const query = new Moralis.Query(Agreements);
  query.equalTo("objectId", objectId);
  const results_ = await query.find();

  if (results_.length > 0) {
    const agreement = results_[0];
    agreement.set("State", "complete");
    agreement.set("CompletedTxHash", transactionHash);

    await agreement.save().then(
      (agreement) => {
        console.log("New object created with objectId: " + agreement.id);
      },
      (error) => {
        console.log(
          "Failed to create new object, with error code: " + error.message
        );
      }
    );
  }
}

// Claim Funds
export async function UpdateContracts_ClaimFunds(objectId, transactionHash) {
  const Agreements = Moralis.Object.extend("Jobzura_Agreements");
  const query = new Moralis.Query(Agreements);
  query.equalTo("objectId", objectId);
  const results_ = await query.find();

  if (results_.length > 0) {
    const agreement = results_[0];
    agreement.set("State", "complete");
    agreement.set("CompletedTxHash", transactionHash);

    await agreement.save().then(
      (agreement) => {
        console.log("New object created with objectId: " + agreement.id);
      },
      (error) => {
        console.log(
          "Failed to create new object, with error code: " + error.message
        );
      }
    );
  }
}

// Return Payment
export async function UpdateContracts_ReturnPayment(objectId, transactionHash) {
  const Agreements = Moralis.Object.extend("Jobzura_Agreements");
  const query = new Moralis.Query(Agreements);
  query.equalTo("objectId", objectId);
  const results_ = await query.find();

  if (results_.length > 0) {
    const agreement = results_[0];
    agreement.set("State", "complete");
    agreement.set("CompletedTxHash", transactionHash);

    await agreement.save().then(
      (agreement) => {
        console.log("New object created with objectId: " + agreement.id);
      },
      (error) => {
        console.log(
          "Failed to create new object, with error code: " + error.message
        );
      }
    );
  }
}

// Start Disputes
export async function UpdateContracts_StartDispute(objectId, transactionHash) {
  const Agreements = Moralis.Object.extend("Jobzura_Agreements");
  const query = new Moralis.Query(Agreements);
  query.equalTo("objectId", objectId);
  const results_ = await query.find();

  if (results_.length > 0) {
    const agreement = results_[0];
    agreement.set("State", "dispute");
    agreement.set("DisputeTxHash", transactionHash);

    await agreement.save().then(
      (agreement) => {
        console.log("New object created with objectId: " + agreement.id);
      },
      (error) => {
        console.log(
          "Failed to create new object, with error code: " + error.message
        );
      }
    );
  }
}

// UserParticipationData Table
export async function UpdateUserParticipationData(Wallet, Property) {
  const UserParticipationData = Moralis.Object.extend("UserParticipationData");
  const query1 = new Moralis.Query(UserParticipationData);
  query1.equalTo("userAddress", Wallet.toLowerCase());
  const results1 = await query1.find();

  if (results1.length > 0) {
    const agreement = results1[0];
    agreement.increment(Property);

    await agreement.save().then(
      (agreement) => {
        console.log(
          `Number of ${Property} updated, with objectId: ${agreement.id}`
        );
      },
      (error) => {
        console.log(
          `Failed to update ${Property}, with error code: ${error.message}`
        );
      }
    );
  } else {
    const agreement = new UserParticipationData();
    agreement.set("userAddress", Wallet.toLowerCase());
    agreement.increment(Property);

    await agreement.save().then(
      (agreement) => {
        console.log(
          `Number of ${Property} updated, with objectId: ${agreement.id}`
        );
      },
      (error) => {
        console.log(
          `Failed to update ${Property}, with error code: ${agreement.message}`
        );
      }
    );
  }
}
// save Users Language
export async function UpdateUserProfileLanguageToMoralisDB(objectId, language) {
  const Users = Moralis.Object.extend("Users"); // UserParticipationData
  const query = new Moralis.Query(Users);
  query.equalTo("objectId", objectId);
  const results_ = await query.find();
  // res.status(201).json(results_);

  if (results_.length > 0) {
    const userdata = results_[0];
    userdata.set("Languages", language);

    // userdata.unset("Timezone");
    // userdata.unset("Headline");
    // userdata.unset("Description");
    // userdata.unset("Languages");

    await userdata.save().then(
      (userdata) => {
        console.log("New object created with objectId: " + userdata.id);
      },
      (error) => {
        console.log(
          "Failed to create new object, with error code: " + error.message
        );
      }
    );
  }
}

export async function UpdateUserProfileUsernameToMoralisDB(objectId, Username) {
  const Users = Moralis.Object.extend("Users");
  const query = new Moralis.Query(Users);
  query.equalTo("objectId", objectId);
  const results_ = await query.find();
  // res.status(201).json(results_);

  if (results_.length > 0) {
    const userdata = results_[0];
    userdata.set("Username", Username);
    await userdata.save().then(
      (userdata) => {
        console.log("New object created with objectId: " + userdata.id);
      },
      (error) => {
        console.log(
          "Failed to create new object, with error code: " + error.message
        );
      }
    );
  }
}

export async function UpdateUserProfileHeadlineToMoralisDB(objectId, Headline) {
  const Users = Moralis.Object.extend("Users");
  const query = new Moralis.Query(Users);
  query.equalTo("objectId", objectId);
  const results_ = await query.find();
  // res.status(201).json(results_);

  if (results_.length > 0) {
    const userdata = results_[0];
    userdata.set("Headline", Headline);
    await userdata.save().then(
      (userdata) => {
        console.log("New object created with objectId: " + userdata.id);
      },
      (error) => {
        console.log(
          "Failed to create new object, with error code: " + error.message
        );
      }
    );
  }
}

export async function UpdateUserProfileDescriptionToMoralisDB(
  objectId,
  description
) {
  const Users = Moralis.Object.extend("Users");
  const query = new Moralis.Query(Users);
  query.equalTo("objectId", objectId);
  const results_ = await query.find();
  // res.status(201).json(results_);
  
  if (results_.length > 0) {
    const userdata = results_[0];
    userdata.set("Description", description);
    await userdata.save().then(
      (userdata) => {
        console.log("New object created with objectId: " + userdata.id);
      },
      (error) => {
        console.log(
          "Failed to create new object, with error code: " + error.message
        );
      }
    );
  }
}

export async function UpdateUserProfileTimezoneToMoralisDB(objectId, timezone) {
  const Users = Moralis.Object.extend("Users");
  const query = new Moralis.Query(Users);
  query.equalTo("objectId", objectId);
  const results_ = await query.find();
  // res.status(201).json(results_);

  if (results_.length > 0) {
    const userdata = results_[0];
    userdata.set("Timezone", timezone);
    await userdata.save().then(
      (userdata) => {
        console.log("New object created with objectId: " + userdata.id);
      },
      (error) => {
        console.log(
          "Failed to create new object, with error code: " + error.message
        );
      }
    );
  }
}

export async function UpdateUserProfileSkillsToMoralisDB(objectId, skills) {
  const Users = Moralis.Object.extend("Users");
  const query = new Moralis.Query(Users);
  query.equalTo("objectId", objectId);
  const results_ = await query.find();
  // res.status(201).json(results_);

  if (results_.length > 0) {
    const userdata = results_[0];
    userdata.set("Skills", skills);
    await userdata.save().then(
      (userdata) => {
        console.log("New object created with objectId: " + userdata.id);
      },
      (error) => {
        console.log(
          "Failed to create new object, with error code: " + error.message
        );
      }
    );
  }
}



export async function UpdateReviewLikedDisliked(
  userWallet,
  objectId,
  status
) {
  userWallet = userWallet.toLowerCase();
  const Ratings = Moralis.Object.extend("Ratings");
  const query = new Moralis.Query(Ratings);
  query.equalTo("objectId", objectId);
  const results_ = await query.find();
      
  let LikesBy = [];
  let DislikesBy = [];

  if (results_.length > 0) {
    const rating = results_[0];
    let DBLikesBy = rating.get("LikesBy")!==undefined&&rating.get("LikesBy")!==''?rating.get("LikesBy").split(','):[];
    let DBDislikesBy = rating.get("DislikesBy")!==undefined&&rating.get("DislikesBy")!==''?rating.get("DislikesBy").split(','):[];
    LikesBy = [...DBLikesBy];
    DislikesBy = [...DBDislikesBy];

    let sss;
    if(status=='like')
    {
      let idx;
      idx=LikesBy.indexOf(userWallet);if(idx>=0){LikesBy.splice(idx,1);}
      if(LikesBy.length === DBLikesBy.length){LikesBy.push(userWallet);}
      idx=DislikesBy.indexOf(userWallet);if(idx>=0){DislikesBy.splice(idx,1);}
    }
    else if(status=='dislike')
    {
      let idx;
      idx=LikesBy.indexOf(userWallet);if(idx>=0){LikesBy.splice(idx,1);}
      idx=DislikesBy.indexOf(userWallet);if(idx>=0){DislikesBy.splice(idx,1);}
      if(DislikesBy.length === DBDislikesBy.length){DislikesBy.push(userWallet)}
    }


    LikesBy=LikesBy.filter((element) => { return element !== null && element !== undefined && element !== '';});
    DislikesBy=DislikesBy.filter((element) => { return element !== null && element !== undefined && element !== '';});
    rating.set("LikesBy", LikesBy.join(","));
    rating.set("DislikesBy", DislikesBy.join(","));
    rating.set("Likes", LikesBy.length);
    rating.set("Dislikes", DislikesBy.length);

    await rating.save().then(
      (rating) => {
        console.log("New object created with objectId: " + rating.id);
      },
      (error) => {
        console.log(
          "Failed to create new object, with error code: " + error.message
        );
      }
    );
  }
  return 'done';
}