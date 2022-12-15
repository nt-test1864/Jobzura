import { useEffect, useMemo, useRef, useState } from "react";
import Picker from "@emoji-mart/react";
import Link from "next/link";
import data from "@emoji-mart/data";
import SmileyIc from "../icons/Smiley";
import CloseIc from "../icons/Close";
import AttachmentIc from "./../icons/Attachment";
import {StartDispute_Moralis} from "../../JS/local_web3_Moralis";
import Moment from "react-moment";
import Image from "next/image";
import makeBlockie from "ethereum-blockies-base64";
import { useMoralis } from "react-moralis";
import DisputeMessage from "./DisputeMessage";
import useSWR, { useSWRConfig } from "swr";

const fetcher = async (...args) => fetch(...args).then((res) => res.json());

const DisputeBox = (props) => {
  const { Moralis } = useMoralis();
  const { contractDetails, currentAccount } = props;
  const lowerCaseCurrentAccount = currentAccount?.toLowerCase();
  const filePickerRef = useRef(null);
  const endOfMessages = useRef(null);
  const [message, setMessage] = useState("");
  const [showEmojis, setShowEmojis] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);

  const isDisabled = !message.trim() && !selectedFile;

  const Seller = contractDetails?.SellerWallet?.stringValue;
  const truncateBuyer = lowerCaseCurrentAccount?.substring(0, 6) + "..." + lowerCaseCurrentAccount?.substring(38, 42);
  
  const TimeToDeliver = contractDetails?.TimeToDeliver?.stringValue;
  const createdAt = contractDetails?.createdAt?.stringValue;
  const date = new Date(createdAt);
  const dueOn = new Date(date.getTime() + TimeToDeliver * 24 * 60 * 60 * 1000);
  
  // MESSAGE PART
  const messageSender = lowerCaseCurrentAccount;
  const messageReceiver = Seller?.toLowerCase();
  const { mutate } = useSWRConfig();
  const { data: messages, error } = useSWR(
    `/api/get/MyDisputeMessages?sender=${messageSender}&receiver=${messageReceiver}`,
    fetcher,
    )

    const addEmoji = (e) => {
      let sym = e.unified.split("-");
      let codesArray = [];
      sym.forEach((el) => codesArray.push("0x" + el));
      let emoji = String.fromCodePoint(...codesArray);
      setMessage(message + emoji);
    };
    
    const addImageToPost = (e) => {
      const reader = new FileReader();
      if (e.target.files[0]) {
        reader.readAsDataURL(e.target.files[0]);
      }
  
      reader.onload = (readerEvent) => {
        setSelectedFile(readerEvent.target.result);
      };
      filePickerRef.current.value = "";
    };

    const createReceiver = async () => {
    const Users = Moralis.Object.extend("Users");
    const query = new Moralis.Query(Users);
    query.equalTo("userAddress", messageReceiver);
    const results = await query.find();
    if (results.length === 0) {
      const user = new Users();
      user.set("userAddress", messageReceiver);
      await user.save();
    }
  };

  const sendMessage = async (e) => {
    e.preventDefault();

    if (message.length > 0) {
      const Messages = Moralis.Object.extend("DisputeMessages");
      const messageObject = new Messages();

      messageObject.set("sender", messageSender);
      messageObject.set("receiver", messageReceiver);
      messageObject.set("message", message);
      messageObject.set("image", selectedFile);

      await messageObject.save();
      setMessage("");
      setSelectedFile(null);

      await createReceiver();
      mutate(`/api/get/MyDisputeMessages?sender=${messageSender}&receiver=${messageReceiver}`);
    }
  };

  useEffect(() => {
    endOfMessages.current.scrollIntoView({
      behavior: "smooth",
      block: "end",
      inline: "nearest",
    });
  }, [messages]);

  const messagesList = useMemo(() => {
    if (messages) {
      return messages.map((message, index) => (
        <DisputeMessage
          key={index}
          message={message}
          messageSender={messageSender}
          messageReceiver={messageReceiver}
        />
      ));
    }
  }, [messages]);

  return (
    <div className="disputeBox">
      <div className="disputeBoxHeader">
        <h3>Contract #{contractDetails.ChainId?.stringValue + "_" + contractDetails.Index?.stringValue}</h3>
        <div className="disputeBoxHeaderRight">
          <Link href={`/orders`}>
            <button>
              Close Dispute
            </button>
          </Link>

          <button onClick={() =>
            StartDispute_Moralis(contractDetails.CurrencyTicker.stringValue, contractDetails.Index.stringValue)
              .catch((error) => {
                console.error(error);
                console.log("Start Dispute error code: " + error.code);
                if (error.data && error.data.message) {
                  console.log(error.data.message);
                } else {
                  console.log(error.message);
                }
                process.exitCode = 1;
              })
          }
          >Confirm Dispute</button>
        </div>
      </div>

      <div className="disputeBoxBody">
        <div className="disputeBoxChat">
          <div className="disputeBoxChatHeader">
            {Seller ? (
              <Image
                src={makeBlockie(currentAccount)}
                alt="Seller"
                width={40}
                height={40}
                style={{ borderRadius: "50%" }}
              />
            ) : (
              <div className="placeholderImage"></div>            
            )}
            <div className="profileName">
              <h4>{truncateBuyer}</h4>
              <span>Buyer</span>
            </div>
            <span>|</span>
            <Moment format="h:mm a"/>
          </div>

          <div className="disputeBoxChatBody">
            <div className="disputeBoxChatBodyHeader">
              <span>The dispute is open due to :</span>
              <h4>Delivery time is over</h4>
            </div>

            <div className="disputeBoxChatBodyImages">
              <div className="disputeBoxChatBodyImage"></div>
              <div className="disputeBoxChatBodyImage"></div>
              <div className="disputeBoxChatBodyImage"></div>
            </div>
          </div>
        </div>
        <div className="chatboxContainer">
          {messagesList}
          <div ref={endOfMessages}></div>
        </div>
        {selectedFile && (
          <div className="attachedFileContainer">
            <div className="chatAttachedFile">
              <div
                onClick={() => setSelectedFile(null)}
                className="chatAttachedFile_removeIc"
              >
                <CloseIc size="18" />
              </div>
              <img src={selectedFile} alt="selected file" />
            </div>
          </div>
        )}
      </div>


      <form className="chatboxFooterForm">
        <div className="charboxAttachment">
          <AttachmentIc
            size={24}
            onClick={() => filePickerRef.current.click()}
            name="image"
          />
          <input
            type="file"
            ref={filePickerRef}
            hidden
            onChange={addImageToPost}
            accept="image/png, image/jpeg, image/jpg"
          />
        </div>

        <div className="chatInputContainer">
          <input
            type="text"
            value={message}
            placeholder={`Type your message...`}
            onChange={(e) => setMessage(e.target.value)}
            className="chatboxInput"
          />

          <div className="chatInputSmiley">
            <SmileyIc size="24" 
              onClick={() => setShowEmojis(!showEmojis)} 
            />
            {showEmojis && (
              <div className="smileyPickerMain">
                <Picker data={data} onEmojiSelect={addEmoji} theme="dark" />
              </div>
            )}
          </div>
        </div>

        <div className="chatButton">
          <button
            type="submit"
            className="button primary"
            onClick={sendMessage}
            disabled={isDisabled}
          >
            Send
          </button>
        </div>
      </form>
    </div>
  )
}

export default DisputeBox