import {ABI, ABI_ERC20} from "./ABI.js"
import {ethers, constants} from "ethers";
 
const MATIC_FactoryContractAddress = "0x3d0a266FCB593D269a7695DE773321beEC7Baeef"; //"0x1Fb8eAa22d939a86575BD51628eE73e7098ab053"; //"0xc19Bb169836a65dfC037cE8013bBCCB6fEe8a50E"; //"0xa340347579C4720C34880ee693Bb54E6eB063e3f"; //"0xda391ea358378B5a4C0D83A09B2A207371E2D843"; //"0x5231b92923c15439989742048fbF6D274cf415A0"; // "0xC580C23A982C11A3812920C51EDd104B2BB89B15"; // "0x6526447628924eea4F0578e812826f327F8d489B"; //"0x5Fc12E3eC96dd2F008DB5f32497cbAbefB049B60";   // 0x5D023afC16961d44E5fB3F29fe17fd54cE8D3487 - checked in
const BNB_FactoryContractAddress = "0x71CFE9D851744c89e7Ea14a304841BbA3B90A68A";
const commission = 0.01;
export const PayzuraCentealizedArbiter = "0x80038953cE1CdFCe7561Abb73216dE83F8baAEf0"; // Payzura Team/Platform address
const USDC_MATIC_ERC20_contractAddress = "0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174";
const USDC_BNB_ERC20_contractAddress = "0x8AC76a51cc950d9822D68b83fE1Ad97B32Cd580d";


// READ Functions

export async function clonedContractsIndex_Moralis(network) {
  const numberOfAgreements = await ReadOperation(network, "clonedContractsIndex");
  console.log("numberOfAgreements: " + numberOfAgreements);
  return numberOfAgreements;
}

export async function GetPrice_Moralis(network, index) {

  const params = [                                                                                                 // do we not need the price????
    index,
  ] 

  const price = await ReadOperation(network, "GetPrice", params); // will give an array with a hex value
  console.log("price: " + price);

  return price;
}

export async function GetAddress_Moralis(network, index) {

  const params = [                                                                                                 // do we not need the price????
    index,
  ]

  const address = await ReadOperation(network, "GetAddress", params);
  console.log("address: " + address);

  return address;
}

async function ReadOperation(network, method, params) {
  
  await HandleNetworkSwitch(network);
  UpdateConnectedAddrress();
  const { contract, provider } = await InitializeSmartContract(network);
  const message = await runTx(contract, method, params, 1, 1, 0);
  console.log(message);
  return message;
}





// WRITE Functions

export async function CreateEscrow_Moralis(network, isBuyer, userWallet, price, currencyTicker, referrerAddress, timeToDeliver, hashOfDescription, offerValidUntil, personalizedOffer, arbiters) {

  var personalizedOffer_parts = personalizedOffer.split(",");

  if(!personalizedOffer){
    personalizedOffer_parts = [];
  }

  var arbiters_parts = arbiters.split(",");

  if(!arbiters){
    arbiters_parts = [PayzuraCentealizedArbiter];
  }

  for (let i = 0; i < personalizedOffer_parts.length; i++){
    console.log("personalizedOffer_parts[i]: " + personalizedOffer_parts[i])
  }
  for (let i = 0; i < arbiters_parts.length; i++){
    console.log("arbiters_parts[i]: " + arbiters_parts[i])
  }

  // for ETH
  // const price_ = BigInt(10 ** 14) * BigInt((10 ** 4) * price);
  // for USDC
  // const price_ = BigInt((10 ** 6) * price);

  var price_;
  const numberOfDecimals = CurrencyTickerToDecimals(currencyTicker);

  // this approach is needed because we can only fit an integer
  if(numberOfDecimals <= 10){ 
    price_ = BigInt(Math.round((10 ** numberOfDecimals) * price));
  } else {
    price_ = BigInt(10 ** 10) * BigInt(Math.round((10 ** (numberOfDecimals - 10)) * price));
  }

  const tokenContractAddress = CurrencyTickerToAddress(currencyTicker, ConvertNetworkNameToChainID(network));  //contractOnNetwork)); // note for now we are forcing the use of polygon

  const params = [
    arbiters_parts,
    price_.toString(),
    tokenContractAddress,
    referrerAddress,
    timeToDeliver,
    hashOfDescription,
    offerValidUntil, 
    personalizedOffer_parts,
  ]

  console.log("isBuyer ", isBuyer);

  if(isBuyer && currencyTicker == "ETH") {
    return await WriteOperation__(network, "CreateEscrowBuyer", params, price_.toString());
  } else if(isBuyer){

    // check if seller has given the EscrowFactory approval for ERC20 transfer
    await ApproveERC20_UNLIMITED_Moralis(network, price_.toString(), userWallet);  // USDC on Matic hardcoded at the moment
    
    return await WriteOperation_(network, "CreateEscrowBuyer", params);
  }
  else {
    return await WriteOperation_(network, "CreateEscrowSeller", params);
  }
}

