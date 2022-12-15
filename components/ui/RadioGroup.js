function RadioGroup(props) {
  const { values, selectedRadio, setSelectedRadio } = props;

  setSelectedRadio('usdc')
  return (
    <div
      className={
        props.listItem === "radioList" ? "radioListMain" : "radioGroupMain"
      }
    >
      {values.map((item, index) => (
        <div key={index} className="radioItem">

          <input
            type="radio"
            className="radioInput"
            name={item.name}
            id={item.name + index}
            value={item.label}
            checked={'usdc' === item.value}
            readOnly={true}
          />
          <label className="radioLabel" htmlFor={item.name + index} style={{ maxWidth: '50%' }}>
            {item.label}
          </label>
        </div>
      ))}
    </div>
  );
}

export default RadioGroup;
