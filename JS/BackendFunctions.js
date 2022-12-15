


export function ParsePathGiveParameter(_url){

  const params = _url.split("?");
  if(params.length < 2){
    return -1;
  }

  const UserWallet = params[1].split("=");
  if(UserWallet.length < 2){
    return -1;
  }

  return UserWallet[1].split("&")[0];
}

export function ParsePathGiveMessageSender(_url){

  const params = _url.split("?");
  if(params.length < 2){
      return -1;
  }

  const UserWallet = params[1].split("=");
  if(UserWallet.length < 2){
      return -1;
  }

  return UserWallet[1].split("&")[0];
}

export function ParsePathGiveMessageReceiver(_url){

  const params = _url.split("?");
  if(params.length < 2){
      return -1;
  }

  const UserWallet = params[1].split("=");
  if(UserWallet.length < 3){
      return -1;
  }

  return UserWallet[2].split("&")[0];
}