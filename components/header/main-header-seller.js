import React, { useRef, useState, Fragment } from "react";
import makeBlockie from "ethereum-blockies-base64";

import useOutsideClick from "../useOutsideClick";

import Logo from "../icons/Logo";
import NotificationIc from "../icons/Notification";
import UserIc from "../icons/User";
import DownArrowIc from "../icons/DownArrow";
import LogoutIc from "../icons/Logout";
import OrdersIc from "../icons/Orders";
import JobsIc from "../icons/Jobs";
import MoonIc from "../icons/Moon";
import SunIc from "../icons/Sun";
import MobileMenuIc from "../icons/MobileMenu";

import Button from "../ui/Button";

import ConnectWallet from "./connect-wallet";
import Image from "next/image";
import Link from "next/link";
import InboxDropdown from "./inbox-dropdown";
import Notifications from "./notifications";
import NetworkSwitchButton from "../network-switch/network-switch-button";
import LogoDark from "../icons/LogoDark";

function MainHeaderSeller(props) {
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
  const [isModalOpen, setIsModalOpen] = useState(false);
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

  const toggleEarningsModal = () => {
    setIsModalOpen((prev) => !prev);
  };

  return (
    <header className="headerMain">
      <div className="wrapper">
        <div className="mobileNavbar">
          <i>
            <MobileMenuIc onClick={mobileMenuTrigger} />
          </i>
        </div>

        <div className="logo">
          <Link href="/seller/">
            {darkMode==='darkMode' ? <LogoDark /> : <Logo />}
          </Link>
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
            <li>
              <Button classes="button transparent" link="/seller/orders">
                Orders
              </Button>
            </li>
            <li>
              <Button link="/seller/jobs/">Jobs</Button>
            </li>
            <li>
              <div
                className="earnings"
                onMouseOver={toggleEarningsModal}
                onMouseLeave={toggleEarningsModal}
              >
                <Button classes="button transparent">Earnings</Button>
                {isModalOpen && (
                  <div className="modal">
                    <div className="modalContent">
                      <h3>Earnings</h3>
                      <p>Coming soon</p>
                    </div>
                    <div className="polygon"></div>
                  </div>
                )}
              </div>
            </li>
            <li>
              <Button
                link="/inbox"
                classes="button transparent messageMenu"
              >
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
              <Button link="/seller/jobs/create-job" classes="button transparent">Create a Job</Button>
            </li>
            <li>
              <Link href="/orders">Switch to Buyer</Link>
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
            <li
              onClick={() => setDropdownOpen(false)}
              className="visibleSmallerThanIpad mobileExtraLi"
            >
              <Button link="/">
                <i>
                  <LogoutIc />
                </i>
                <span>Logout</span>
              </Button>
            </li>
          </ul>
        </nav>
      </div>
    </header>
  );
}

export default MainHeaderSeller;
