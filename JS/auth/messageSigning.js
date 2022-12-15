import { ethers } from "ethers";
import {lsGet} from './aliasWallet';

export async function SignMessage(message){
  try {
    console.log({ message });
    if (!window.ethereum)
      throw new Error("No crypto wallet found. Please install it.");

    await window.ethereum.send("eth_requestAccounts");
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();
    const signature = await signer.signMessage(message);
    const address = await signer.getAddress();

    return {
      message,
      signature,
      address
    };
  } catch (err) {
    console.log(err.message);
    return false;
  }
};

export async function SignMessageWithAlias(message){
  try {
    console.log({ message });
    if (!window.ethereum)
      throw new Error("No crypto wallet found. Please install it.");

    await window.ethereum.send("eth_requestAccounts");
    const provider = new ethers.providers.Web3Provider(window.ethereum);

    const orgAddress = await provider.getSigner().getAddress();
    console.log(`orgAddress: ${orgAddress}`);     

    // const aliases = JSON.parse(lsGet('aliases'));
    const aliases = lsGet('aliases');
    console.log(aliases);

    const privateKey = aliases[orgAddress];
    console.log(`private key: ${privateKey}`);
    console.log(privateKey);

    const signer = new ethers.Wallet(privateKey, provider);
    const signature = await signer.signMessage(message);
    const address = await signer.getAddress();

    return {
      message,
      signature,
      address
    };
  } catch (err) {
    console.log(err.message);
  }
};

export async function SignCustomMessage(alias){

  try {
    console.log({ alias });
    if (!window.ethereum)
      throw new Error("No crypto wallet found. Please install it.");

    await window.ethereum.send("eth_requestAccounts");
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();
    const address = await signer.getAddress();

    const domain = {};

    const types = {
      Mail: [
        { name: 'from', type: 'string' },
        { name: 'alias', type: 'string' },
      ]
    };
    
    // The data to sign
    const value = {
      from: address,
      alias: alias,
    };

    const signature = await signer._signTypedData(domain, types, value);

    return {
      alias,
      signature,
      address
    };
  } catch (err) {
    console.log(err.message);
  }
}

export function VerifyMessage(message, address, signature){ // async
  try {
    const signerAddr = ethers.utils.verifyMessage(message, signature); // await
    if (signerAddr !== address) {
      return false;
    }

    return true;
  } catch (err) {
    console.log(err);
    return false;
  }
};
