import { useEffect, useState } from "react";
import JobsTabsSeller from "../../../components/jobs/JobsTabs-seller";
import { useQuery } from "react-query";
import axios from "axios";

const Orders = (props) => {
  const { currentAccount } = props;
  const lowerCaseAddress = currentAccount?.toLowerCase();

  const fetchUserJobs = async (userAddress) => {
    //const response = await axios.get(`./../api/get/UserJobs?UserWallet=${userAddress}`);
    const response = await axios.get(`./../api/V2-Firebase/get/UserJobs?UserJobs=${userAddress}`);
    return response.data;
  };

  const { data: agreements, isLoading } = useQuery(["GetAllJobsFromUser", lowerCaseAddress], () => fetchUserJobs(lowerCaseAddress));

  useEffect(() => {
    fetchUserJobs();
  }, []);

  if (!currentAccount) {
    return null;
  }

  if(isLoading) {
    return <div>Loading...</div>
  }

  return <JobsTabsSeller agreements={agreements} />;
};

export default Orders;
