import Link from "next/link";
import ErrorIc from "./../icons/Error";
import SuccessIc from "./../icons/Success";
import Button from "./Button";

function ModalUi(props) {
  if (props.content.type === "alert" && props.content.show) {
    return (
      <div className="modalMain">
        <div className="modalContainer">
          <div className="modalBox">
            {props.content.status === "Error" ? (
              <div className="ErrorMsg alertBody">
                <div className="alertIcon">
                  <ErrorIc />
                </div>
                <div className="alertMessage">{props.content.message}</div>
                <div className="alertAction">
                  <Button
                    classes="button light rounded"
                    onClick={props.closeModelFn}
                  >
                    Close
                  </Button>
                </div>
              </div>
            ) : (
              <></>
            )}
            {props.content.status === "Pending" ? (
              <div className="PendingMsg alertBody">
                <div className="alertIcon">
                  {/* <ErrorIc /> */}
                  <div className="lds-hourglass"></div>
                </div>
                <div className="alertMessage">{props.content.message}</div>
                <div className="alertAction">
                  <Button
                    classes="button light rounded"
                    onClick={props.closeModelFn}
                  >
                    Close
                  </Button>
                </div>
              </div>
            ) : (
              <></>
            )}
            {props.content.status === "Success" ? (
              <div className="SuccessMsg alertBody">
                <div className="alertIcon">
                  <SuccessIc />
                </div>
                <div className="alertMessage">{props.content.message}</div>
                <div className="transactionHash">
                  Transaction hash:
                  <span>{props.content.transactionHash}</span>
                </div>
                <div className="alertAction">
                  <Link
                    href={
                      "https://polygonscan.com/tx/" +
                      props.content.transactionHash
                    }
                    passHref
                  >
                    <a
                      target="_blank"
                      rel="noopener noreferrer"
                      className="button green rounded"
                    >
                      See Details
                    </a>
                  </Link>
                  <Button
                    classes="button dark rounded"
                    onClick={props.closeModelFn}
                  >
                    Close
                  </Button>
                </div>
              </div>
            ) : (
              <></>
            )}
          </div>
        </div>
      </div>
    );
  }

  return props.content.show ? (
    <div className="modalMain">
      <div className="modalContainer">
        <div className="modalBox">
          <div className="modalHeader">
            <h5>{props.content.title}</h5>
            <Button classes="linkButton" onClick={props.closeModelFn}>
              x
            </Button>
          </div>
          <div className="modalBody">{props.content.body}</div>
          {props.content.action && (
            <div className="modalFooter">
              <Button
                classes="button default rounded mr-10"
                onClick={props.closeModelFn}
              >
                Close
              </Button>
              {props.content.action.map((action, i) => (
                <Button
                  key="i"
                  classes="button dark rounded"
                  onClick={action.click}
                >
                  {action.value}
                </Button>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  ) : (
    <></>
  );
}

export default ModalUi;
