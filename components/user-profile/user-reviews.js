import { useState, useEffect } from "react";
import UserReview from "./user-review";
import { FaStar } from "react-icons/fa";
import Select from "react-select";

const UserReviews = (props) => {
  const { userReviews, currentAccount } = props;
  const [selectedOption, setSelectedOption] = useState(null);

  let numberOfStars = 5;
  const stars = Array(numberOfStars).fill(0);

  const publicReviews = userReviews?.map((review, index) => {
    if (review.name.Private.includes("false")) {
      return (
        <UserReview
          key={index}
          review={review}
          currentAccount={currentAccount}
        />
      );
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

  const fiveStarPercentage = ((fiveStar / ratings?.length) * 100).toFixed(0);
  const fourStarPercentage = ((fourStar / ratings?.length) * 100).toFixed(0);
  const threeStarPercentage = ((threeStar / ratings?.length) * 100).toFixed(0);
  const twoStarPercentage = ((twoStar / ratings?.length) * 100).toFixed(0);
  const oneStarPercentage = ((oneStar / ratings?.length) * 100).toFixed(0);

  const options = [
    { value: "latest", label: "Latest" },
    { value: "oldest", label: "Oldest" },
    { value: "highest", label: "Highest Rating" },
  ];

  const handleChange = (selectedOption) => {
    setSelectedOption(selectedOption);
  };

  const [filterByRating, setFilterByRating] = useState("");
  const [filterPublicReviews, setFilterPublicReviews] = useState(publicReviews?.reverse());

  const sortReviews = (selectedOption) => {
    // if (selectedOption?.value === "latest") {
    //   return userReviews.sort((a, b) => {
    //     return new Date(a.name.createdAt) - new Date(b.name.createdAt);
    //   });
    // } else if (selectedOption?.value === "oldest") {
    //   return userReviews.sort((a, b) => {
    //     return new Date(b.name.createdAt) - new Date(a.name.createdAt);
    //   });
    // } else if (selectedOption?.value === "highest") {
    //   return userReviews.sort((a, b) => {
    //     return a.name.Rating - b.name.Rating;
    //   });
    // }
    if (selectedOption?.value === "latest") {
      return filterPublicReviews
        .sort((a, b) => {
          return (
            new Date(a.props.review.name.createdAt) -
            new Date(b.props.review.name.createdAt)
          );
        })
        .reverse();
    } else if (selectedOption?.value === "oldest") {
      return filterPublicReviews
        .sort((a, b) => {
          return (
            new Date(b.props.review.name.createdAt) -
            new Date(a.props.review.name.createdAt)
          );
        })
        .reverse();
    } else if (selectedOption?.value === "highest") {
      return filterPublicReviews
        .sort((a, b) => {
          return a.props.review.name.Rating - b.props.review.name.Rating;
        })
        .reverse();
    }
  };

  useEffect(() => {
    if (filterByRating !== "") {
      const filteredReview = publicReviews?.filter(item => item.props.review.name.Rating === filterByRating);
      setFilterPublicReviews([filteredReview]);
    }
  }, [filterByRating, userReviews]);

  function filterStartHandler(arg) {
    setFilterByRating(arg);
  }

  const sortedReviews = sortReviews(selectedOption);

  const filteredReviews = userReviews?.map((review) => {
    return review.name.Private;
  });

  const filteredReviewsWithoutPrivate = filteredReviews?.includes("true");

  return (
    <div className="reviews">
      <div className="reviewsHeader">
        <div className="rating">
          <div className="ratingTitle">
            <h1>
              {filteredReviews?.length > 1
                ? `${
                    filteredReviews?.length - filteredReviewsWithoutPrivate
                  } Reviews`
                : `${
                    filteredReviews?.length - filteredReviewsWithoutPrivate
                  } Review`}
            </h1>
          </div>
          <div className="ratingStars">
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
            <h3>{totalRating === "NaN" ? "No Ratings" : totalRating}</h3>
          </div>
        </div>

        <div className="sort">
          <p>Sort by</p>
          <Select
            defaultValue={options[0]}
            onChange={handleChange}
            options={options}
            className="customDropdownControl"
            classNamePrefix="customDropdownControl"
            theme={(theme) => ({
              ...theme,
              borderRadius: 0,
              colors: {
                ...theme.colors,
                primary25: "neutral40",
                primary: "black",
              },
            })}
          />
        </div>
      </div>

      {!userReviews?.length ? null : (
        <>
          <div className="reviewsSummary">
            <div
              className="reviewsSummaryRows"
              onClick={() => filterStartHandler("5")}
            >
              <span>5 stars</span>
              <div className="reviewsSummaryBar">
                <div
                  className="reviewsSummaryBarFill"
                  style={{ width: `${fiveStarPercentage}%` }}
                ></div>
              </div>
              <span>{fiveStarPercentage}%</span>
            </div>
            <div
              className="reviewsSummaryRows"
              onClick={() => filterStartHandler("4")}
            >
              <span>4 stars</span>
              <div className="reviewsSummaryBar">
                <div
                  className="reviewsSummaryBarFill"
                  style={{ width: `${fourStarPercentage}%` }}
                ></div>
              </div>
              <span>{fourStarPercentage}%</span>
            </div>
            <div
              className="reviewsSummaryRows"
              onClick={() => filterStartHandler("3")}
            >
              <span>3 stars</span>
              <div className="reviewsSummaryBar">
                <div
                  className="reviewsSummaryBarFill"
                  style={{ width: `${threeStarPercentage}%` }}
                ></div>
              </div>
              <span>{threeStarPercentage}%</span>
            </div>
            <div
              className="reviewsSummaryRows"
              onClick={() => filterStartHandler("2")}
            >
              <span>2 stars</span>
              <div className="reviewsSummaryBar">
                <div
                  className="reviewsSummaryBarFill"
                  style={{ width: `${twoStarPercentage}%` }}
                ></div>
              </div>
              <span>{twoStarPercentage}%</span>
            </div>
            <div
              className="reviewsSummaryRows"
              onClick={() => filterStartHandler("1")}
            >
              <span>1 star</span>
              <div className="reviewsSummaryBar">
                <div
                  className="reviewsSummaryBarFill"
                  style={{ width: `${oneStarPercentage}%` }}
                ></div>
              </div>
              <span>{oneStarPercentage}%</span>
            </div>
          </div>

          <div className="reviewsList">{filterPublicReviews}</div>
        </>
      )}
    </div>
  );
};

export default UserReviews;
