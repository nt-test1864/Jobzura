function DownArrowIc(props) {
    if (props.onClick) {
        return (
            <button onClick={props.onClick} className="linkButton" type="button">
                <svg
                    viewBox="0 0 24 24"
                    width={props.size}
                    height={props.size}
                    xmlns="http://www.w3.org/2000/svg"
                >
                    <path d="M12 13.172l4.95-4.95 1.414 1.414L12 16 5.636 9.636 7.05 8.222z" />
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
            <path d="M12 13.172l4.95-4.95 1.414 1.414L12 16 5.636 9.636 7.05 8.222z" />
        </svg>
    );
}

export default DownArrowIc;
