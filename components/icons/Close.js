function CloseIc(props) {
  if (props.onClick) {
    return (
      <button onClick={props.onClick} className="linkButton" type="button">
        <svg
          viewBox="0 0 24 24"
          width={props.size}
          height={props.size}
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            fill={props.color}
            d="M5.3,18.7C5.5,18.9,5.7,19,6,19s0.5-0.1,0.7-0.3l5.3-5.3l5.3,5.3c0.2,0.2,0.5,0.3,0.7,0.3s0.5-0.1,0.7-0.3   c0.4-0.4,0.4-1,0-1.4L13.4,12l5.3-5.3c0.4-0.4,0.4-1,0-1.4s-1-0.4-1.4,0L12,10.6L6.7,5.3c-0.4-0.4-1-0.4-1.4,0s-0.4,1,0,1.4   l5.3,5.3l-5.3,5.3C4.9,17.7,4.9,18.3,5.3,18.7z"
          />
        </svg>
      </button>
    );
  }

  return (
    <svg
      viewBox="0 0 24 24"
      width={props.size}
      height={props.size}
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        fill={props.color}
        d="M5.3,18.7C5.5,18.9,5.7,19,6,19s0.5-0.1,0.7-0.3l5.3-5.3l5.3,5.3c0.2,0.2,0.5,0.3,0.7,0.3s0.5-0.1,0.7-0.3   c0.4-0.4,0.4-1,0-1.4L13.4,12l5.3-5.3c0.4-0.4,0.4-1,0-1.4s-1-0.4-1.4,0L12,10.6L6.7,5.3c-0.4-0.4-1-0.4-1.4,0s-0.4,1,0,1.4   l5.3,5.3l-5.3,5.3C4.9,17.7,4.9,18.3,5.3,18.7z"
      />
    </svg>
  );
}

export default CloseIc;
