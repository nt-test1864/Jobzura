import { Fragment, useState } from "react";
import axios from "axios";
import PencilIc from "../icons/Pencil";
import ModalUi from "../ui/ModalUi";
import EditDescription from "./edit-description";
import EditHeadline from "./edit-headline";
import { GetWallet_NonMoralis } from '../../JS/local_web3_Moralis.js';
import { SignMessageWithAlias } from "../../JS/auth/messageSigning";
import { CheckAndCreateAlias } from "../../JS/auth/AliasAuthentication";

function UserDescription(props) {
  const { userProfile, currentAccount } = props;

  const [userHeadline, setUserHeadline] = useState(userProfile.Headline);
  const [userDescription, setUserDescription] = useState(
    userProfile.Description
  );
  const [modelData, setModelData] = useState({
    show: false,
    type: "alert",
    status: "Error",
    message: "",
  });

  const updateUserHeadline = async (headline) => {

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

    const signedMessage_O = await SignMessageWithAlias("Description");
    formData.append("message_O", signedMessage_O.message);
    formData.append("signature_O", signedMessage_O.signature);

    const signedMessage_objectId = await SignMessageWithAlias(userProfile[0].name.objectId);
    formData.append("message_objectId", signedMessage_objectId.message);
    formData.append("signature_objectId", signedMessage_objectId.signature);

    const signedMessage_Headline = await SignMessageWithAlias("Headline");
    formData.append("message_Headline", signedMessage_Headline.message);
    formData.append("signature_Headline", signedMessage_Headline.signature);
    
  
    //var formData = new FormData();
    //formData.append("O", "Headline");
    //formData.append("objectId", userProfile.objectId);
    //formData.append("Headline", headline);

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

  const updateUserDescription = async (description) => {

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

    const signedMessage_O = await SignMessageWithAlias("Description");
    formData.append("message_O", signedMessage_O.message);
    formData.append("signature_O", signedMessage_O.signature);

    const signedMessage_objectId = await SignMessageWithAlias(userProfile[0].name.objectId);
    formData.append("message_objectId", signedMessage_objectId.message);
    formData.append("signature_objectId", signedMessage_objectId.signature);

    const signedMessage_Description = await SignMessageWithAlias("description");
    formData.append("message_Description", signedMessage_Description.message);
    formData.append("signature_Description", signedMessage_Description.signature);



    //var formData = new FormData();
    //formData.append("O", "Description");
    //formData.append("objectId", userProfile.objectId);
    //formData.append("Description", description);

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

  function closeModelDataHandler() {
    setModelData({
      show: false,
    });
  }

  function saveUserHeadlineHandler(headline) {
    // console.log("your title has been saved!");
    updateUserHeadline(headline);
    setModelData({ show: false });
  }

  function saveUserDescriptionHandler(description) {
    // console.log("your description has been saved!",description);
    updateUserDescription(description);
    setModelData({ show: false });
  }

  return (
    <Fragment>
      <div className="userDescription">
        <div className="userHeadline">
          {userHeadline ? (
            <h3>{userHeadline}</h3>
          ) : (
            <div className="blockPlaceholder">Add your headline...</div>
          )}
          {userProfile.userAddress.toLowerCase() === currentAccount.toLowerCase() &&  <i>
            <PencilIc
              onClick={() =>
                setModelData({
                  show: true,
                  type: "modal",
                  title: "Edit your title",
                  body: (
                    <EditHeadline
                      userHeadline={userHeadline}
                      setUserHeadline={setUserHeadline}
                      saveUserHeadlineFn={saveUserHeadlineHandler}
                      closeModelFn={closeModelDataHandler}
                      userProfile={userProfile}
                    />
                  ),
                })
              }
            />
          </i>}
        </div>
        <div className="userDescContent">
          {userDescription ? (
            <div className="descriptionWrraper">{userDescription}</div>
          ) : (
            <div className="blockPlaceholder">Add your bio...</div>
          )}
          {userProfile.userAddress.toLowerCase() === currentAccount.toLowerCase() && 
          <i>
            <PencilIc
              onClick={() =>
                setModelData({
                  show: true,
                  type: "modal",
                  title: "Overview",
                  body: (
                    <EditDescription
                      userDescription={userDescription}
                      setUserDescription={setUserDescription}
                      saveUserDescriptionFn={saveUserDescriptionHandler}
                      closeModelFn={closeModelDataHandler}
                    />
                  ),
                })
              }
            />
          </i> }
        </div>
      </div>

      <ModalUi content={modelData} closeModelFn={closeModelDataHandler} />
    </Fragment>
  );
}

export default UserDescription;
