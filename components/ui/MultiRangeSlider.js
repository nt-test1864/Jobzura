import React, { useCallback, useEffect, useState, useRef } from "react";
import PropTypes from "prop-types";

const MultiRangeSlider = (props) => {
  const { min, max, onChange } = props;

  const [minVal, setMinVal] = useState(min);
  const [maxVal, setMaxVal] = useState(max);
  const range = useRef(null);

  const getPercent = useCallback(
    (value) => Math.round(((value - min) / (max - min)) * 100),
    [min, max]
  );

  const changeSliderMin = (e) => {
    if(parseFloat(e.target.value)<=maxVal && parseFloat(e.target.value)>=min){
        setMinVal(e.target.value);
    }else{
        e.target.value = minVal;
    }
  }
  const changeSliderMax = (e) => {
    if(parseFloat(e.target.value)>=minVal && parseFloat(e.target.value)<=max){
        setMaxVal(e.target.value);
    }else{
        e.target.value = maxVal;
    }
  }
  // Set width of the range to decrease from the left side
  useEffect(() => {
    const minPercent = getPercent(minVal);
    const maxPercent = getPercent(maxVal);

    if (range.current) {
      range.current.style.left = `${minPercent}%`;
      range.current.style.width = `${maxPercent - minPercent}%`;
    }
  }, [minVal, getPercent]);

  // Set width of the range to decrease from the right side
  useEffect(() => {
    const minPercent = getPercent(minVal);
    const maxPercent = getPercent(maxVal);

    if (range.current) {
      range.current.style.width = `${maxPercent - minPercent}%`;
    }
  }, [maxVal, getPercent]);

  // Get min and max values when their state changes
  useEffect(() => {
    onChange({ min: minVal, max: maxVal });
  }, [minVal, maxVal, onChange]);

  return (
    <div className="multiRangeContainer">
      <input
        type="range"
        min={min}
        max={max}
        value={minVal}
        onChange={(event) => {
          const value = Math.min(Number(event.target.value), maxVal - 0.5);
          setMinVal(value);
          // minValRef.current = value;
        }}
        className="thumb thumbLeft"
        style={{ zIndex: minVal > max - 100 && "5" }}
        step="1"
      />
      <input
        type="range"
        min={min}
        max={max}
        value={maxVal}
        onChange={(event) => {
          const value = Math.max(Number(event.target.value), minVal + 0.5);
          setMaxVal(value);
          // maxValRef.current.value = value;
        }}
        className="thumb thumbRight"
        step="1"
      />

      <div className="slider">
        <div className="sliderTrack" />
        <div ref={range} className="sliderRange" />
        <div className="sliderLeftValue"><input type="number" value={minVal} onChange={changeSliderMin} step="0.001" className="formControl" /></div> {/* ref={sliderMinRef}  ref={sliderMaxRef} */}
        <div className="sliderRightValue"><input type="number" value={maxVal} onChange={changeSliderMax} step="0.001" className="formControl" /></div>
      </div>
    </div>
  );
};

MultiRangeSlider.propTypes = {
  min: PropTypes.number.isRequired,
  max: PropTypes.number.isRequired,
  onChange: PropTypes.func.isRequired,
};

export default MultiRangeSlider;