export async function AcceptOfferBuyer_Moralis(network, index, CurrencyTicker, userWallet) {

  // get the mint price
  var price = await GetPrice_Moralis(network, index); // will give an array with a hex value
  // price = BigInt(price);
  
  console.log("price: " + price);
  console.log("index: " + index);
  console.log("CurrencyTicker ", CurrencyTicker);
  
  const params = [                                                                                                 // do we not need the price????
    index,
  ] 

  // org - works fine with ethereum
  if (CurrencyTicker == "ETH"){
    return await WriteOperation__(network, "AcceptOfferBuyer", params, price); // for ETH
  } else {
    // check for the approval first 
    await ApproveERC20_UNLIMITED_Moralis(network, price, userWallet);

    return await WriteOperation__(network, "AcceptOfferBuyer", params, 0); // for USDC 
  }

  //return await WriteOperation_("AcceptOffer", params);
}

// new with referrals: (uint256 index, uint256 _referralCommision, address referrerAddress)
export async function AcceptOfferSeller_Moralis(network, index, referrerAddress) {

  const params = [                                                                                                 // do we not need the price????
    index,
    referrerAddress,
  ] 

  return await WriteOperation_(network, "AcceptOfferSeller", params);
}

export async function FundContract_Moralis(network, index) {

  const params = [                                                                                                    // do we not need the price????
    index,
  ]

  return await WriteOperation_(network, "FundContract", params);
}

export async function CancelSellerContract_Moralis(network, index) {

  const params = [                                                                                                    // do we not need the price????
    index,
  ]

  return await WriteOperation_(network, "CancelSellerContract", params);
}

export async function CancelBuyerContract_Moralis(network, index) {

  const params = [                                                                                                    // do we not need the price????
    index,
  ]

  return await WriteOperation_(network, "CancelBuyerContract", params);
}

export async function ReturnPayment_Moralis(network, index) {

  const params = [                                                                                                    // do we not need the price????
    index,
  ]

  return await WriteOperation__(network, "ReturnPayment", params);
}

export async function ClaimFunds_Moralis(network, index) {

  const params = [                                                                                                    // do we not need the price????
    index,
  ]

  return await WriteOperation__(network, "ClaimFunds", params);
}

export async function StartDispute_Moralis(network, index) {

  const params = [                                                                                                    // do we not need the price????
    index,
  ]

  return await WriteOperation__(network, "StartDispute", params);
}

export async function ConfirmDelivery_Moralis(network, index) {

  const params = [                                                                                                    // do we not need the price????
    index,
  ]

  return await WriteOperation__(network, "ConfirmDelivery", params);
}

export async function UpdateDelegates_Moralis(network, index, isBuyer, delegatesToAdd, delegatesToRemove){

  var delegatesToAdd_parts = delegatesToAdd.split(",");
  if(!delegatesToAdd){
    delegatesToAdd_parts = [];
  }

  var delegatesToRemove_parts = delegatesToRemove.split(",");
  if(!delegatesToRemove){
    delegatesToRemove_parts = [];
  }

  const params = [
    index,
    delegatesToAdd_parts,
    delegatesToRemove_parts,
  ]


  if(isBuyer){
    return await WriteOperation__(network, "UpdateBuyerDelegates", params);
  } else {
    return await WriteOperation__(network, "UpdateSellerDelegates", params);
  }
}

export async function UpdatePersonalizedOffer_Moralis(network, index, isBuyer, personalizedToAdd, personalizedToRemove){

  var personalizedToAdd_parts = personalizedToAdd.split(",");
  if(!personalizedToAdd){
    personalizedToAdd_parts = [];
  }

  var personalizedToRemove_parts = personalizedToRemove.split(",");
  if(!personalizedToRemove){
    personalizedToRemove_parts = [];
  }

  const params = [
    index,
    personalizedToAdd_parts,
    personalizedToRemove_parts,
  ]


  if(isBuyer){
    return await WriteOperation__(network, "UpdateBuyerPersonalizedOffer", params);
  } else {
    return await WriteOperation__(network, "UpdateSellerPersonalizedOffer", params);
  }
}

