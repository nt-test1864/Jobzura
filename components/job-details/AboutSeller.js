import { useState } from 'react';
import axios from "axios";
import { useQuery } from "react-query";
import Image from 'next/image';
import makeBlockie from 'ethereum-blockies-base64';
import UserSelectedTimezon from "../../components/user-profile/user-timezone";
import { FaStar } from "react-icons/fa";
import Link from 'next/link';

const AboutSeller = (props) => {
  const { jobSellerAddress, currentAccount } = props;

  const fetchUserProfile = async (jobSellerAddress) => {
    const response = await axios.get(
      `/api/get/UserProfile?UserWallet=${jobSellerAddress}`
    );
    return response.data;
  };

  const fetchUserReviews = async (jobSellerAddress) => {
    const response = await axios.get(
      `/api/get/UserReviews?UserWallet=${jobSellerAddress}`
    );
    return response.data;
  };

  const getAllFetches = async (jobSellerAddress) => {
    const [userProfile, userReviews] = await Promise.all(
      [
        fetchUserProfile(jobSellerAddress),
        fetchUserReviews(jobSellerAddress),
      ]
    );
    return [userProfile, userReviews];
  };

  const { data } = useQuery(["AllUsersDetails", jobSellerAddress], () =>
    getAllFetches(jobSellerAddress)
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

  const userProfile = data && data[0];
  const userReviews = data && data[1];

  const jobSellerAddressTruncated = jobSellerAddress?.substring(0, 6) + "..." + jobSellerAddress?.substring(36, 42);

  let numberOfStars = 5;
  const stars = Array(numberOfStars).fill(0);

  const ratings = userReviews?.map((review) => {
    return review.name.Rating;
  });

  const fiveStar = ratings?.filter((rating) => {
    return rating === "5";
  }).length;

  const fourStar = ratings?.filter((rating) => {
    return rating === "4";
  }).length;

  const threeStar = ratings?.filter((rating) => {
    return rating === "3";
  }).length;

  const twoStar = ratings?.filter((rating) => {
    return rating === "2";
  }).length;

  const oneStar = ratings?.filter((rating) => {
    return rating === "1";
  }).length;

  const fiveStarRating = (fiveStar / ratings?.length) * 5;
  const fourStarRating = (fourStar / ratings?.length) * 4;
  const threeStarRating = (threeStar / ratings?.length) * 3;
  const twoStarRating = (twoStar / ratings?.length) * 2;
  const oneStarRating = (oneStar / ratings?.length) * 1;

  const totalRating = (
    fiveStarRating +
    fourStarRating +
    threeStarRating +
    twoStarRating +
    oneStarRating
  ).toFixed(1);

  if (5 <= totalRating && totalRating > 4.9) {
    numberOfStars = 5;
  } else if (4 <= totalRating && totalRating < 4.9) {
    numberOfStars = 4;
  } else if (3 <= totalRating && totalRating < 3.9) {
    numberOfStars = 3;
  } else if (2 <= totalRating && totalRating < 2.9) {
    numberOfStars = 2;
  } else if (1 <= totalRating && totalRating < 1.9) {
    numberOfStars = 1;
  } else {
    numberOfStars = 0;
  }

  console.log("userProfile", userProfile);

  if(data) {
    return (
      <div className='aboutContainer'>
        <div className='aboutSeller'>
          <div className='aboutSeller__header'>
            <div className='aboutSeller__header--left'>
              <div className="aboutSeller__header__image">
                {jobSellerAddress ? (
                  <Image
                    src={makeBlockie(jobSellerAddress)}
                    width="100"
                    height="100"
                    alt={jobSellerAddress}
                    style={{ borderRadius: "50%" }}
                    />
                ) : (
                  null
                )}
              </div>
              <div className='aboutSeller__header__details'>
                <h4>{jobSellerAddressTruncated}</h4>
                <h4>{userProfile[0]?.name.Headline}</h4>
                <UserSelectedTimezon
                  modelData={modelData}
                  setModelData={setModelData}
                  closeModelFn={closeModelDataHandler}
                  userProfile={userProfile}
                  currentAccount={currentAccount}
                  />
              </div>
            </div>
            <div className='aboutSeller__header--right'>
              <Link href={`/user/${jobSellerAddress}`}>
                <button>See profile</button>
              </Link>
            </div>
          </div>

          <div className='aboutSeller__description'>
            <p>
              {
                userProfile[0]?.name.Description?.slice(0, 200) + (userProfile[0]?.name.Description?.length > 200 ? "..." : "")
              }
            </p>
          </div>

          <div className='aboutSeller__skills'>
            <span>business</span>
            <span>web3</span>
            <span>seller</span>
          </div>

          <div className='aboutSeller_stats'>
            <div className='aboutSeller__reviews'>
              <div className="starsRatings">
                {stars.map((_, index) => {
                  return (
                    <FaStar
                      key={index}
                      size={18}
                      className={index < numberOfStars ? "activeStar" : "disableStar"}
                      style={{ marginRight: 5 }}
                      />
                    );
                })}
              </div>
              <div className="ratingCounts">
                {totalRating === "NaN" ? "No Ratings" : totalRating}
              </div>
              ({ratings?.length})
            </div>

            {/* <span>23 Orders</span>
            <span>$600k+ earned</span>
            <span>95% Job Success</span>
            <span>Top Rated</span> */}
          </div>
        </div>
      </div>
    )
  } else {
    return (
      <div>Loading...</div>
    )
  }
}

export default AboutSeller