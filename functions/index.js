const functions = require("firebase-functions");
const Moralis = require("moralis").default;
const admin = require("firebase-admin");
const {ethers} = require("ethers");
require("firebase-functions/logger/compat");

admin.initializeApp(functions.config().firebase);


async function getTx(hash) {
  const res = await admin.firestore().collection(`moralis/txs/Payzura_factoryescrow`).where("hash", "==", hash).limit(1).get()
  const list = res.docs.map(doc => doc.data());
  return list[0]
}

async function getRelatedJobForCreatedContract(HashOfDescription){
  const res = await admin.firestore().collection(`jobs`).where("HashOfDescription", "==", HashOfDescription).limit(1).get()
  const list = res.docs.map(doc => doc.data());
  return list[0]
}



exports.newPunkTransfer = functions.firestore
  .document(`moralis/events/Cryptopunktransferred/{id}`)
  .onCreate(async (snap) => {
  
    const tokenId = snap.data().punkIndex;

    await Moralis.start({
      apiKey: '8fAzFDO7LOj2U2GZ3PkjaCB1Xwe7iMkEk9LjR8K6V0jiftRnJTZT1RIFZr5hZ8aA',
    });

    const response = await Moralis.EvmApi.nft.getNFTTokenIdOwners({
      address:"0xb47e3cd837dDF8e4c57F05d70Ab865de6e193BBB",
      tokenId:tokenId,
    });

    const metaData = JSON.parse(response.raw.result[0].metadata);

    return snap.ref.set({
      image: metaData.image
    }, {merge: true});

  });



exports.onPayzuraWrite = functions.firestore
  .document(`moralis/events/Payzura_factoryescrow/{id}`)
  .onWrite(async (change) => {
    try {
      const event = change.after.data();
      console.log("event:" + event.name)
      console.log(event)

      if(!event) return
      if(event.name == "OfferCreatedBuyer") {
        //const tx = await getTx(event.transactionHash) // was not working for some reason, but the logic looks good
        //if(!tx) throw("no tx")
        const tx = "";
        await handleNewContractBuyer(tx, event)
        await appendJobData(tx, event);
      } else if(event.name == "OfferCreatedBuyer2") {
        //const tx = await getTx(event.transactionHash)
        //if(!tx) throw("no tx")
        const tx = "";
        await handleNewContractBuyer2(tx, event)
      } else if(event.name == "ContractCanceled") {
        //const tx = await getTx(event.transactionHash)
        //if(!tx) throw("no tx")
        const tx = "";
        await handleContractCanceled(tx, event)
      } else if(event.name == "OfferAcceptedSeller") {
        //const tx = await getTx(event.transactionHash)
        //if(!tx) throw("no tx")
        const tx = "";
        await handleContractAcceptedSeller(tx, event)
      } 
      else if(event.name == "FundsClaimed") {
        //const tx = await getTx(event.transactionHash)
        //if(!tx) throw("no tx")
        const tx = "";
        await handleFundsClaimed(tx, event)
      } else if(event.name == "PaymentReturned") {
        //const tx = await getTx(event.transactionHash)
        //if(!tx) throw("no tx")
        const tx = "";
        await handlePaymentReturned(tx, event)
      } else if(event.name == "DeliveryConfirmed") {
        //const tx = await getTx(event.transactionHash)
        //if(!tx) throw("no tx")
        const tx = "";
        await handleDeliveryConfirmed(tx, event)
      } else if(event.name == "DisputeStarted") {
        //const tx = await getTx(event.transactionHash)
        //if(!tx) throw("no tx")
        const tx = "";
        await handleDisputeStarted(tx, event)
      } else if(event.name == "DisputeVoted") {
        //const tx = await getTx(event.transactionHash)
        //if(!tx) throw("no tx")
        const tx = "";
        await handleDisputeVoted(tx, event)
      } else if(event.name == "DisputeClosed") {
        //const tx = await getTx(event.transactionHash)
        //if(!tx) throw("no tx")
        const tx = "";
        await handleDisputeClosed(tx, event)
      } 

    } catch (error) {
      console.error("I am an error!", error);
    }
  });



async function appendJobData(tx, event){

  console.log("appendJobData started...")

  const job = await getRelatedJobForCreatedContract(event.hashOfDescription);

  console.log("job:")
  console.log(job)

  const jobDataForContract = {
    Description: job.Description,
    CurrencyTicker: job.CurrencyTicker,
    ImageLinks: job.ImageLinks,
    Title: job.Title,
    SellerWallet: job.SellerWallet,
    JobId: job.JobId,
  }

  //await admin.firestore().collection("contracts").doc(event.chainId.toString()).collection(event.chainId.toString()).doc(event.clonedContractsIndex).set(jobDataForContract,{ merge: true });
  await admin.firestore().collection("contracts").doc(event.chainId.toString() + "_" + event.clonedContractsIndex).set(jobDataForContract,{ merge: true });
}

