import { Wallet } from '@ethersproject/wallet';

export function jsonParse(input, fallback ={}) {
  if (typeof input !== 'string') {
    return fallback;
  }
  try {
    return JSON.parse(input);
  } catch (err) {
    return fallback;
  }
}

// set local storage
export function lsSet(key, value) {
  return localStorage.setItem(`jobzura.${key}`, JSON.stringify(value));
}

// get local storage
export function lsGet(key, fallback = {}) {
  const item = localStorage.getItem(`jobzura.${key}`);

  //return item;
  return jsonParse(item, fallback);
}

// remove local storage
export function lsRemove(key) {
  return localStorage.removeItem(`jobzura.${key}`);
}


// check Alias
export function GetAlias(address){
  var aliases = lsGet('aliases');
  console.log(`lsGet aliases before setting`);
  console.log(aliases);

  console.log(aliases[address]);
  return aliases[address];
}

// remove Alias
export function RemoveAlias(address) {
  return lsRemove("aliases");   // note: this will remove all aliases
}


// set Alias
export function SetAlias(address){  // public original address
  /*
    const rndWallet = Wallet.createRandom();
    aliases.value = Object.assign(
      {
        [web3.value.account]: rndWallet.privateKey
      },
      aliases.value
    );
    lsSet('aliases', aliases.value);

    if (aliasWallet.value?.address) {
      await client.alias(auth.web3, web3.value.account, {
        alias: aliasWallet.value.address
      });
    }
    await checkAlias();
  */

  const rndWallet = Wallet.createRandom();
  console.log(`rndWallet:`);
  console.log(rndWallet);

  console.log(`rndWallet.address:`);
  console.log(rndWallet.address)

  var aliases = lsGet('aliases');
  console.log(`lsGet aliases before setting`);
  console.log(aliases);
  
  aliases = Object.assign(
    aliases,
    {
      [address]: rndWallet.privateKey,
    }
  );

  lsSet('aliases', aliases); 

  var aliases = lsGet('aliases');
  console.log(`lsGet aliases after setting`);
  console.log(aliases);

  //return rndWallet.privateKey;
  return {
    public: rndWallet.address,           
    private: rndWallet.privateKey
  };
}


