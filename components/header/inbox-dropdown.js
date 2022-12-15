import React from "react";
import Link from "next/link";
import Button from "../ui/Button";
import Moment from "react-moment";
import { useQuery } from "react-query";
import { useEffect } from "react";
import makeBlockie from "ethereum-blockies-base64";
import Image from "next/image";

const getAllUsersFetch = async () => {
  const response = await fetch("/api/get/AllUsers");
  const data = await response.json();

  return data;
};

const getAllMessagesFetch = async () => {
  const response = await fetch("/api/get/AllMessages");
  const messageData = await response.json();

  return messageData;
};

const getAllUsersAndMessagesFetch = async () => {
  const [users, messages] = await Promise.all([
    getAllUsersFetch(),
    getAllMessagesFetch(),
  ]);
  return { users, messages };
};


const InboxDropdown = (props) => {
  const { currentAccount } = props;
  const lowerCaseCurrentAccount = currentAccount?.toLowerCase();
  const { data: allUsersAndMessagesData, status } = useQuery(
    "UsersAndMessages",
    getAllUsersAndMessagesFetch,
  );


  const users = allUsersAndMessagesData?.users.filter((user) => {
    return user.name.userAddress !== lowerCaseCurrentAccount;
  });

  const getUsersList = (users) => {
    const usersWithMessages = users?.map((user) => {
      const lowerCaseUser = user.name.userAddress?.toLowerCase();

      const userMessages = allUsersAndMessagesData.messages?.filter(
        (message) => {
          const lowerCaseSender = message.message.sender.toLowerCase();
          const lowerCaseReceiver = message.message.receiver.toLowerCase();
          return (
            lowerCaseSender === lowerCaseUser ||
            lowerCaseReceiver === lowerCaseUser
          );
        }
      );
      return {
        ...user,
        messages: userMessages,
        currentUser: lowerCaseCurrentAccount,
      };
    });

    const usersWithMessagesSorted = usersWithMessages?.sort((a, b) => {
      return b.messages?.length - a.messages?.length;
    });

    const usersWithMessagesSortedFiltered = usersWithMessagesSorted?.filter(
      (user) => {
        return user.messages?.length > 0;
      }
    );

    return usersWithMessagesSortedFiltered;
  };

  const usersList = getUsersList(users);

  const filteredUsersList = usersList?.filter((user) => {
    const lowerCaseUser = user.name.userAddress?.toLowerCase();
    const userMessages = allUsersAndMessagesData.messages?.filter((message) => {
      const lowerCaseSender = message.message.sender.toLowerCase();
      const lowerCaseReceiver = message.message.receiver.toLowerCase();
      return (
        lowerCaseSender === lowerCaseUser || lowerCaseReceiver === lowerCaseUser
      );
    });
    const userMessagesWithCurrentUser = userMessages?.filter((message) => {
      const lowerCaseSender = message.message.sender.toLowerCase();
      const lowerCaseReceiver = message.message.receiver.toLowerCase();
      return (
        lowerCaseSender === lowerCaseCurrentAccount ||
        lowerCaseReceiver === lowerCaseCurrentAccount
      );
    });
    return userMessagesWithCurrentUser?.length > 0;
  });

  const lastMessageContent = filteredUsersList?.map((user) => {
    const lowerCaseUser = user.name.userAddress?.toLowerCase();
    const userMessages = allUsersAndMessagesData.messages?.filter((message) => {
      const lowerCaseSender = message.message.sender.toLowerCase();
      const lowerCaseReceiver = message.message.receiver.toLowerCase();
      return (
        lowerCaseSender === lowerCaseUser || lowerCaseReceiver === lowerCaseUser
      );
    });
    const userMessagesWithCurrentUser = userMessages?.filter((message) => {
      const lowerCaseSender = message.message.sender.toLowerCase();
      const lowerCaseReceiver = message.message.receiver.toLowerCase();
      return (
        lowerCaseSender === lowerCaseCurrentAccount ||
        lowerCaseReceiver === lowerCaseCurrentAccount
      );
    });
    const lastMessage =
      userMessagesWithCurrentUser?.[userMessagesWithCurrentUser?.length - 1];
    return lastMessage;
  });

  const lastMessageTimestamp = filteredUsersList?.map((user) => {
    const lowerCaseUser = user.name.userAddress?.toLowerCase();
    const userMessages = allUsersAndMessagesData.messages?.filter((message) => {
      const lowerCaseSender = message.message.sender.toLowerCase();
      const lowerCaseReceiver = message.message.receiver.toLowerCase();
      return (
        lowerCaseSender === lowerCaseUser || lowerCaseReceiver === lowerCaseUser
      );
    });
    const userMessagesWithCurrentUser = userMessages?.filter((message) => {
      const lowerCaseSender = message.message.sender.toLowerCase();
      const lowerCaseReceiver = message.message.receiver.toLowerCase();
      return (
        lowerCaseSender === lowerCaseCurrentAccount ||
        lowerCaseReceiver === lowerCaseCurrentAccount
      );
    });
    const lastMessage =
      userMessagesWithCurrentUser?.[userMessagesWithCurrentUser?.length - 1];
    return lastMessage;
  });

  const lastMessageContentWithYou = lastMessageContent?.map((message) => {
    const lowerCaseSender = message?.message?.sender?.toLowerCase();
    if (lowerCaseSender === lowerCaseCurrentAccount) {
      if (message?.message?.message === "") {
        return "(sent an image)";
      } else {
        return message?.message?.message;
      }
    } else {
      return message?.message?.message;
    }
  });

  const truncate = (str, n) => {
    return str?.length > n ? str.substr(0, n - 1) + "..." : str;
  };

  return (
    <div 
      className="headerSubOptions dropdownMenu"
    >
      <ul style={{ maxHeight: "248px", overflowY: "scroll" }}>
        <h4>Inbox</h4>
        {status === "loading" && <p>Loading...</p>}
        {status === "error" && <p>Error fetching data</p>}
        {status === "success" &&
          <>
            {filteredUsersList && 
              filteredUsersList?.map((user, index) => (
                <li key={index}>
                  <Link href={`/inbox/${user.name.userAddress}`} key={index}>
                    <Button classes="button withIcon transparent">
                    <div className="inboxUserThumb">
                      <span className="profilePic">
                        <Image
                          src={makeBlockie(user.name.userAddress)}
                          width="100%"
                          height="100%"
                          alt={user.name.userAddress}
                          style={{ borderRadius: "50%" }}
                        />
                      </span>
                    </div>
                      <div className="buttonText">
                        {user.name.userAddress.slice(0, 6) + "..." + user.name.userAddress.slice(-4)}
                        <span> {truncate(lastMessageContentWithYou[index], 30)}</span>
                        <span className="msgIndicator">
                          <Moment 
                            fromNow
                          >
                            {lastMessageTimestamp[index]?.message.createdAt}
                          </Moment>
                        </span>
                      </div>
                    </Button>
                  </Link>
                </li>
            ))}
            {filteredUsersList?.length === 0 && (
              <div
                className="inboxListItem"
                style={{
                  cursor: "default",
                }}
              >
                <div className="inbox__users__list__item__header">
                  <div>
                    <span className="inbox__users__list__item__username">
                      No conversations yet
                    </span>
                  </div>
                </div>
              </div>
            )}
          </>
        } 
      </ul>
      <div className="inboxFooter">
        <Link href="/inbox">
          <a>View all messages</a>
        </Link>
      </div>
    </div>
  );
}

export default InboxDropdown