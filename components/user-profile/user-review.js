import { FaStar } from 'react-icons/fa'
import { AiOutlineLike, AiOutlineDislike, AiFillLike, AiFillDislike } from 'react-icons/ai'
import Link from 'next/link';
import Moment from "react-moment";
import makeBlockie from "ethereum-blockies-base64";
import Image from "next/image";
import { useState } from 'react'
import axios from 'axios';

const UserReview = (props) => {
  const { review, currentAccount } = props;

  const userWallet = currentAccount.toLowerCase(); //'0x2c5f037879eD7E0AC328531987b04a15620E8BFE'.toLowerCase();
  
  let LikesBy = review.name.LikesBy!==undefined&&review.name.LikesBy!==''?review.name.LikesBy.split(','):[];
  let DislikesBy = review.name.DislikesBy!==undefined&&review.name.DislikesBy!==''?review.name.DislikesBy.split(','):[];
  const [liked, setLiked] = useState(LikesBy.indexOf(userWallet)>=0);
  const [disliked, setDisliked] = useState(DislikesBy.indexOf(userWallet)>=0);
  const [likes, setLikes] = useState(review.name.Likes!==0?review.name.Likes:'');
  const [dislikes, setDislikes] = useState(review.name.Dislikes!==0?review.name.Dislikes:'');

  let num = 5;
  const stars = Array(num).fill(0)

  const buyerName = review.name.JobBuyer
  ? review.name.JobBuyer.slice(0, 5) + "..." + review.name.JobBuyer.slice(-4)
  : "";

  const rating = review.name.Rating;
  const content = review.name.Review;
  const date = review.name.createdAt;

  const updateUserReviewLikeDislike = async (reviewId,reviewStatus) => {
    var formData = new FormData();
    formData.append("UserWallet", userWallet);
    formData.append("review", reviewId);
    formData.append("status", reviewStatus);

    await axios
      .post("/api/general/updateReviewLikeDislike", formData)  
      .then((res) => {
        // if (res.status == 201 ) message.success("data successfully updated!");
        // this.fetchExtrashift();
      })
      .catch((err) => {
        // message.error("data profile failed to update ...");
      });
  };

  const likeReview = (objectId) => {
    liked = isNaN(liked)||liked==''?0:liked;
    disliked = isNaN(disliked)||disliked==''?0:disliked;
    if (liked) {
      setLiked(false);
      setLikes(likes-1);
    } else {
      setLiked(true);
      setLikes(likes + 1);
      if (disliked) {
        setDisliked(false);
        setDislikes(dislikes - 1);
      }
    }
    updateUserReviewLikeDislike(objectId, 'like');
    // updateLikeDislike();
  }

  const dislikeReview = (objectId) => {
    liked = isNaN(liked)||liked==''?0:liked;
    disliked = isNaN(disliked)||disliked==''?0:disliked;
    if (disliked) {
      setDisliked(false);
      setDislikes(dislikes - 1);

    } else {
      setDisliked(true);
      setDislikes(dislikes + 1);
      if (liked) {
        setLiked(false);
        setLikes(likes - 1);
      }
    }
    updateUserReviewLikeDislike(objectId, 'dislike');
    // updateLikeDislike();
  }

  return (
    <div className='reviewContainer'>
      <div className='reviewContainerHeader'>
        <div className='reviewContainerLeft'>
          <Image
            src={makeBlockie(review?.name.JobBuyer)}
            style={{
              borderRadius: '50%',
            }}
            width={50}
            height={50}
            alt={review?.name.JobBuyer}
          />
          <Link href={`/user/${review?.name.JobBuyer}`}>
            <h3 style={{ cursor: 'pointer' }}>
              {buyerName}
            </h3>
          </Link>
          <div className='ratingStars'>
            {stars.map((_, index) => {
              return (
                <FaStar
                  key={index}
                  size={16}
                  className={
                    index < `${rating}`
                      ? "activeStar"
                      : "disableStar"
                  }
                  style={{ marginRight: 5 }}
                />
              )
            })}
            <h3>{rating}</h3>
          </div>
        </div>
        <div className='reviewContainerRight'>
          <p>
            published <Moment fromNow>{date}</Moment>
          </p>
        </div>
      </div>

      <div className='reviewContent'>
        <p>{content}</p>
      </div>

      <div className='reviewQuestion'>
        <p>Was this review helpful?</p>
        <div className='reviewQuestionButtons'>
          {
            liked ? disliked ? (
              <>
                <AiFillLike
                  size={20}
                  className='starRattingIcon selected'
                  style={{ marginRight: 5 }}
                  />
                <p>{likes}</p>
              </>
            ) : (
              <>
                <AiFillLike
                  size={20}
                  className='starRattingIcon selected'
                  style={{ marginRight: 5, cursor: 'pointer' }}
                  onClick={() => likeReview(review?.name.objectId)}
                  />
                <p>{likes}</p>
              </>
            ) : disliked ? (
              <>
                <AiOutlineLike
                  size={20}
                  className='starRattingIcon'
                  style={{ marginRight: 5 }}
                />
                <p>{likes}</p>
              </>
            ) : (
              <>
                <AiOutlineLike
                  size={20}
                  className='starRattingIcon'
                  style={{ marginRight: 5, cursor: 'pointer' }}
                  onClick={() => likeReview(review?.name.objectId)}
                />
                <p>{likes}</p>
              </>
            )
          }
          {
            disliked ? liked ? (
              <>
                <AiFillDislike
                  size={20}
                  className='starRattingIcon selected'
                  style={{ marginRight: 5 }}
                />
                <p>{dislikes}</p>
              </>
            ) : (
              <>
                <AiFillDislike
                  size={20}
                  className='starRattingIcon selected'
                  style={{ marginRight: 5, cursor: 'pointer' }}
                  onClick={() => dislikeReview(review?.name.objectId)}
                />
                <p>{dislikes}</p>
              </>
            ) : liked ? (
              <>

                <AiOutlineDislike 
                  size={20}
                  className='starRattingIcon'
                  style={{ marginRight: 5 }}
                />
                <p>{dislikes}</p>
              </>
            ) : (
              <>
                <AiOutlineDislike
                  size={20}
                  className='starRattingIcon'
                  style={{ marginRight: 5, cursor: 'pointer' }}
                  onClick={() => dislikeReview(review?.name.objectId)}
                />
                <p>{dislikes}</p>
              </>
            )
          }
        </div>
      </div>
    </div>
  )
}

export default UserReview