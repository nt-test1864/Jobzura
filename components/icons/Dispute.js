function DisputeIc(props) {
    if (props.onClick) {
        return (
            <button onClick={props.onClick} className="linkButton" type="button">
                <svg
                    viewBox="0 0 16 16"
                    width={props.size}
                    height={props.size}
                    xmlns="http://www.w3.org/2000/svg"
                >
                    <path
                        fill={props.color}
                        d="M14,0H2C0.895,0,0,0.895,0,2v9c0,1.105,0.895,2,2,2h2.057L2,16l6-3h6c1.105,0,2-0.895,2-2V2C16,0.895,15.105,0,14,0z M13,10  H3V9h10V10z M13,7H3V6h10V7z M13,4H3V3h10V4z"
                    />
                </svg>
            </button>
        );
    }

    return (
        <svg
            viewBox="0 0 16 16"
            width={props.size}
            height={props.size}
            xmlns="http://www.w3.org/2000/svg"
        >
            <path
                fill={props.color}
                d="M14,0H2C0.895,0,0,0.895,0,2v9c0,1.105,0.895,2,2,2h2.057L2,16l6-3h6c1.105,0,2-0.895,2-2V2C16,0.895,15.105,0,14,0z M13,10  H3V9h10V10z M13,7H3V6h10V7z M13,4H3V3h10V4z"
            />
        </svg>
    );
}

export default DisputeIc;
