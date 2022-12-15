import React, { useEffect, useState } from "react";
import { useQuery } from "react-query";
import axios from "axios";
import JobItem from "../../components/find-talent/job-item";
import Select from "react-select";
import JobsFilters from "../../components/find-talent/jobs-filters";

export default function Jobs() {
  const fetchAllJobs = async () => {
    const { data } = await axios.get("/api/V2-Firebase/get/AllJobs");
    //const { data } = await axios.get("/api/get/AllJobs");
    console.log("data:");
    return data;
  };

  const { data, isLoading } = useQuery("jobs", fetchAllJobs);

  const [filteredList, setFilteredList] = useState([]);
  const [selectedOption, setSelectedOption] = useState(null);
  const [selectCurrency, setSelectCurrency] = useState("All");
  const [filterMinPrice, setFilterMinPrice] = useState(0);
  const [filterMaxPrice, setFilterMaxPrice] = useState(10);
  const [filterCategories, setFilterCategories] = useState([])
  const [filterSkills, setFilterSkills] = useState([])

  const options = [
    { value: "latest", label: "Latest" },
    { value: "oldest", label: "Oldest" },
    { value: "priceDec", label: "Lowest Price" },
    { value: "priceInc", label: "Highest Price" },
  ];

  const currencyOptionsValues = [
    {
      name: "currencyOptions",
      label: "USDC",
      value: "usdc",
      availability: true,
    }
  ];

  const handleChange = (selectedOption) => {
    setSelectedOption(selectedOption);
  };

  const ethPrice = 1500;
  let maxPrice = 100;

  const parsePrice = (skill) => {
    if (skill && skill.name && skill.name.CurrencyTicker && skill.name.Price) {
      if (skill.name.CurrencyTicker === 'ETH') {
        return parseFloat(skill.name.Price * ethPrice)
      }
      return parseFloat(skill.name.Price)
    }
    return 0
  }

  useEffect(() => {
    if (filterSkills && filterSkills.length > 0) {
      var newJobs = data ? data.filter(item => filterSkills.includes(item.name.Skills) &&   // item.name.Skills[0]
        parsePrice(item) > filterMinPrice &&
        parsePrice(item) < filterMaxPrice) : null
      newJobs ? setFilteredList(newJobs) : null;
    } else {
      var newJobs = data ? data.filter(item =>
        parsePrice(item) > filterMinPrice &&
        parsePrice(item) < filterMaxPrice) : null
      newJobs ? setFilteredList(newJobs) : null;
    }

  }, [filterCategories, filterSkills, filterMinPrice, filterMaxPrice, selectCurrency]);

  const sortReviews = (selectedOption) => {
    if (selectedOption?.value === "latest") {
      return data.sort((a, b) => {
        return new Date(b.name.createdAt) - new Date(a.name.createdAt);
      });
    } else if (selectedOption?.value === "oldest") {
      return data.sort((a, b) => {
        return new Date(a.name.createdAt) - new Date(b.name.createdAt);
      });
    } else if (selectedOption?.value === "priceDec") {
      return data.sort((a, b) => {
        return a.name.Price - b.name.Price;
      });
    } else if (selectedOption?.value === "priceInc") {
      return data.sort((a, b) => {
        return b.name.Price - a.name.Price;
      });
    }
  };

  const sortedReviews = sortReviews(selectedOption);
  // console.log(Math.max.apply(Math,highestEthPriceArr), Math.max.apply(Math,highestUsdcPriceArr))

  if (data) {
    let highestPrice = [];
    data.forEach(item => {
      highestPrice.push(parsePrice(item))
    })
    maxPrice = highestPrice.length > 0 ? Math.max.apply(Math, highestPrice) : 100
  }

  if (isLoading) {
    return <h1>Loading...</h1>;
  }

  if (data) {
    return (
      <div className="wrapper hasSidebar">
        <JobsFilters
          data={data}
          selectCurrency={selectCurrency}
          setSelectCurrency={setSelectCurrency}
          currencyOptionsValues={currencyOptionsValues}
          filterMinPrice={filterMinPrice}
          setFilterMinPrice={setFilterMinPrice}
          setFilterMaxPrice={setFilterMaxPrice}
          onCategoryChange={setFilterCategories}
          onSkillChange={setFilterSkills}
          maxPriceStatic={maxPrice}
        />

        <div className="jobsSection">
          <div className="jobsHeader">
            <h4>{
              filteredList ? filteredList.length : data.length
            } jobs available overall</h4>
            <div className="jobsHeaderRight">
              <div className="sortDropdown">
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
          </div>

          <div className="jobs">
            {
              filteredList.map((item, index) => (
                <JobItem key={index} item={item} />
              ))
            }
          </div>
        </div>
      </div>
    );
  }
}
