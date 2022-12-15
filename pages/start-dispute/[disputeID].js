import { useRouter } from "next/router";
import { useQuery } from "react-query";
import { Fragment } from "react";
import axios from "axios";
import DisputeBox from "../../components/start-dispute/DisputeBox";
import Sidebar from "../../components/start-dispute/Sidebar";
import { BiArrowBack } from "react-icons/bi";
import Error from 'next/error'

function Dispute(props){   //

  const router = useRouter();
  const contractID = router.query.disputeID;

  const { currentAccount } = props;
  const lowerCaseAddress = currentAccount?.toLowerCase();

  /** 
  // displays the /start-dispute page only if there is a jobID in the URL
  useEffect(() => {
    if (router.asPath.indexOf("?") === -1) {
      router.push("/");
    }
  }, []);
  */

  const fetchContractDetails = async (contractID) => {
    // const contractDetails = await axios.get(`/api/get/Contract?contractID=${contractID}`);
    const contractDetails = await axios.get(`/api/V2-Firebase/get/Contract?contractID=${contractID}`);
    return contractDetails.data;
  }

  const { data: contractDetails, isLoading, isError } = useQuery(
    ["ContractDetails", contractID],
    () => fetchContractDetails(contractID),
    {
      refetchOnWindowFocus: false,
    }
  );


  if(isLoading) {
    return <h1>Loading...</h1>
  }


  if (contractDetails?.BuyerWallet?.stringValue !== lowerCaseAddress && contractDetails?.SellerWallet?.stringValue !== lowerCaseAddress && contractDetails?.Arbiters.stringValue !== lowerCaseAddress) {
    return <Error statusCode={404} /> 
  } else {
    return (
      <Fragment>
        <div className="topHeader">
          <div className="backButton" onClick={() => router.back()}>
            <BiArrowBack />
            <span>Back</span>
          </div>
        </div>
        <div className="container">
          <Sidebar contractDetails={contractDetails} />
          <DisputeBox currentAccount={currentAccount} contractDetails={contractDetails}/> {/*  */}
        </div>
      </Fragment>
    );
  }
};

export default Dispute;