async function handleNewContractBuyer(tx, event) {
  const contract = {
    Index: event.clonedContractsIndex,
    ChainId: event.chainId.toString(),
    FactoryContractAddress: event.address,
    BuyerWallet: event.buyer,
    Price: event.price,
    Price_formatted: ethers.utils.formatEther(event.price),    // check the difference
    TokenContractAddress: event.tokenContractAddress,
    TimeToDeliver : event.timeToDeliver,
    HashOfDescription: event.hashOfDescription,
    OfferValidUntil: event.offerValidUntil,
    State: "buyer_initialized_and_paid",
    Created: new Date(),
    Updated: new Date()
  }

  //await admin.firestore().collection("contracts").doc(event.chainId.toString()).collection(event.chainId.toString()).doc(event.clonedContractsIndex).set(contract,{ merge: true });
  await admin.firestore().collection("contracts").doc(event.chainId.toString() + "_" + event.clonedContractsIndex).set(contract,{ merge: true });
}

async function handleNewContractBuyer2(tx, event) {
  const contract = {
    Index: event.clonedContractsIndex,
    PersonalizedOffer: event.personalizedOffer,
    Arbiters: event.arbiters,
    ReferrerAddress: event.referrerAddress,
    Updated: new Date()
  }

  //await admin.firestore().collection("contracts").doc(event.chainId.toString()).collection(event.chainId.toString()).doc(event.clonedContractsIndex).set(contract,{ merge: true });
  await admin.firestore().collection("contracts").doc(event.chainId.toString() + "_" + event.clonedContractsIndex).set(contract,{ merge: true });
}


async function handleContractCanceled(tx, event){
  const contract = {
    State: "canceled",
    Updated: new Date()
  }

  //await admin.firestore().collection("contracts").doc(event.chainId.toString()).collection(event.chainId.toString()).doc(event.clonedContractsIndex).set(contract,{ merge: true });
  await admin.firestore().collection("contracts").doc(event.chainId.toString() + "_" + event.clonedContractsIndex).set(contract,{ merge: true });
}

async function handleContractAcceptedSeller(tx, event){
  const contract = {
    State: "in progress",
    Updated: new Date()
  }

  //await admin.firestore().collection("contracts").doc(event.chainId.toString()).collection(event.chainId.toString()).doc(event.clonedContractsIndex).set(contract,{ merge: true });
  await admin.firestore().collection("contracts").doc(event.chainId.toString() + "_" + event.clonedContractsIndex).set(contract,{ merge: true });
}


// can add a document for successfully transacted total amount where we count this 
async function handleFundsClaimed(tx, event){
  const contract = {
    State: "complete",
    Updated: new Date()
  }

  //await admin.firestore().collection("contracts").doc(event.chainId.toString()).collection(event.chainId.toString()).doc(event.clonedContractsIndex).set(contract,{ merge: true });
  await admin.firestore().collection("contracts").doc(event.chainId.toString() + "_" + event.clonedContractsIndex).set(contract,{ merge: true });
}

async function handlePaymentReturned(tx, event){
  const contract = {
    State: "complete",
    Updated: new Date()
  }

  //await admin.firestore().collection("contracts").doc(event.chainId.toString()).collection(event.chainId.toString()).doc(event.clonedContractsIndex).set(contract,{ merge: true });
  await admin.firestore().collection("contracts").doc(event.chainId.toString() + "_" + event.clonedContractsIndex).set(contract,{ merge: true });
}

async function handleDeliveryConfirmed(tx, event){
  const contract = {
    State: "complete",
    Updated: new Date()
  }

  //await admin.firestore().collection("contracts").doc(event.chainId.toString()).collection(event.chainId.toString()).doc(event.clonedContractsIndex).set(contract,{ merge: true });
  await admin.firestore().collection("contracts").doc(event.chainId.toString() + "_" + event.clonedContractsIndex).set(contract,{ merge: true });
}

async function handleDisputeStarted(tx, event){
  const contract = {
    State: "in dispute",
    Votes: [],
    Updated: new Date()
  }

  //await admin.firestore().collection("contracts").doc(event.chainId.toString()).collection(event.chainId.toString()).doc(event.clonedContractsIndex).set(contract,{ merge: true });
  await admin.firestore().collection("contracts").doc(event.chainId.toString() + "_" + event.clonedContractsIndex).set(contract,{ merge: true });
}



// create a new Document in the DB for the votes
async function handleDisputeVoted(tx, event){

  // for now just 1 decentralized decision will be done by payzura team - when a custom number of voters is enabled, then change this!!!


  /* 
    const votes = await admin.firestore().collection(`moralis/txs/Payzura_factoryescrow`).doc(event.clonedContractsIndex).get().then((value) => {
      return value.data()['Votes']; // Access your after your get the data
    });
    console.log(votes);

    // update the votes
    if(event.returnFundsToBuyer){
      votes.push(true);
    } else {
      votes.push(false);
    }
  */

  const contract = {
    State: "complete",
    Votes: [event.returnFundsToBuyer],   // votes,
    Updated: new Date()
  }

  //await admin.firestore().collection("contracts").doc(event.chainId.toString()).collection(event.chainId.toString()).doc(event.clonedContractsIndex).set(contract,{ merge: true });
  await admin.firestore().collection("contracts").doc(event.chainId.toString() + "_" + event.clonedContractsIndex).set(contract,{ merge: true });
}

async function handleDisputeClosed(tx, event){
  const contract = {
    State: "complete",
    Updated: new Date()
  }

  //await admin.firestore().collection("contracts").doc(event.chainId.toString()).collection(event.chainId.toString()).doc(event.clonedContractsIndex).set(contract,{ merge: true });
  await admin.firestore().collection("contracts").doc(event.chainId.toString() + "_" + event.clonedContractsIndex).set(contract,{ merge: true });
}