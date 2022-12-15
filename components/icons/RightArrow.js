function RightArrowIc(props) {
  if (props.onClick) {
    return (
      <button onClick={props.onClick} className="linkButton" type="button">
        <svg
          viewBox="0 0 8 12"
          width={props.size}
          height={props.size}
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            fill={props.color}
            d="M0.590027 10.59L5.17003 6L0.590026 1.41L2.00003 -6.16331e-08L8.00003 6L2.00003 12L0.590027 10.59Z"
          />
        </svg>
      </button>
    );
  }
  return (
    <svg
      viewBox="0 0 8 12"
      width={props.size}
      height={props.size}
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        fill={props.color}
        d="M0.590027 10.59L5.17003 6L0.590026 1.41L2.00003 -6.16331e-08L8.00003 6L2.00003 12L0.590027 10.59Z"
      />
    </svg>
  );
}

export default RightArrowIc;
