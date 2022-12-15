import { useEffect, useState } from "react";
import MultiTabsSeller from "./../../components/orders/MultiTabs-seller";

const Orders = (props) => {
  const { currentAccount } = props;
  const [agreements, setAgreements] = useState([]);

  const lowerCaseAddress = currentAccount.toLowerCase();

  async function getUserAgreementsFetch() {
    //const agreements = await fetch(`./../api/get/SellerAgreements?UserWallet=${lowerCaseAddress}`)
    const agreements = await fetch(`./../api/V2-Firebase/get/UserAgreementsSeller?UserWallet=${lowerCaseAddress}`)
      .then((res) => res.json())
      .then((json) => setAgreements(json)); 
    return agreements;
  }

  useEffect(() => {
    getUserAgreementsFetch();
  }, []);

  if(!currentAccount) {
    return null;
  }

  return <MultiTabsSeller agreements={agreements} />;
};

export default Orders;
