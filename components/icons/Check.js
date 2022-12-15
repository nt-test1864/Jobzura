function CheckIc(props) {
    if (props.onClick) {
        return (
            <button onClick={props.onClick} className="linkButton" type="button">
                <svg
                    viewBox="0 0 20 14"
                    width={props.size}
                    height={props.size}
                    xmlns="http://www.w3.org/2000/svg"
                >
                    <path
                        fill={props.color}
                        d="M7.090,13.690 L1.229,7.604 C0.877,7.238 0.877,6.645 1.229,6.280 L2.504,4.955 C2.856,4.590 3.427,4.590 3.779,4.955 L7.728,9.055 L16.185,0.274 C16.538,-0.091 17.108,-0.091 17.461,0.274 L18.736,1.598 C19.088,1.964 19.088,2.557 18.736,2.922 L8.366,13.690 C8.013,14.055 7.443,14.055 7.090,13.690 L7.090,13.690 Z"
                    />
                </svg>
            </button>
        );
    }

    return (
        <svg
            viewBox="0 0 20 14"
            width={props.size}
            height={props.size}
            xmlns="http://www.w3.org/2000/svg"
        >
            <path
                fill={props.color}
                d="M7.090,13.690 L1.229,7.604 C0.877,7.238 0.877,6.645 1.229,6.280 L2.504,4.955 C2.856,4.590 3.427,4.590 3.779,4.955 L7.728,9.055 L16.185,0.274 C16.538,-0.091 17.108,-0.091 17.461,0.274 L18.736,1.598 C19.088,1.964 19.088,2.557 18.736,2.922 L8.366,13.690 C8.013,14.055 7.443,14.055 7.090,13.690 L7.090,13.690 Z"
            />
        </svg>
    );
}

export default CheckIc;
