import middleware from '../../../middleware/middleware'
import nextConnect from 'next-connect'
const DOMPurify = require('isomorphic-dompurify');
import { AppendLikeAndDislikeToReview } from "../../../JS/DB-cloudFunctions"

const apiRoute = nextConnect()
apiRoute.use(middleware)


apiRoute.get(async (req, res) => { 
  const { ReviewID, Likes, Dislikes } = req.query;               // update the receiving of the data to the secure way using Alias key

  const reviewID = ReviewID;
  const likes = Likes;
  const dislikes = Dislikes;

  const review = await AppendLikeAndDislikeToReview(reviewID, likes, dislikes);

  res.json(review);
})

export const config = {
  api: {
    bodyParser: false
  }
} 
export default apiRoute