export async function HandleDispute_Moralis(network, index, returnFundsToBuyer) {

  const params = [
    index,
    returnFundsToBuyer,
  ]

  console.log(params);

  return await WriteOperation__(network, "HandleDispute", params);                                                          // possible add 'return'  
}




async function WriteOperation(network, method) {
  return await WriteOperation_(network, method, {});
}
  
async function WriteOperation_(network, method, params) {
  return await WriteOperation__(network, method, params, 0);
}
  
async function WriteOperation__(network, method, params, value) {

  console.log("value/price: " + value)
  console.log("method: " + method);
  console.log("params: " + JSON.stringify(params));

  await HandleNetworkSwitch(network); 
  UpdateConnectedAddrress();
  const { contract, provider } = await InitializeSmartContract(network);

  let e;
  try {
    // e = await contract.estimateGas.cancelListing(nftAddress, tokenId);
    // e = await contract.estimateGas[method](params);
    console.log("prior estimate gas")
    //e = await runEstimateGas(contract, method, params);
    console.log("after estimate gas");
  } catch (u) {
    console.log("error: ", u);
    return { success: false, type: "estimategas" };
  }
  let d = await provider.getGasPrice();
  let transaction;
  let tx;
  try {

    console.log("prior tx")
    /*
    transaction = await contract[method](params, {
      gasLimit: parseInt(e),
      gasPrice: parseInt(1.2 * d),
      value: value,
      maxFeePerGas: null,
    });
    */

    transaction = await runTx(contract, method, params, 1, 1, value);

    console.log("after tx")
    tx = await transaction.wait();
    console.log("transaction:", transaction)
    console.log("tx: ", tx);
  } catch (u) {
    return { success: false, tx: tx };
  }

  if (tx.status == 1) {
    return { success: true, tx: tx };
  } else {
    return { success: false, tx: tx };
  }

}


async function runEstimateGas(contract, method, params){

  switch (params.length) {
    case 1:
      return await contract.estimateGas[method](params[0]);

    case 2:
      return await contract.estimateGas[method](params[0], params[1]);

    case 3:
      return await contract.estimateGas[method](params[0], params[1], params[2]);

    case 4:
      return await contract.estimateGas[method](params[0], params[1], params[2], params[3]);

    case 5:
      return await contract.estimateGas[method](params[0], params[1], params[2], params[3], params[4]);

    case 6:
      return await contract.estimateGas[method](params[0], params[1], params[2], params[3], params[4], params[5]);

    case 7:
      return await contract.estimateGas[method](params[0], params[1], params[2], params[3], params[4], params[5], params[6]);

    case 8:
      return await contract.estimateGas[method](params[0], params[1], params[2], params[3], params[4], params[5], params[6], params[7]);

    default:
      console.log("param length: " + params.length)
      console.log("add more options to: runEstimateGas")
  }
}

async function runTx(contract, method, params, e, d, value){

  console.log("param length: " + params.length)
  console.log("params: ")
  console.log(params)
  console.log("params[0]: " + params[0])
  console.log("params[1]: " + params[1])

  console.log("method: " + method)

  ///return await contract[method](params[0],{});

  switch (params.length) {
    case 1:
      return await contract[method](params[0], {
        //gasLimit: parseInt(e),
        //gasPrice: parseInt(1.2 * d),
        value: value,
        //maxFeePerGas: null,
      });

    case 2:
      return await contract[method](params[0], params[1], {
        //gasLimit: parseInt(e),
        //gasPrice: parseInt(1.2 * d),
        value: value,
        //maxFeePerGas: null,
      });

    case 3:
      return await contract[method](params[0], params[1], params[2], {
        //gasLimit: parseInt(e),
        //gasPrice: parseInt(1.2 * d),
        value: value,
        //maxFeePerGas: null,
      });

    case 4:
      return await contract[method](params[0], params[1], params[2], params[3], {
        //gasLimit: parseInt(e),
        //gasPrice: parseInt(1.2 * d),
        value: value,
        //maxFeePerGas: null,
      });

    case 5:
      return await contract[method](params[0], params[1], params[2], params[3], params[4], {
        //gasLimit: parseInt(e),
        //gasPrice: parseInt(1.2 * d),
        value: value,
        //maxFeePerGas: null,
      });

    case 6:
      return await contract[method](params[0], params[1], params[2], params[3], params[4], params[5], {
        //gasLimit: parseInt(e),
        //gasPrice: parseInt(1.2 * d),
        value: value,
        //maxFeePerGas: null,
      });

    case 7:
      return await contract[method](params[0], params[1], params[2], params[3], params[4], params[5], params[6], {
        //gasLimit: parseInt(e),
        //gasPrice: parseInt(1.2 * d),
        value: value,
        //maxFeePerGas: null,
      });

    case 8:
      /*
      return await contract[method](params[0], params[1], params[2], params[3], params[4], params[5], params[6], params[7], {
        gasLimit: parseInt(e),
        gasPrice: parseInt(1.2 * d),
        value: value,
        maxFeePerGas: null,
      });
      */

      return await contract[method](params[0], params[1], params[2], params[3], params[4], params[5], params[6], params[7], {
        value: value,
      });

    default:
      console.log("param length: " + params.length)
      console.log("add more options to: runTx")
  }
}






