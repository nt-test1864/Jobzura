function LinkArrowIc(props) {
    if (props.onClick) {
        return (
            <button onClick={props.onClick} className="linkButton" type="button">
                <svg
                    viewBox="0 0 9 13"
                    width={props.size}
                    height={props.size}
                    xmlns="http://www.w3.org/2000/svg"
                >
                    <path
                        fill={props.color}
                        d="M-0.000,11.684 L1.514,13.000 L9.000,6.500 L9.000,6.500 L9.000,6.500 L1.514,-0.000 L-0.000,1.316 L5.967,6.500 L-0.000,11.684 Z"
                    />
                </svg>
            </button>
        );
    }

    return (
        <svg
            viewBox="0 0 9 13"
            width={props.size}
            height={props.size}
            xmlns="http://www.w3.org/2000/svg"
        >
            <path
                fill={props.color}
                d="M-0.000,11.684 L1.514,13.000 L9.000,6.500 L9.000,6.500 L9.000,6.500 L1.514,-0.000 L-0.000,1.316 L5.967,6.500 L-0.000,11.684 Z"
            />
        </svg>
    );
}

export default LinkArrowIc;
