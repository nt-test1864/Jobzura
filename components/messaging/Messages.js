import React, { useState, useRef, useEffect, Fragment, useMemo } from "react";
import { useMoralis } from "react-moralis";
import Message from "./Message";
import CloseIc from "./../icons/Close";
import Picker from "@emoji-mart/react";
import data from "@emoji-mart/data";
import useSWR, { useSWRConfig } from "swr";
import { useRouter } from "next/router";

import AttachmentIc from "./../icons/Attachment";
import SmileyIc from "./../icons/Smiley";

const fetcher = async (...args) => fetch(...args).then((res) => res.json());

const Messages = (props) => {
  const { Moralis } = useMoralis();
  const { currentAccount, userAddress } = props;
  const router = useRouter();
  const [message, setMessage] = useState("");
  const [showEmojis, setShowEmojis] = useState(false);
  const filePickerRef = useRef(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const endOfMessages = useRef(null);
  const truncateReceiverAddress = userAddress
    ? userAddress.slice(0, 5) + "..." + userAddress.slice(-4)
    : "";
  const messageSender = currentAccount.toLowerCase();
  const messageReceiver = userAddress?.toLowerCase();
  const { mutate } = useSWRConfig();
  const { data: messages, error } = useSWR(
    `/api/get/MyMessages?sender=${messageSender}&receiver=${messageReceiver}`,
    fetcher,
  );

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
      const Messages = Moralis.Object.extend("Messages");
      const messageObject = new Messages();

      messageObject.set("sender", messageSender);
      messageObject.set("receiver", messageReceiver);
      messageObject.set("message", message);
      messageObject.set("image", selectedFile);

      await messageObject.save();
      setMessage("");
      setSelectedFile(null);

      await createReceiver();
      mutate(`/api/get/MyMessages?sender=${messageSender}&receiver=${messageReceiver}`);
    }
  };

  useEffect(() => {
    endOfMessages.current.scrollIntoView({
      behavior: "smooth",
      block: "end",
      inline: "nearest",
    });
  }, [messages]);

  const isDisabled = !message.trim() && !selectedFile;

  // useMemo to stop rerendering the Message component when the user types in the input field and makes it laggy
  const messagesList = useMemo(() => {
    if (messages) {
      return messages.map((message, index) => (
        <Message
          key={index}
          message={message}
          messageSender={messageSender}
          messageReceiver={messageReceiver}
        />
      ));
    }
  }, [messages]);


  return (
    <Fragment>
      <div className="chatboxContainer">
        {messagesList}
        <div ref={endOfMessages}></div>
      </div>

      <div className="chatboxFooter">
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
              placeholder={`Type a message to ${truncateReceiverAddress}`}
              onChange={(e) => setMessage(e.target.value)}
              className="chatboxInput"
            />

            <div className="chatInputSmiley">
              <SmileyIc size="24" onClick={() => setShowEmojis(!showEmojis)} />
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
              className="button dark"
              onClick={sendMessage}
              disabled={isDisabled}
            >
              Send
            </button>
          </div>
        </form>
      </div>
    </Fragment>
  );
};

export default Messages;
