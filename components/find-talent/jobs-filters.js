import { Fragment, useState } from "react";
import Button from "./../ui/Button";
import RadioGroup from "./../ui/RadioGroup";
import MultiRangeSlider from "./../ui/MultiRangeSlider";
import MobileMenuIc from "./../icons/MobileMenu";
import CloseIc from "./../icons/Close";
import { skills } from '../../data/skills'
import { useEffect, useRef } from 'react'
import { useRouter } from 'next/router'

function JobsFilters(props) {
  const {
    selectCurrency,
    setSelectCurrency,
    currencyOptionsValues,
    setFilterMinPrice,
    setFilterMaxPrice,
    maxPriceStatic
  } = props;

  const [showFilters, setShowFilters] = useState(false);
  const [filterCategories, setFilterCategories] = useState([...new Set(skills.map(skill => skill.category.toLowerCase()))])


  const router = useRouter()

  // check if user is coming from outside source and apply filters if they are valid
  const { skill, category } = router.query
  var selectedCategory = 'development'
  var skillArray = []
  if (category) {
    var applyCat = filterCategories.find(item => item.toLowerCase() === category.toLowerCase())
    if (applyCat) selectedCategory = applyCat.toLowerCase()
  }
  if (skill) {
    var applySkill = skills.find(item => item.skill.toLowerCase() === skill.toLowerCase())
    if (applySkill) skillArray.push(applySkill.skill.toLowerCase())
  }

  const [activeCategories, setActiveCategories] = useState(selectedCategory)
  const [activeSkills, setActiveSkills] = useState(skillArray)

  // listen to filter change, and send data to parent so we can filter real timež
  useEffect(() => {
    props.onCategoryChange(activeCategories);
    props.onSkillChange(activeSkills);
  }, [activeCategories, activeSkills]);

  function showMobileFiltersHandler() {
    setShowFilters(!showFilters);
  }

  function changeCategory(category, oldCategory) {
    if (category !== oldCategory) {
      setActiveSkills([])
    }
    setActiveCategories(category)
  }

  function removeUnmatchingCategories(skill) {
    activeSkills.includes(skill.skill.toLowerCase()) ?
      setActiveSkills(current => current.filter(existing => existing.toLowerCase() !== skill.skill.toLowerCase())) :
      setActiveSkills(current => [...current, skill.skill.toLowerCase()])
  }

  return (
    <Fragment>
      <div className="mobileFilterTrigger">
        <Button
          classes="button default withIcon"
          onClick={showMobileFiltersHandler}
        >
          <span>Show Filters</span>
          <i>
            <MobileMenuIc />
          </i>
        </Button>
      </div>

      <div className={`sidebarFilters ${showFilters ? "show" : ""}`}>
        <div className="filtersClose">
          <i>
            <CloseIc onClick={showMobileFiltersHandler} />
          </i>
        </div>

        <div className="sidebarHeader">Filters</div>
        <div className="filterBlock">
          <div className="filterBlockBody">
            <ul>
              {filterCategories.map(function (category, index) {
                return (
                  <li className={activeCategories === category.toLowerCase() ? "active" : ""} key={index}>
                    <Button
                      classes="button transparent capitalize fontBigger"
                      onClick={() => changeCategory(category.toLowerCase(), activeCategories)}>
                      {category}
                    </Button>
                    {skills.map(function (skill, index) {
                      if (skill.category.toLowerCase() !== category.toLowerCase()) return;
                      return activeCategories && activeCategories.toLowerCase() === skill.category.toLowerCase() ?
                        (
                          <div key={index}
                            className={activeSkills.includes(skill.skill.toLowerCase()) ? "active capitalize skillSet" : "capitalize skillSet"}
                            onClick={() => {
                              removeUnmatchingCategories(skill);
                              // activeSkills.includes(skill.skill.toLowerCase()) ?
                              //   setActiveSkills(current => current.filter(existing => existing.toLowerCase() !== skill.skill.toLowerCase())) :
                              //   setActiveSkills(current => [...current, skill.skill.toLowerCase()])
                            }}
                          >
                            {skill.skill}
                          </div>) : null
                    })}
                  </li>
                )
              })}

            </ul>
          </div>
        </div>


        {/* 
        <div className="filterBlock">
          <div className="filterBlockTitle">
            <h3>Price</h3>
          </div>
          <div className="filterBlockBody">
            <RadioGroup
              selectedRadio={selectCurrency}
              setSelectedRadio={setSelectCurrency}
              values={currencyOptionsValues}
            />
            <MultiRangeSlider
              min={0}
              max={maxPriceStatic}
              onChange={({ min, max }) => {
                setFilterMaxPrice(`${max}`), setFilterMinPrice(`${min}`);
              }}
            />
          </div>
        </div>
        */}

      </div>
    </Fragment>
  );
}

export default JobsFilters;