// approve the FactoryEscrow contract - the exact amount - should not be used
export async function ApproveERC20_Moralis(network, index){

  console.log("index: " + index);
  var price = await GetPrice_Moralis(network, index); // will give an array with a hex value
  price = BigInt(price);
  console.log("price: " + price);

  return ERC20_Approval(network, price);
}

// approve the FactoryEscrow contract - check if allowance is enough, if not approve unlimited amount
export async function ApproveERC20_UNLIMITED_Moralis(network, price, userWallet){

  // check if allowance is enough
  console.log("userWallet", userWallet);
  console.log(userWallet);
  const ret = await Check_ERC20_Approval_Moralis(network, price, userWallet);
  console.log(ret); // true/false

  if(ret){
    console.log("allowance is enough");
    return true;
  }
  console.log("allowance is not enough");

  return ERC20_Approval(network, constants.MaxInt256);
}

async function ERC20_Approval(network, price){

  await HandleNetworkSwitch(network); 
  UpdateConnectedAddrress();
  const { contract, provider } = await InitializeSmartContract(network, "USDC", ABI_ERC20);
  
  const params = [
    GetFactoryContractAddress(network),
    price,
  ]

  let e;
  try {
    // e = await contract.estimateGas.cancelListing(nftAddress, tokenId);
    // e = await contract.estimateGas[method](params);
    console.log("prior estimate gas")
    //e = await runEstimateGas(contract, method, params);
    console.log("after estimate gas");
  } catch (u) {
    console.log("error: ", u);
    return { success: false, type: "estimategas" };
  }
  let d = await provider.getGasPrice();
  let transaction;
  let tx;
  try {

    console.log("prior tx")
    /*
      transaction = await contract[method](params, {
        gasLimit: parseInt(e),
        gasPrice: parseInt(1.2 * d),
        value: value,
        maxFeePerGas: null,
      });
    */

    transaction = await runTx(contract, "approve", params, 1, 1, 0);

    console.log("after tx")
    tx = await transaction.wait();
    console.log("transaction:", transaction)
    console.log("tx: ", tx);
  } catch (u) {
    return { success: false, tx: tx };
  }

  if (tx.status == 1) {
    //return { success: true, tx: tx };
    return transaction.hash;
  } else {
    return { success: false, tx: tx };
  }
}

// approve the FactoryEscrow contract
export async function Check_ERC20_Approval_Moralis(network, price, userWallet){

  const params = [
    userWallet,
    GetFactoryContractAddress(network), // contract address of this instance              // ORG: for the instance of escrow contract  
  ]

  await HandleNetworkSwitch(network); 
  UpdateConnectedAddrress();
  const { contract, provider } = await InitializeSmartContract(network, "USDC", ABI_ERC20);
  const message = await runTx(contract, "allowance", params, 1, 1, 0);
  const allowance = parseInt(message._hex, 16)

  console.log("allowance:");
  console.log(allowance);

  price = BigInt(price);
  console.log("price: ", price);

  return (allowance < price) ? false : true;
}







// AUX Functions
export async function GetWallet_NonMoralis(){
  if (window.ethereum) {
    try {
      const connectedAddress = await window.ethereum.request({ method: 'eth_requestAccounts' });
      console.log("connectedAddress: " + connectedAddress)
      return connectedAddress
    } catch (error) {
      if (error.code === 4001) {
        // User rejected request
        console.log('user denied request');
      }
      console.log('error: ' + error);
    }
  }
}

