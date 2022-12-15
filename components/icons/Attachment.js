function AttachmentIc(props) {
  if (props.onClick) {
    return (
      <button onClick={props.onClick} className="linkButton" type="button">
        <svg
          viewBox="0 0 12 23"
          width={props.size}
          height={props.size}
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            fill={props.color}
            d="M10 5.5L10 17C10 19.21 8.21 21 6 21C3.79 21 2 19.21 2 17L2 4.5C2 3.12 3.12 2 4.5 2C5.88 2 7 3.12 7 4.5L7 15C7 15.55 6.55 16 6 16C5.45 16 5 15.55 5 15L5 5.5L3.5 5.5L3.5 15C3.5 16.38 4.62 17.5 6 17.5C7.38 17.5 8.5 16.38 8.5 15L8.5 4.5C8.5 2.29 6.71 0.5 4.5 0.5C2.29 0.5 0.499999 2.29 0.499999 4.5L0.5 17C0.5 20.04 2.96 22.5 6 22.5C9.04 22.5 11.5 20.04 11.5 17L11.5 5.5L10 5.5Z"
          />
        </svg>
      </button>
    );
  }

  return (
    <svg
      viewBox="0 0 12 23"
      width={props.size}
      height={props.size}
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        fill={props.color}
        d="M10 5.5L10 17C10 19.21 8.21 21 6 21C3.79 21 2 19.21 2 17L2 4.5C2 3.12 3.12 2 4.5 2C5.88 2 7 3.12 7 4.5L7 15C7 15.55 6.55 16 6 16C5.45 16 5 15.55 5 15L5 5.5L3.5 5.5L3.5 15C3.5 16.38 4.62 17.5 6 17.5C7.38 17.5 8.5 16.38 8.5 15L8.5 4.5C8.5 2.29 6.71 0.5 4.5 0.5C2.29 0.5 0.499999 2.29 0.499999 4.5L0.5 17C0.5 20.04 2.96 22.5 6 22.5C9.04 22.5 11.5 20.04 11.5 17L11.5 5.5L10 5.5Z"
      />
    </svg>
  );
}

export default AttachmentIc;
