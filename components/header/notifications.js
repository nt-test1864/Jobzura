import { GetWallet_NonMoralis } from "../../JS/local_web3_Moralis";
import React, { useState, useEffect, Fragment } from "react";
import Button from '../ui/Button';
import Moment from "react-moment";

// import StarIcon from '@mui/icons-material/Star';

function Notifications() {
  const [dataNotifications, setDataNotifications] = useState([]);
  const [filteredNotifications, setFilteredNotifications] = useState([]);

  async function apis() {
    const connectedAddress = await GetWallet_NonMoralis();

    const dataNotifications = await 
      fetch(`/api/get/MyNotifications?UserWallet=${connectedAddress}`)
        .then((res) => res.json())
        .then((json) => {
          setDataNotifications(json)
        }
      );
  } 

  useEffect(() => {
    apis() 
  }, []);

  // TO FIX: mark as read button would clear all notifications 
  // function filterReadNotifications() {
  //   const filteredNotifications = dataNotifications.filter((notification) => {
  //     const notificationArray = Object.values(notification);
  //     const read = notificationArray[2];
  //     if (read === 0) {
  //       return notification;
  //     }
  //   });
  //   setFilteredNotifications(filteredNotifications);
  //   console.log("filteredNotifications: " + filteredNotifications);
  // }

  return (
   <>
    <div className="notificationHeader">
      <h2>Notifications ({dataNotifications.length})</h2>
      <Button 
        classes="button default"
        // onClick={filterReadNotifications}
      >Mark all as read</Button>
    </div>
    {dataNotifications.length > 0 ? dataNotifications.map((item, index) => (
      <div className="notificationContainer" key={index}>
        <div className="notifBlock">
          <div className="notifContent">
            <p>{item.Description}</p>
            <Moment 
              fromNow
              date={item.createdAt}
            />
          </div>
        </div>
      </div> 
    )) : 
      <div className="notificationContainer">
        <div className="notifBlock">
          <div className="notifContent">
            <p>You have 0 notification</p>
          </div>
        </div>
      </div>
    }
   </>
  );
}

export default Notifications;