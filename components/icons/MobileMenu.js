function MobileMenuIc(props) {
  if (props.onClick) {
    return (
      <button onClick={props.onClick} className="linkButton" type="button">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width={props.size}
          height={props.size}
          viewBox="0 0 384 256"
        >
          <path
            fill={props.color}
            d="M360,48H24C10.7,48,0,37.3,0,24S10.7,0,24,0h336c13.3,0,24,10.7,24,24S373.3,48,360,48z M360,152H24c-13.3,0-24-10.7-24-24s10.7-24,24-24h336c13.3,0,24,10.7,24,24S373.3,152,360,152z M360,256H24c-13.3,0-24-10.7-24-24s10.7-24,24-24h336c13.3,0,24,10.7,24,24S373.3,256,360,256z"
          />
        </svg>
      </button>
    );
  }

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={props.size}
      height={props.size}
      viewBox="0 0 384 256"
    >
      <path
        fill={props.color}
        d="M360,48H24C10.7,48,0,37.3,0,24S10.7,0,24,0h336c13.3,0,24,10.7,24,24S373.3,48,360,48z M360,152H24c-13.3,0-24-10.7-24-24s10.7-24,24-24h336c13.3,0,24,10.7,24,24S373.3,152,360,152z M360,256H24c-13.3,0-24-10.7-24-24s10.7-24,24-24h336c13.3,0,24,10.7,24,24S373.3,256,360,256z"
      />
    </svg>
  );
}

export default MobileMenuIc;