export function GetChainID_NonMoralis(){
  if (window.ethereum) {
    try {
      console.log("window.ethereum.networkVersion: " + window.ethereum.networkVersion)
      return window.ethereum.networkVersion
    } catch (error) {
      if (error.code === 4001) {
        console.log('something went wrong');
      }
      console.log('error: ' + error);
    }
  }
}

export function CurrencyTickerToDecimals(currencyTicker){

  // test only
  console.log("test:")
  console.log("chain id: " + GetChainID_NonMoralis());

  switch(currencyTicker){
  
    case "USDC":
      return 6;

    case "ETH":
    default:
      return 18;
  }
}


// should be recoded in the future in better way
export function CurrencyTickerToAddress(currencyTicker, chainId){

  switch(chainId){

    // mainnet
    case 1: 

      switch(currencyTicker){

        case "USDC":
          return "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48";

        case "ETH":
        default:
          return "0x0000000000000000000000000000000000000000"; 
      }

    // polygon
    default:
    case 137:
        
      switch(currencyTicker){

        case "USDC":
          return "0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174";

        case "ETH":
        default:
          return "0x0000000000000000000000000000000000000000"; 
      }
  }
}

async function InitializeSmartContract(network, _token = "native", _ABI = ABI) { 

  var _contractAddress;
  if(_token == "native") {
    _contractAddress = GetFactoryContractAddress(network);
  } else {
    _contractAddress = GetTokenContractAddress(network, _token);
  }

  console.log("_contractAddress:")
  console.log(_contractAddress)



  try {
    const { ethereum } = window;
    if (ethereum) {
      const provider = new ethers.providers.Web3Provider(ethereum);
      const signer = provider.getSigner();
      const contract = new ethers.Contract(
        _contractAddress,
        _ABI,
        signer
      );
      return { contract, provider };
    }
  } catch (err) {
    console.log(err);
  }
  return {contract: null, provider: null}
}

async function UpdateConnectedAddrress() {
  if (window.ethereum) {
    try {
      const connectedAddress = await window.ethereum.request({
        method: "eth_requestAccounts",
      });
      console.log("action performed by account: " + connectedAddress);
    } catch (error) {
      if (error.code === 4001) {
        // User rejected request
        console.log("user denied request");
      }
      console.log("error: " + error);
    }
  }
}

export async function HandleNetworkSwitch(networkName) {

  if(networkName == "MATIC"){
    networkName = "polygon";
  } else if(networkName == "BNB"){
    networkName = "bsc";
  } else if (networkName == "ETH"){
    networkName = "homestead";
  }

  try {
    if (!window.ethereum) throw new Error("No crypto wallet found");

    if (window.ethereum.networkVersion !== ConvertNetworkNameToChainID(networkName)) {

      try {
        await window.ethereum.request({
          method: 'wallet_switchEthereumChain',
          params: [{ chainId: "0x" + (ConvertNetworkNameToChainID(networkName)).toString(16) }]
        });

      } catch (err) {
        // This error code indicates that the chain has not been added to MetaMask
        if (err.code === 4902) {
          await window.ethereum.request({
            method: 'wallet_addEthereumChain',
            params: [
            {
              ...networks[networkName]
            }]
          });
        }
      }
    }
  } catch (err) {
    console.log(err.message);
  }
}
  
export function ConvertNetworkNameToChainID(networkName){
  
  switch (networkName) {
    case "homestead":
      return 1;

    case "ropsten":
      return 3;

    case "rinkeby":
      return 4;

    case "goerli":
      return 5;

    case "kovan":
      return 42;

    case "polygon":
      return 137;

    case "mumbai":
      return 80001;

    case "bsc":
      return 56;

    case "bsct":
      return 97;

    default:
      break;
  }
}

function GetFactoryContractAddress(network){
  var FactoryContractAddress;
  if(network == "bsc" || network == "BNB"){
    FactoryContractAddress = BNB_FactoryContractAddress;
  } else { // MATIC for now
    FactoryContractAddress = MATIC_FactoryContractAddress;
  }

  return FactoryContractAddress;
}

