import React, { useState } from "react";
import Select from "react-dropdown-select";
import { skills } from './../../data/skills';

function JobStep1(props) {
  const { selectedJobTitle, selectedJobCategory, selectedJobSubCategory, selectedJobDescription } = props;

  const [title, setTitle] = useState(selectedJobTitle);
  const [jobCategory, setJobCategory] = useState(selectedJobCategory);
  const [jobSubCategory, setJobSubCategory] = useState(selectedJobSubCategory);
  const [jobDescription, setJobDescription] = useState(selectedJobDescription);

  const jobAllCategories = [...new Set(skills.map(skill => skill.category))]
  const jobCategoryOptions = jobAllCategories.map(category => category);
  console.log("jobCategoryOptions", jobCategoryOptions);

  const jobAllSubCategories = [...new Set(skills.map(skill => skill.skill))]
  const jobSubCategoryOptions = jobAllSubCategories.map(subCategory => subCategory);
  console.log("jobSubCategoryOptions", jobSubCategoryOptions);

  // const jobCategoryOptions = [
  //   {
  //     label: "Category Item One",
  //     value: "Category Item One",
  //   },
  //   {
  //     label: "Category Item Two",
  //     value: "Category Item Two",
  //   },
  //   {
  //     label: "Category Item Three",
  //     value: "Category Item Three",
  //   },
  //   {
  //     label: "Category Item Four",
  //     value: "Category Item Four",
  //   },
  //   {
  //     label: "Category Item Five",
  //     value: "Category Item Five",
  //   },
  // ];

  // const jobSubCategoryOptions = [
  //   {
  //     label: "Sub Category Item One",
  //     value: "Sub Category Item One",
  //   },
  //   {
  //     label: "Sub Category Item Two",
  //     value: "Sub Category Item Two",
  //   },
  //   {
  //     label: "Sub Category Item Three",
  //     value: "Sub Category Item Three",
  //   },
  //   {
  //     label: "Sub Category Item Four",
  //     value: "Sub Category Item Four",
  //   },
  //   {
  //     label: "Sub Category Item Five",
  //     value: "Sub Category Item Five",
  //   },
  // ];

  return (
    <div>
      <div className="formRow">
        <div className="formCol">
          <h3>Job title</h3>
          <p>As your Gig storefront, your title is the most important place to include keywords that buyers would likely use to search for a service like yours.</p>
          <input
            type="text"
            value={title}
            placeholder="Enter a title"
            className="formControl"
            onChange={(e) => setTitle(e.target.value)}
          />
        </div>
      </div>

      <div className="formRow">
        <div className="formCol">
          <h3>Category</h3>
          <p>Choose the category and sub-category most suitable for your Gig.</p>
          <Select
            options={jobCategoryOptions}
            value={jobCategory}
            onChange={(opt) => setJobCategory(opt)}
          />
          <Select
            className="mt-15"
            options={jobSubCategoryOptions}
            values={jobSubCategory}
            onChange={(opt) => setJobSubCategory(opt)}
          />
        </div>
      </div>

      <div className="formRow">
        <div className="formCol">
          <h3>Description</h3>
          <p>Briefly Describe Your Gig.</p>
          <textarea
            rows="8"
            defaultValue={jobDescription}
            placeholder=""
            className="formControl textarea"
            onChange={(e) => setJobDescription(e.target.value)}
          />
        </div>
      </div>
    </div>
  );
}

export default JobStep1;
