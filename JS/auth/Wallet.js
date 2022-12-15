import { ethers } from "ethers";

export async function GetConnectedAddress(){
  try {
    if (!window.ethereum)
      throw new Error("No crypto wallet found. Please install it.");

    await window.ethereum.send("eth_requestAccounts");
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();

    const address = await signer.getAddress();

    return address;
    
  } catch (err) {
    console.log(err.message);
  }
};