// support USDC only for now, but have it prepared to add other tokens for each chain
function GetTokenContractAddress(network, tokenName){

  var TokenContractAddress;

  if(tokenName == "usdc"  || tokenName == "USDC"){

    if(network == "bsc" || network == "BNB"){
      TokenContractAddress = USDC_BNB_ERC20_contractAddress;
    } else { // MATIC for now
      TokenContractAddress = USDC_MATIC_ERC20_contractAddress;
    }

  }

  return TokenContractAddress;
}

  
const networks = {

  homestead: {
    chainId: `0x${Number(1).toString(16)}`,
    chainName: "Ethereum Mainnet",
    nativeCurrency: {
    name: "Ether",
    symbol: "ETH",
    decimals: 18
    },
    rpcUrls: ["https://api.mycryptoapi.com/eth/"],
    blockExplorerUrls: ["https://etherscan.io/"]
  },
  ropsten: {
    chainId: `0x${Number(3).toString(16)}`,
    chainName: "Test Network Ropsten",
    nativeCurrency: {
    name: "Ether",
    symbol: "ETH",
    decimals: 18
    },
    rpcUrls: ["https://ropsten.infura.io/v3/"],
    blockExplorerUrls: ["https://ropsten.etherscan.io/"]
  },
  rinkeby: {
    chainId: `0x${Number(4).toString(16)}`,
    chainName: "Test Network Rinkeby",
    nativeCurrency: {
    name: "Ether",
    symbol: "ETH",
    decimals: 18
    },
    rpcUrls: ["https://rinkeby.infura.io/v3/"],
    blockExplorerUrls: ["https://rinkeby.etherscan.io/"]
  },
  goerli: {
    chainId: `0x${Number(5).toString(16)}`,
    chainName: "Test Network Goerli",
    nativeCurrency: {
    name: "Ether",
    symbol: "ETH",
    decimals: 18
    },
    rpcUrls: ["https://goerli.infura.io/v3/"],
    blockExplorerUrls: ["https://goerli.etherscan.io/"]
  },
  kovan: {
    chainId: `0x${Number(42).toString(16)}`,
    chainName: "Test Network Kovan",
    nativeCurrency: {
    name: "Ether",
    symbol: "ETH",
    decimals: 18
    },
    rpcUrls: ["https://kovan.infura.io/v3/"],
    blockExplorerUrls: ["https://kovan.etherscan.io/"]
  },
  bsct: {
    chainId: `0x${Number(97).toString(16)}`,
    chainName: "Binance Smart Chain Testnet",
    nativeCurrency: {
    name: "BNB",
    symbol: "BNB",
    decimals: 18
    },
    rpcUrls: ["https://data-seed-prebsc-1-s1.binance.org:8545/"],
    blockExplorerUrls: ["https://testnet.bscscan.com/"]
  },
  polygon: {
    chainId: `0x${Number(137).toString(16)}`,
    chainName: "Polygon Mainnet",
    nativeCurrency: {
    name: "MATIC",
    symbol: "MATIC",
    decimals: 18
    },
    rpcUrls: ["https://polygon-rpc.com/"],
    blockExplorerUrls: ["https://polygonscan.com/"]
  },
  polygon_Mumbai: {
    chainId: `0x${Number(80001).toString(16)}`,
    chainName: "Mumbai",
    nativeCurrency: {
    name: "MATIC",
    symbol: "MATIC",
    decimals: 18
    },
    rpcUrls: ["https://matic-mumbai.chainstacklabs.com/"],
    blockExplorerUrls: ["https://mumbai.polygonscan.com/"]
  },
  bsc: {
    chainId: `0x${Number(56).toString(16)}`,
    chainName: "Binance Smart Chain Mainnet",
    nativeCurrency: {
    name: "Binance Chain Native Token",
    symbol: "BNB",
    decimals: 18
    },
    rpcUrls: [
    "https://bsc-dataseed1.binance.org",
    "https://bsc-dataseed2.binance.org",
    "https://bsc-dataseed3.binance.org",
    "https://bsc-dataseed4.binance.org",
    "https://bsc-dataseed1.defibit.io",
    "https://bsc-dataseed2.defibit.io",
    "https://bsc-dataseed3.defibit.io",
    "https://bsc-dataseed4.defibit.io",
    "https://bsc-dataseed1.ninicoin.io",
    "https://bsc-dataseed2.ninicoin.io",
    "https://bsc-dataseed3.ninicoin.io",
    "https://bsc-dataseed4.ninicoin.io",
    "wss://bsc-ws-node.nariox.org"
    ],
    blockExplorerUrls: ["https://bscscan.com"]
  }
};