function OrdersIc(props) {
  if (props.onClick) {
    return (
      <button onClick={props.onClick} className="linkButton" type="button">
        <svg
          width={props.size}
          height={props.size}
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 23 24"
        >
          <rect fill={props.color} x="12" y="9" width="6" height="2" />
          <rect fill={props.color} x="8" y="9" width="2" height="2" />
          <rect fill={props.color} x="12" y="13" width="6" height="2" />
          <rect fill={props.color} x="8" y="13" width="2" height="2" />
          <rect fill={props.color} x="12" y="5" width="6" height="2" />
          <rect fill={props.color} x="8" y="5" width="2" height="2" />
          <path
            fill={props.color}
            d="M22,0H4C3.4,0,3,0.4,3,1v17H1c-0.6,0-1,0.4-1,1c0,2.8,2.2,5,5,5h13c2.8,0,5-2.2,5-5V1C23,0.4,22.6,0,22,0z M21,19 c0,1.7-1.3,3-3,3s-3-1.3-3-3c0-0.6-0.4-1-1-1H5V2h16V19z"
          />
        </svg>
      </button>
    );
  }
  return (
    <svg
      width={props.size}
      height={props.size}
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 23 24"
    >
      <rect fill={props.color} x="12" y="9" width="6" height="2" />
      <rect fill={props.color} x="8" y="9" width="2" height="2" />
      <rect fill={props.color} x="12" y="13" width="6" height="2" />
      <rect fill={props.color} x="8" y="13" width="2" height="2" />
      <rect fill={props.color} x="12" y="5" width="6" height="2" />
      <rect fill={props.color} x="8" y="5" width="2" height="2" />
      <path
        fill={props.color}
        d="M22,0H4C3.4,0,3,0.4,3,1v17H1c-0.6,0-1,0.4-1,1c0,2.8,2.2,5,5,5h13c2.8,0,5-2.2,5-5V1C23,0.4,22.6,0,22,0z M21,19 c0,1.7-1.3,3-3,3s-3-1.3-3-3c0-0.6-0.4-1-1-1H5V2h16V19z"
      />
    </svg>
  );
}

export default OrdersIc;
