import Link from "next/link";

function Button(props) {
  if (props.link) {
    return (
      <Link href={props.link}>
        <a className={props.classes}>{props.children}</a>
      </Link>
    );
  }

  if (props.onClick) {
    return (
      <button className={props.classes} onClick={props.onClick}>
        {props.children}
      </button>
    );
  }

  return <button className={props.classes}>{props.children}</button>;
}

export default Button;
