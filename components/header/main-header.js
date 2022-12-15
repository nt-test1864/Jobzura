import React, { useRef, useState, Fragment, useEffect } from "react";
import makeBlockie from "ethereum-blockies-base64";
import { GetWallet_NonMoralis } from "../../JS/local_web3_Moralis";
import { ethers } from "ethers";

import useOutsideClick from "../useOutsideClick";

import Logo from "../icons/Logo";
import NotificationIc from "../icons/Notification";
import UserIc from "../icons/User";
import DownArrowIc from "./../icons/DownArrow";
import RightArrowIc from "../icons/RightArrow";
import OrdersIc from "../icons/Orders";
import JobsIc from "../icons/Jobs";
import MoonIc from "./../icons/Moon";
import SunIc from "./../icons/Sun";
import MobileMenuIc from "./../icons/MobileMenu";

import Button from "../ui/Button";

import ConnectWallet from "../header/connect-wallet";
import Image from "next/image";
import Searchbar from "./searchbar";
import Link from "next/link";
import InboxDropdown from "./inbox-dropdown";
import Notifications from "./notifications";
import NetworkSwitchButton from "../network-switch/network-switch-button";
import LogoDark from "../icons/LogoDark";

const Web3 = require("web3");

function MainHeader(props) {
  const {
    darkMode,
    inboxDropwdownOpen,
    setInboxDropdownOpen,
    changeDarkMode,
    currentAccount,
    setCurrentAccount,
    isFindWorkDDShown,
    setIsFindWorkDDShown,
    mobileMenuOpen,
    mobileMenuTrigger,
  } = props;

  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [mobileUserDDOpen, setMobileUserDDOpen] = useState(false);
  const [notificationDDOpen, setNotificationDDOpen] = useState(false);
  const [notificationsRead, setNotificationsRead] = useState(true);
  const lowerCaseAddress = currentAccount.toLowerCase();

 function notificationToggleHalndler() {
   setNotificationDDOpen(!notificationDDOpen);
   setNotificationsRead(true);
 }

  const notificationRef = useRef();
    useOutsideClick(notificationRef, () => {
    if (notificationDDOpen) setNotificationDDOpen(false);
    });

  // Header User drop-down outside click function
  const dropdownRef = useRef();
  useOutsideClick(dropdownRef, () => {
    if (dropdownOpen) setDropdownOpen(false);
  });

  // Find-Work drop-down outside click function
  const findWorkRef = useRef();
  useOutsideClick(findWorkRef, () => {
    if (isFindWorkDDShown) setIsFindWorkDDShown(false);
  });

  {/* 
  async function apis() {
    const connectedAddress = await GetWallet_NonMoralis();
    const dataNotifications = await fetch(
      `./api/get/MyNotificationUnreadCount` + "?UserWallet=" + connectedAddress
    )
      .then((res) => res.json())
      .then((count) => { //
        setNotificationsRead(count > 0 ? false : true)
      });
  }

  function notiabc(e) {
    console.log(e);
  }


  useEffect(() => {
    apis() 
  }, [])

  */}

  return (
    <header className="headerMain">
      <div className="wrapper">
        <div className="mobileNavbar">
          <i>
            <MobileMenuIc onClick={mobileMenuTrigger} />
          </i>
        </div>

        <div className="logo">
          <Link href="/find-talent/jobs">
            {darkMode==='darkMode' ? <LogoDark /> : <Logo />}
          </Link>
        </div>

        <div className="headerSearch">
          <Searchbar/>
        </div>

        <nav className={`navbarMain ${mobileMenuOpen ? "show" : ""}`}>
          <ul>
            {currentAccount ? (
              <li
                className={`headerUserMobile ${mobileMenuOpen ? "visibleSmallerThanIpad" : ""
                  }`}
                ref={dropdownRef}
              >
                <div
                  onClick={() => setMobileUserDDOpen(!mobileUserDDOpen)}
                  className="headerUserIc"
                >
                  {currentAccount && (
                    <Fragment>
                      <div className="userSortInfo">
                        <Image
                          src={makeBlockie(currentAccount)}
                          width="42"
                          height="42"
                          alt={currentAccount}
                        />
                        <div className="connectedUserWlt">
                          <ConnectWallet
                            currentAccount={currentAccount}
                            setCurrentAccount={setCurrentAccount}
                          />
                        </div>
                      </div>
                      <i>
                        <DownArrowIc />
                      </i>
                    </Fragment>
                  )}
                </div>

                {mobileUserDDOpen && (
                  <div className="dropdownMenu headerSubOptions right withIc">
                    <ul>
                      <li onClick={mobileMenuTrigger}>
                        <Button link={`/user/${lowerCaseAddress}`}>
                          <i>
                            <UserIc />
                          </i>
                          <span>My Profile</span>
                        </Button>
                      </li>
                      <li onClick={mobileMenuTrigger}>
                        <Button link="/orders">
                          <i>
                            <OrdersIc />
                          </i>
                          <span>My Orders</span>
                        </Button>
                      </li>
                      <li onClick={mobileMenuTrigger}>
                        <Button link="/seller/jobs">
                          <i>
                            <JobsIc />
                          </i>
                          <span>My Jobs</span>
                        </Button>
                      </li>
                    </ul>
                  </div>
                )}
              </li>
            ) : (
              <li
                className="headerButton mobileUserLogin"
                onClick={mobileMenuTrigger}
              >
                <ConnectWallet
                  currentAccount={currentAccount}
                  setCurrentAccount={setCurrentAccount}
                />
              </li>
            )}
            <li ref={findWorkRef}>
              <Button
                classes="button withIcon transparent"
                onClick={() => setIsFindWorkDDShown(!isFindWorkDDShown)}
              >
                <span>Find Talent</span>
                <i>
                  <DownArrowIc size={18} />
                </i>
              </Button>

              {isFindWorkDDShown && (
                <div className="headerSubOptions dropdownMenu">
                  <ul>
                    <li>
                      <Link href="/find-talent/jobs">
                        <Button classes="button withIcon transparent">
                          <div className="buttonText">
                            Browse and buy projects
                            <span>Project Catelog</span>
                          </div>
                          <i>
                            <RightArrowIc />
                          </i>
                        </Button>
                      </Link>
                    </li>
                    <li>
                      <Link href="/find-talent/users">
                        <Button classes="button withIcon transparent">
                          <div className="buttonText">
                            Let us find you the right talent
                            <span>Talent Marketplace</span>
                          </div>
                          <i>
                            <RightArrowIc />
                          </i>
                        </Button>
                      </Link>
                    </li>
                  </ul>
                </div>
              )}
            </li>
            <li  onClick={mobileMenuTrigger}>
              <Button link='/inbox' classes="button transparent messageMenu">
                Messages
              </Button>

              {inboxDropwdownOpen && (
                <InboxDropdown currentAccount={currentAccount} />
              )}
            </li>

            
            <li ref={notificationRef}>
              <Button onClick={notificationToggleHalndler} classes="button transparent withIcon notifMenu">
                {mobileMenuOpen && (
                  <span className="visibleSmallerThanIpad">Notification</span>
                )}
                <i className="unreadMsg">
                  <NotificationIc size="18" 
                    // onClick={() => setNotificationsRead(true)}
                  />
                </i>
              </Button>

              {notificationDDOpen && (<div className="notificationDropdown">
                <Notifications />
              </div>)}
            </li>
           
            
            <li>
              <Link href="/orders">Orders</Link>
            </li>
            <li>
              <Link href="/seller/orders">Switch to Selling</Link>
            </li>
            {currentAccount ? (
              <li
                className={`headerUser ${mobileMenuOpen ? "hideSmallerThanIpad" : ""
                  }`}
                ref={dropdownRef}
              >
                <div
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                  className="headerUserIc"
                >
                  {currentAccount && (
                    <Image
                      src={makeBlockie(currentAccount)}
                      width="42"
                      height="42"
                      alt={currentAccount}
                    />
                  )}
                </div>

                {dropdownOpen && (
                  <div className="dropdownMenu headerSubOptions right withIc">
                    <ul>
                      <li>
                        <ConnectWallet
                          currentAccount={currentAccount}
                          setCurrentAccount={setCurrentAccount}
                        />
                      </li>
                      <li>
                        <NetworkSwitchButton />
                      </li>
                      <li onClick={() => setDropdownOpen(false)}>
                        <Button link={`/user/${lowerCaseAddress}`}>
                          <i>
                            <UserIc />
                          </i>
                          <span>My Profile</span>
                        </Button>
                      </li>
                      <li onClick={props.mobileDrawerFn}>
                        <Button link="/orders">
                          <i>
                            <OrdersIc />
                          </i>
                          <span>My Orders</span>
                        </Button>
                      </li>
                      <li onClick={() => setDropdownOpen(false)}>
                        <Button link="/seller/jobs">
                          <i>
                            <JobsIc />
                          </i>
                          <span>My Jobs</span>
                        </Button>
                      </li>
                      <li onClick={() => setDropdownOpen(false)}>
                        <div
                          className="changeModeOptions"
                          onClick={changeDarkMode}
                        >
                          <span
                            className={
                              darkMode==='darkMode'
                                ? "changeModeOption"
                                : "changeModeOption hide"
                            }
                          >
                            <i>
                              <MoonIc />
                            </i>
                            <span>Light Mode</span>
                          </span>
                          <span
                            className={
                              darkMode==='darkMode'
                                ? "changeModeOption hide"
                                : "changeModeOption"
                            }
                          >
                            <i>
                              <SunIc />
                            </i>
                            <span>Dark Mode</span>
                          </span>
                        </div>
                      </li>
                    </ul>
                  </div>
                )}
              </li>
            ) : (
              <li className="headerButton hideSmallerThanIpad">
                <ConnectWallet
                  currentAccount={currentAccount}
                  setCurrentAccount={setCurrentAccount}
                />
              </li>
            )}

            <li
              onClick={() => setDropdownOpen(false)}
              className="visibleSmallerThanIpad mobileExtraLi"
            >
              <div className="changeModeOptions" onClick={changeDarkMode}>
                <span
                  className={
                    darkMode==='darkMode' ? "changeModeOption" : "changeModeOption hide"
                  }
                >
                  <i>
                    <MoonIc />
                  </i>
                  <span>Light Mode</span>
                </span>
                <span
                  className={
                    darkMode==='darkMode' ? "changeModeOption hide" : "changeModeOption"
                  }
                >
                  <i>
                    <SunIc />
                  </i>
                  <span>Dark Mode</span>
                </span>
              </div>
            </li>
          </ul>
        </nav>

        {/* <div className="mobileSearch">
          <Searchbar/>
        </div> */}
      </div>
    </header>
  );
}

export default MainHeader;
