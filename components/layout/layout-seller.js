import { useState } from "react";

import MainHeaderSeller from "../header/main-header-seller";

import { getCookies, setCookie, deleteCookie } from 'cookies-next';

function LayoutSeller(props) {
  const { currentAccount, setCurrentAccount, changeViewFn } = props;

  const [darkMode, setDarkMode] = useState(getCookies().ThemeMode===undefined?'':getCookies().ThemeMode);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [inboxDropwdownOpen, setInboxDropdownOpen] = useState(false);
  const [isFindWorkDDShown, setIsFindWorkDDShown] = useState(false);

  // Light and Dark Mode function
  function changeDarkModeHalndler() {
    if(getCookies().ThemeMode==='darkMode'){
      setCookie('ThemeMode','')
      setDarkMode("");
    }else{
      setCookie('ThemeMode','darkMode')
      setDarkMode("darkMode");
    }
  }

  // Responsive mobile menu drawer function
  function toggleMobileDrawerHandler() {
    setMobileMenuOpen(!mobileMenuOpen);
  }

  return (
    <div
      className={`layoutMain layoutSeller ${darkMode}`}
    >
      <MainHeaderSeller
        darkMode={darkMode}
        inboxDropwdownOpen={inboxDropwdownOpen}
        setInboxDropdownOpen={setInboxDropdownOpen}
        changeDarkMode={changeDarkModeHalndler}
        currentAccount={currentAccount}
        setCurrentAccount={setCurrentAccount}
        isFindWorkDDShown={isFindWorkDDShown}
        setIsFindWorkDDShown={setIsFindWorkDDShown}
        mobileMenuOpen={mobileMenuOpen}
        mobileMenuTrigger={toggleMobileDrawerHandler}
        changeViewFn={changeViewFn}
      />

      <main className="containerMain">{props.children}</main>
    </div>
  );
}

export default LayoutSeller;
