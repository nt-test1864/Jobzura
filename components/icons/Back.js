function BackIc(props) {
  if (props.onClick) {
    return (
      <button onClick={props.onClick} className="linkButton" type="button">
        <svg
          viewBox="0 0 512 512"
          width={props.size}
          height={props.size}
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            fill={props.color}
            d="M353,450a15,15,0,0,1-10.61-4.39L157.5,260.71a15,15,0,0,1,0-21.21L342.39,54.6a15,15,0,1,1,21.22,21.21L189.32,250.1,363.61,424.39A15,15,0,0,1,353,450Z"
          />
        </svg>
      </button>
    );
  }

  return (
    <svg
      viewBox="0 0 512 512"
      width={props.size}
      height={props.size}
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        fill={props.color}
        d="M353,450a15,15,0,0,1-10.61-4.39L157.5,260.71a15,15,0,0,1,0-21.21L342.39,54.6a15,15,0,1,1,21.22,21.21L189.32,250.1,363.61,424.39A15,15,0,0,1,353,450Z"
      />
    </svg>
  );
}

export default BackIc;
