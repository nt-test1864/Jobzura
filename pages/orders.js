import { useEffect, useState } from 'react';
import MultiTabs from '../components/orders/MultiTabs'

const Orders = (props) => {
  const { currentAccount } = props;
  const [agreements, setAgreements] = useState([]);

  const lowerCaseAddress = currentAccount.toLowerCase();

  async function getUserAgreementsFetch() {
    //const agreements = await fetch(`./api/get/BuyerAgreements?UserWallet=${lowerCaseAddress}`)
    const agreements = await fetch(`./../api/V2-Firebase/get/UserAgreementsBuyer?UserWallet=${lowerCaseAddress}`)
      .then((res) => res.json())
      .then((json) => setAgreements(json)); 
    return agreements;
  }

  useEffect(() => {
    getUserAgreementsFetch();
  }, []);

  if(!currentAccount){
    return null;
  }

  return <MultiTabs agreements={agreements} />
}

export default Orders