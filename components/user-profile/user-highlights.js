import { Fragment, useState } from "react";

import StarIc from "./../icons/Star";
import UserReview from "./user-review";
import { FaStar } from "react-icons/fa";

function UserHighlights(props) {
  const { userReviews } = props;

  let numberOfStars = 5;
  const stars = Array(numberOfStars).fill(0);

  const publicReviews = userReviews?.map((review, index) => {
    if (review.name.Private.includes("false")) {
      return <UserReview key={index} review={review} />;
    }
  });

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

  const filteredReviews = userReviews?.map((review) => {
    return review.name.Private;
  });

  const filteredReviewsWithoutPrivate = filteredReviews?.includes("true");

  return (
    <div className="userHighlights">
      <div className="userStarsAndReviews">
        <div className="userStars">
          <div className="startRattings">
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
          <div className="rattingCounts">
            {totalRating === "NaN" ? "No Ratings" : totalRating}
          </div>
        </div>
        <div className="userTotalReviews">
          (
          {filteredReviews?.length > 1
            ? `${
                filteredReviews?.length - filteredReviewsWithoutPrivate
              } Reviews`
            : `${
                filteredReviews?.length - filteredReviewsWithoutPrivate
              } Review`}
          )
        </div>
      </div>
      {/* <div className="userTotalOrders">23 Orders</div>
      <div className="userTotalEarned">$600k+ earned</div>
      <div className="userJobSuccessScore">90% Job Success</div> */}
    </div>
  );
}

export default UserHighlights;
