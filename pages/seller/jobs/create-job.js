import React, { Fragment, useState, useMemo } from "react";
import JobForm from "../../../components/jobs/job-form";

const CreateJob = (props) => {
  const { currentAccount } = props;
  return (
    <Fragment>
      <JobForm seller={currentAccount} />
    </Fragment>
  );
};

export default CreateJob;
