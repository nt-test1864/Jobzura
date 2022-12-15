import React from "react";
import Link from "next/link";
import Moment from "react-moment";
import { useQuery } from "react-query";
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

export const MessagesUsersList = (props) => {
  const { currentAccount, userListVisible, handleClickUserlist } = props;
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
    const lowerCaseUser = user?.name?.userAddress?.toLowerCase();
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

  return (
    <div className={`inboxList ${userListVisible ? "" : "visibleList"}`}>
      <div className="inboxHeader">
        <div className="inboxHeaderSort">All Conversations</div>
      </div>
      <div className="inboxListContainer">
        {filteredUsersList &&
          filteredUsersList?.map((user, index) => (
            <>
              {status === "success" && (
                <Link href={`/inbox/${user.name.userAddress}`} key={index}>
                  <div className="inboxListItem">   {/*  onClick={handleClickUserlist} */}
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
                    <div className="inboxUserSort">
                      <div className="inboxSortLeft">
                        <div className="listUsername">
                          {user.name.userAddress.slice(0, 6) +
                            "..." +
                            user.name.userAddress.slice(-4)}
                        </div>
                        <div className="userLastMsg">
                          {lastMessageContentWithYou[index]}
                        </div>
                      </div>
                      <div className="inboxSortRight">
                        <div className="userLastMsgTime">
                          <Moment fromNow>
                            {lastMessageTimestamp[index]?.message.createdAt}
                          </Moment>
                        </div>
                      </div>
                    </div>
                  </div>
                </Link>
              )}
              {status === "loading" && (
                <div className="inboxListItem">
                  <div className="inbox__users__list__item__header">
                    <div>
                      <span className="inbox__users__list__item__username">
                        Loading
                      </span>
                    </div>
                  </div>
                </div>
              )}
            </>
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
      </div>
    </div>
  );
};
