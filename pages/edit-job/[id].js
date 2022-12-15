import React, { Fragment, useState, useMemo } from "react";
import { useRouter } from "next/router";
import { useQuery } from "react-query";
import axios from "axios";
import JobForm from "../../components/jobs/job-form";

function EditJob(props) {
  const { currentAccount } = props;

  const router = useRouter();
  const jobID = router.query.id;

  const fetchJobDetails = async (jobID) => {
    const jobDetails = await axios.get(`/api/V2-Firebase/get/Job?JobID=${jobID}`);
    return jobDetails.data;
  };

  const { data, isLoading } = useQuery(["JobDetails", jobID], () =>
    fetchJobDetails(jobID)
  );

  const jobDetails = data;

  if (isLoading) {
    return <h1>Loading...</h1>;
  }

  return (
    <Fragment>
      <JobForm jobDetails={jobDetails} seller={currentAccount} />
    </Fragment>
  );
}

export default EditJob;