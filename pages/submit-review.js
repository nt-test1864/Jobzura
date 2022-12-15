import { useRouter } from "next/router";
import { Fragment } from "react";
import { useEffect } from "react";
import SubmitReview from "../components/submit-review/SubmitReview";

const Review = (props) => {
  const { currentAccount } = props;
  const router = useRouter();
  const lowerCaseAccount = currentAccount.toLowerCase();

  // displays the /submit-review page only if there is a jobID in the URL
  useEffect(() => {
    if (router.asPath.indexOf("?") === -1) {
      router.push("/");
    }
  }, []);

  return (
    <Fragment>
      {/* <div className="top-nav">
        <div className="wrapper">
          <span className="headerCount">1</span>
          <h3>Writing a review</h3>
        </div>
      </div> */}

      <SubmitReview currentAccount={lowerCaseAccount} />
    </Fragment>
  );
};

export default Review;
