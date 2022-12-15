// es-lint warning img
import Moment from "react-moment";
import { Fragment } from "react";
import Image from "next/image";
import makeBlockie from "ethereum-blockies-base64";

const Message = (props) => {
  const { messageSender, messageReceiver, message } = props;

  const messageContent = message.name?.message;
  const messageSenderLower = message.name?.sender;
  const messageDate = message.name?.createdAt;
  const messageImage = message.name?.image;

  const isSender = messageSender === messageSenderLower;
  const truncateReceiverAddress = messageReceiver
    ? messageReceiver.slice(0, 5) + "..." + messageReceiver.slice(-4)
    : "";

  return (
    <div className={`chatMsg ${isSender ? "msgMine" : "msgOpposite"}`}>
      {isSender ? (
        <div className="msgBox">
          {messageImage ? (
            <Fragment>
              <div className="userPic">
                <span>
                  <Image
                    src={makeBlockie(messageSender)}
                    alt={messageSender}
                    width={40}
                    height={40}
                    style={{ borderRadius: "50%" }}
                  />
                </span>
              </div>
              <div className="userMsg">
                <div className="nameAndTime">
                  <div className="msgTime">
                    <Moment format="DD/MM/YYYY - HH:mm" fromNow>
                      {messageDate}
                    </Moment>
                  </div>
                  <div className="msgSender">You</div>
                </div>
                <img
                  src={messageImage}
                  alt="messageImage"
                  className="chatbox__message__image"
                />
                <p className="chatbox__message__image__content">
                  {messageContent}
                </p>
              </div>
            </Fragment>
          ) : (
            <Fragment>
              <div className="userPic">
                <span>
                  <Image
                    src={makeBlockie(messageSender)}
                    alt={messageSender}
                    width={40}
                    height={40}
                    style={{ borderRadius: "50%" }}
                    />
                </span>
              </div>
              <div className="userMsg">
                <div className="nameAndTime">
                  <div className="msgTime">
                    <Moment format="DD/MM/YYYY - HH:mm" fromNow>
                      {messageDate}
                    </Moment>
                  </div>
                  <div className="msgSender">You</div>
                </div>
                <p>{messageContent}</p>
              </div>
            </Fragment>
          )}
        </div>
      ) : (
        <div className="msgBox">
          {messageImage ? (
            <Fragment>
              <div className="userPic">
                <span>
                  <Image
                    src={makeBlockie(messageReceiver)}
                    alt={messageReceiver}
                    width={40}
                    height={40}
                    style={{ borderRadius: "50%" }}
                  />
                </span>
              </div>
              <div className="userMsg">
                <div className="nameAndTime">
                  <div className="msgSender">{truncateReceiverAddress}</div>
                  <div className="msgTime">
                    <Moment format="DD/MM/YYYY - HH:mm" fromNow>
                      {messageDate}
                    </Moment>
                  </div>
                </div>
                <img
                  src={messageImage}
                  alt="messageImage"
                  className="chatbox__message__image"
                />
                <p className="chatbox__message__image__content">
                  {messageContent}
                </p>
              </div>
            </Fragment>
          ) : (
            <Fragment>
              <div className="userPic">
                <span>
                  <Image
                    src={makeBlockie(messageReceiver)}
                    alt={messageReceiver}
                    width={40}
                    height={40}
                    style={{ borderRadius: "50%" }}
                  />
                </span>
              </div>
              <div className="userMsg">
                <div className="nameAndTime">
                  <div className="msgSender">{truncateReceiverAddress}</div>
                  <div className="msgTime">
                    <Moment format="DD/MM/YYYY - HH:mm" fromNow>
                      {messageDate}
                    </Moment>
                  </div>
                </div>
                <p>{messageContent}</p>
              </div>
            </Fragment>
          )}
        </div>
      )}
    </div>
  );
};

export default Message;
