import React, { Fragment, useState, useEffect } from "react";
import makeBlockie from "ethereum-blockies-base64";
import Image from "next/image";

import Button from "./../../components/ui/Button";
import UserLanguages from "../../components/user-profile/user-languages";
import UserSelectedTimezon from "../../components/user-profile/user-timezone";
import UserDescription from "../../components/user-profile/user-description";  //
import UserSkills from "../../components/user-profile/user-skills";
import AvailableJobs from "../../components/user-profile/available-jobs";
import UserHighlights from "../../components/user-profile/user-highlights";
import UserReviews from "../../components/user-profile/user-reviews";
import UserHeadline from "../../components/user-profile/user-headline";
import UserBio from "../../components/user-profile/user-bio";

import MessageIc from "./../../components/icons/Message";
import axios from "axios";
import { useRouter } from "next/router";
import { useQuery } from "react-query";
import { UpdateDelegates_Moralis } from "../../JS/local_web3_Moralis";
import UserName from "../../components/user-profile/user-name";

const DOMPurify = require("isomorphic-dompurify");
const Web3 = require("web3");

function UserDetails(props) {
  const { currentAccount } = props;
  const router = useRouter();
  const userAddress = router.query.userAddress;


  const fetchUserDetails = async (userAddress) => {
    const response = await axios.get(`/api/get/UserDetails?UserWallet=${userAddress}`);

    console.log("UserDetails:")
    console.log(response)

    return response.data;
  };
  


  const fetchUserProfile = async (userAddress) => {
    const response = await axios.get(`/api/get/UserProfile?UserWallet=${userAddress}`);
    //const response = await axios.get(`/api/V2-Firebase/get/UserProfile?UserWallet=${userAddress}`);
    
    console.log("UserProfile:")
    console.log(response)


    return response.data;
  };

  const fetchUserJobs = async (userAddress) => {
    //const response = await axios.get(`/api/get/UserJobs?UserWallet=${userAddress}`);
    const response = await axios.get(`/api/V2-Firebase/get/UserJobs?UserWallet=${userAddress}`);
    return response.data;
  };

  const fetchUserReviews = async (userAddress) => {
    const response = await axios.get(`/api/get/UserReviews?UserWallet=${userAddress}`);
    
    console.log("UserReviews:")
    console.log(response)


    return response.data;
  };

  const getAllFetches = async (userAddress) => {
    const [userProfile, userJobs, userReviews] = await Promise.all(
      [
        
        fetchUserProfile(userAddress),
        fetchUserJobs(userAddress),
        fetchUserReviews(userAddress),
        fetchUserDetails(userAddress),
      ]
    );
    return [userProfile, userJobs, userReviews];
  };

  const { data, isLoading } = useQuery(["AllUsersDetails", userAddress], () =>
    getAllFetches(userAddress)
  );

  const [modelData, setModelData] = useState({
    show: false,
    type: "alert",
    status: "Error",
    message: "",
  });

  function closeModelDataHandler() {
    setModelData({
      show: false,
    });
  }

  const lowerCaseAddress = currentAccount?.toLowerCase();
  const isCurrentUser = lowerCaseAddress === userAddress;

  
  const userProfile = data && data[0];
 // const userJobs = data && data[1];
  const userReviews = data && data[2];
  
  const userDetails = data && data[3];


  console.log("------------------------")
  console.log("DATA:")
  console.log(data);

  console.log("userProfile:")
  console.log(userProfile);

  console.log("userReviews:")
  console.log(userReviews)



  const [userJobs, setUserJobs] = useState([]);
  const [availableJobReload, setAvailableJobReload] = useState(0);
  useEffect(() => {
    if(userAddress!=undefined){
      const getUserJobs = async (userAddress) => {
        //const updatedUserJobs = await axios.get(`/api/get/UserJobs?UserWallet=${userAddress}`);
        const updatedUserJobs = await axios.get(`/api/V2-Firebase/get/UserJobs?UserWallet=${userAddress}`);

        setUserJobs(updatedUserJobs.data);
      };
      getUserJobs(userAddress);
    }
  }, [userAddress, availableJobReload]);



  console.log("---------------------------")
  console.log("userJobs:")
  console.log(userJobs)




  function UpdateDataHandler() {
    let counterVar = availableJobReload+1;
    setAvailableJobReload(counterVar)
  }


  if (data) {
    return (
      <div className="wrapper">
        <div className="profileHead">
          <div className="profileHeadLeft">
            <div className="userPic" id="profilePicture">
              <Image
                src={makeBlockie(userProfile[0]?.name.userAddress)}  //UserWallet
                width="92"
                height="92"
                alt={userProfile[0]?.name.userAddress}  //UserWallet
              />
            </div>

            <div className="userSort">
              <div className="nameAndBadge">
                <div className="userName">
                  <UserName 
                    userProfile={userProfile}
                    currentAccount={currentAccount}
                  />
                </div>
                <div className="userBadge">
                  <div className="badgeBlock">Top Rated</div>
                </div>
              </div>
              {/* */}
              <div className="userAddress">
                {userProfile[0].name.userAddress}
              </div> 

              <UserHeadline
                userProfile={userProfile}
                currentAccount={currentAccount}
              />

              <UserSelectedTimezon
                modelData={modelData}
                setModelData={setModelData}
                closeModelFn={closeModelDataHandler}
                userProfile={userProfile}
                currentAccount={currentAccount}
              />
            </div>
          </div>

          {isCurrentUser ? (
            <Fragment>
              {/* <h3>Edit your profile</h3>
                <div className="actionButton">
                  <Button classes="button dark withIcon">
                    <i>
                      <PencilIc />
                    </i>
                    <span>Edit Profile</span>
                  </Button>
                </div> */}
            </Fragment>
          ) : (
            <div className="profileHeadRight">
              <h3>Ask me anything</h3>
              <div className="actionButton">
                <Button
                  classes="button dark withIcon"
                  link={`/inbox/${userProfile[0]?.name.userAddress}`}   //UserWallet
                >
                  <i>
                    <MessageIc />
                  </i>
                  <span>Message</span>
                </Button>
              </div>
            </div>
          )}
        </div>

        <div className="profileDetails">
          
          {/* */}
          <UserHighlights userDetails={userDetails} userReviews={userReviews} />
          

          <UserBio userProfile={userProfile} currentAccount={currentAccount} />

          <UserLanguages
            modelData={modelData}
            setModelData={setModelData}
            closeModelFn={closeModelDataHandler}
            userProfile={userProfile}
            currentAccount={currentAccount}
          />

          <UserSkills
            closeModelFn={closeModelDataHandler}
            userProfile={userProfile}
            currentAccount={currentAccount}
          />

          <AvailableJobs currentAccount={currentAccount} userJobs={userJobs} updateDataFn={UpdateDataHandler} />

          <UserReviews
            currentAccount={currentAccount}
            userReviews={userReviews}
          />
        </div>
      </div>
    );
  } else {
    return <div>Loading...</div>;
  }
}

export default UserDetails;
