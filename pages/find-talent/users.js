import React, { useState } from "react";
import { useQuery } from "react-query";
import axios from "axios";
import Select from 'react-select';
import UserItem from "../../components/find-talent/user-item";

export default function Users() {
  const [selectedOption, setSelectedOption] = useState(null);
  const [skillsOptions, setSkillsOptions] = useState([]);
  const [ratingOptions, setRatingOptions] = useState([]);
  
  const fetchAllUsers = async () => {
    const { data } = await axios.get("/api/get/AllUsers");
    return data;
  };

  const fetchAllReviews = async () => {
    const { data } = await axios.get("/api/get/AllReviews");
    return data;
  };

  const { data: users, isLoading } = useQuery("users", fetchAllUsers, {
    refetchOnWindowFocus: false,
  });

  const { data: reviews } = useQuery("reviews", fetchAllReviews, {
    refetchOnWindowFocus: false,
  });

  
  const usersWithReviews = users?.map(user => {
    const userReviews = reviews?.filter(review => review.name.JobSeller === user.name.userAddress)
    return {
      ...user,
      reviews: userReviews
    }
  })

  const verifiedUsers = usersWithReviews?.filter(user => user.name.userAddress)

  const options = [
    { value: 'most popular', label: 'Most Popular' },
    { value: 'newest', label: 'Newest' },
    { value: 'oldest', label: 'Oldest' },
  ]

  const handleChange = (selectedOption) => {
    setSelectedOption(selectedOption)
  }

  const sortUsers = (selectedOption) => {
    if(selectedOption?.value === 'most popular') {
      return verifiedUsers.sort((a, b) => {
        return b.reviews?.length - a.reviews?.length
      })
    } else if(selectedOption?.value === 'newest') {
      return verifiedUsers.sort((a, b) => {
        return new Date(b.name.userCreated) - new Date(a.name.userCreated)
      })
    } else if(selectedOption?.value === 'oldest') {
      return verifiedUsers.sort((a, b) => {
        return new Date(a.name.userCreated) - new Date(b.name.userCreated)
      })
    }
  }
  
  const sortedUsers = sortUsers(selectedOption)

  const filterSkills = (skillsOptions) => {
    return verifiedUsers?.filter(user => {
      return skillsOptions?.every(skill => user.name.userSkills?.includes(skill))
    })
  }

  const filteredUsers = filterSkills(skillsOptions)

  const filteredUsersWithAverageRating = filteredUsers?.map(user => {
    const userReviews = user.reviews
    const userRatings = userReviews?.map(review => review.name.Rating)
    const userRatingsAsNumbers = userRatings?.map(rating => Number(rating))
    const userAverageRating = userRatingsAsNumbers?.reduce((a, b) => a + b, 0) / userRatingsAsNumbers?.length
    if(isNaN(userAverageRating)) {
      return {
        ...user,
        averageRating: 0
      }
    } else {
      return {
        ...user,
        averageRating: userAverageRating
      }
    }
  })

  const filterRating = (ratingOptions) => {
    return filteredUsersWithAverageRating?.filter(user => {
      return user.averageRating >= ratingOptions
    })
  }
  const filteredUsersWithRating = filterRating(ratingOptions)

  if(users) {
    return (
      <div className="wrapper hasSidebar">
        <div className="sidebarFilters">
          <div className="sidebarHeader">Filters</div>
          <div className="filterBlock">
            <div className="filterBlockBody">
              <div className="categories">
                <h4>Reviews rated</h4>
                <ul>
                  <li>
                    <input 
                      type="radio" 
                      id="category2" 
                      name="category2" 
                      value="category2"
                      defaultChecked
                      onChange={() => setRatingOptions(0)}
                    />
                    <label htmlFor="category2">Any reviews rated</label><br />
                  </li>
                  <li>
                    <input 
                      type="radio" 
                      id="category2" 
                      name="category2" 
                      value="category2"
                      onChange={() => setRatingOptions(3)}
                    />
                    <label htmlFor="category2">3 & up</label><br />
                  </li>
                  <li>
                    <input 
                      type="radio" 
                      id="category2" 
                      name="category2" 
                      value="category2" 
                      onChange={() => setRatingOptions(5)}
                    />
                    <label htmlFor="category2">5 Only</label><br />
                  </li>
                </ul>
                <h4>Skills</h4>
                <ul>
                  <li>
                    <input 
                      type="checkbox" 
                      id="category3" 
                      name="category3" 
                      value="category3" 
                      onChange={
                        () => 
                          setSkillsOptions(prevState => {
                            if(prevState.includes('IT')) {
                              return prevState.filter(skill => skill !== 'IT')
                            } else {
                              return [...prevState, 'IT']
                            }
                          })  
                      }
                    />
                    <label htmlFor="category3">IT</label><br />
                  </li>
                  <li>
                    <input 
                      type="checkbox" 
                      id="category3" 
                      name="category3" 
                      value="category3" 
                      onChange={
                        () =>
                          setSkillsOptions(prevState => {
                            if(prevState.includes('Web Development')) {
                              return prevState.filter(skill => skill !== 'Web Development')
                            } else {
                              return [...prevState, 'Web Development']
                            }
                          })
                      }
                    />
                    <label htmlFor="category3">Web Development</label><br />
                  </li>
                <li>
                  <input
                    type="checkbox"
                    id="category3"
                    name="category3"
                    value="category3"
                    onChange={
                      () =>
                        setSkillsOptions(prevState => {
                          if(prevState.includes('Youtuber')) {
                            return prevState.filter(skill => skill !== 'Youtuber')
                          } else {
                            return [...prevState, 'Youtuber']
                          }
                        })
                    }
                  />
                  <label htmlFor="category3">Youtuber</label><br />
                </li>
                <li>
                  <input
                    type="checkbox"
                    id="category3"
                    name="category3"
                    value="category3"
                    onChange={
                      () =>
                        setSkillsOptions(prevState => {
                          if(prevState.includes('Twitter Promotion')) {
                            return prevState.filter(skill => skill !== 'Twitter Promotion')
                          } else {
                            return [...prevState, 'Twitter Promotion']
                          }
                        })
                    }
                  />
                  <label htmlFor="category3">Twitter Promotion</label><br />
                </li>
              </ul>
            </div>  
          </div>
          </div>
        </div>

        <div className="jobsSection">
          <div className="jobsHeader">
            <h4>{verifiedUsers.length} users available</h4>
            <div className="jobsHeaderRight">
              <div className="sortDropdown">
                <p>Sort by</p>
                <Select
                  defaultValue={options[2]}
                  onChange={handleChange}
                  options={options}
                  theme={(theme) => ({
                    ...theme,
                    borderRadius: 0,
                    colors: {
                      ...theme.colors,
                      primary25: "neutral40",
                      primary: "black",
                    },
                  })}
                  className="customDropdownControl"
                  classNamePrefix="customDropdownControl"
                />
              </div>
            </div>
          </div>
          
          <div className="jobs">
            {filteredUsersWithRating.map((item, index) => (
              <UserItem 
                key={index}
                item={item}
              />
            ))}
          </div>
        </div>
      </div>
    );
  } else {
    return <h1>Loading...</h1>
  }
}
