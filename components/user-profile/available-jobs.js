import { Fragment } from "react";
import Button from "../ui/Button";
import JobItem from "./job-item";

function AvailableJobs(props) {
  const { userJobs, updateDataFn, currentAccount } = props;
  const lowerCaseAddress = currentAccount.toLowerCase();

  const url = window.location.href;
  const isOwnProfile = url.includes(currentAccount && lowerCaseAddress);
  console.log(isOwnProfile)


  return (
    <div className="publishGigs">
      <h3>Available Jobs</h3>

      <div className="gigsContainer">
        {userJobs?.length > 0 ? (
          <Fragment>
            {userJobs.map((item, index) => (
              <JobItem key={index} item={item} updateDataFn={updateDataFn} />
            ))}
          </Fragment>
        ) : (
          <div className="jobPlaceholder">
            {isOwnProfile ? (
              <> 
                <h3>You don&lsquo;t have any jobs.</h3>

                <Button link="/create-job" classes="button dark small">
                  Create Job
                </Button>
              </>
              ) : (
              <h3>This user doesn&lsquo;t have any jobs.</h3>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default AvailableJobs;
