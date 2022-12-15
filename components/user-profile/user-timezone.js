import { Fragment, useMemo, useState } from "react";
import { timezoneList } from "./../../data/timezone";

import spacetime from "spacetime";
import EditTimezone from "./edit-timezone";
import axios from "axios";
import PencilIc from "../icons/Pencil";
import { GetWallet_NonMoralis } from '../../JS/local_web3_Moralis.js';
import { SignMessageWithAlias } from "../../JS/auth/messageSigning";
import { CheckAndCreateAlias } from "../../JS/auth/AliasAuthentication";

function UserSelectedTimezon(props) {
  const { setModelData, userProfile, currentAccount } = props;

  const [timezone, setTimezone] = useState(
    userProfile.Timezone
      ? userProfile.Timezone
      : Intl.DateTimeFormat().resolvedOptions().timeZone
  ); //userProfile.Timezone
  const [timezoneAbbrev, setTimezoneAbbrev] = useState("");

  const [datetime, setDatetime] = useState(spacetime.now());

  useMemo(() => {
    setDatetime(datetime.goto(timezone));
    let abbr = timezoneList.filter(({ value }) => timezone == value);
    let abbrName = "";
    if (abbr.length > 0 && abbr["0"]["abbrev"]) {
      abbrName = abbr["0"]["abbrev"];
    } else {
      abbrName = timezone.split("/")[1] ? timezone.split("/")[1] : timezone;
    }
    setTimezoneAbbrev(abbrName);
  }, [timezone]);

  const updateTimezone = async (timezone) => {

    // check if Alias is present in local storage, if not, create a new one
    const res = await CheckAndCreateAlias();
    if(res == false){return false;} 

    var formData = new FormData();
    const connectedAddress = (await GetWallet_NonMoralis())[0];

    // run for every parameter to append
    const signedMessage_connectedAddress = await SignMessageWithAlias(connectedAddress);
    formData.append("address", signedMessage_connectedAddress.address);
    formData.append("message_UserWallet", signedMessage_connectedAddress.message);
    formData.append("signature_UserWallet", signedMessage_connectedAddress.signature);

    const signedMessage_O = await SignMessageWithAlias("Timezone");
    formData.append("message_O", signedMessage_O.message);
    formData.append("signature_O", signedMessage_O.signature);

    const signedMessage_objectId = await SignMessageWithAlias(userProfile[0].name.objectId);
    formData.append("message_objectId", signedMessage_objectId.message);
    formData.append("signature_objectId", signedMessage_objectId.signature);

    const signedMessage_Timezone = await SignMessageWithAlias(timezone);
    formData.append("message_Timezone", signedMessage_Timezone.message);
    formData.append("signature_Timezone", signedMessage_Timezone.signature);
      
        

    //var formData = new FormData();
    //formData.append("O", "Timezone");
    //formData.append("objectId", userProfile.objectId);
    //formData.append("Timezone", timezone);

    await axios
      .post("/api/general/updateMyProfile", formData)
      .then((res) => {
        // if (res.status == 201 ) message.success("data successfully updated!");
        // this.fetchExtrashift();
      })
      .catch((err) => {
        // message.error("data profile failed to update ...");
      });
  };

  function saveTimezoneHandler(timezone) {
    updateTimezone(timezone);
    setModelData({ show: false });
  }

  return (
    <Fragment>
      <div className="userTimezone">
        <h4>
          {timezoneAbbrev} - {datetime.unixFmt("hh:mm a").toLowerCase()} local
          time
        </h4>
        {userProfile[0]?.name.userAddress?.toLowerCase() ===
          currentAccount?.toLowerCase() && (
          <i>
            <PencilIc
              onClick={() =>
                setModelData({
                  show: true,
                  type: "modal",
                  title: "Set time zone",
                  body: (
                    <EditTimezone
                      timezone={timezone}
                      setTimezone={setTimezone}
                      saveTimezoneFn={saveTimezoneHandler}
                    />
                  ),
                })
              }
            />
          </i>
        )}
      </div>
    </Fragment>
  );
}

export default UserSelectedTimezon;
