import { Fragment, useState } from "react";
import axios from "axios";
import PlusIc from "./../icons/Plus";
import PencilIc from "./../icons/Pencil";
import ModalUi from "./../ui/ModalUi";
import AddLanguage from "./add-language";
import EditLanguages from "./edit-languages";
import { GetWallet_NonMoralis } from '../../JS/local_web3_Moralis.js';
import { SignMessageWithAlias } from "../../JS/auth/messageSigning";
import { CheckAndCreateAlias } from "../../JS/auth/AliasAuthentication";

function UserLanguages(props) {
  const {
    modelData,
    setModelData,
    closeModelFn,
    userDetails,
    userProfile,
    currentAccount,
  } = props;

  const languageOptions = [
    // {
    //   label: "Select",
    //   value: "",
    // },
    {
      label: "English",
      value: "English",
    },
    {
      label: "Mandarin",
      value: "Mandarin",
    },
    {
      label: "Hindi",
      value: "Hindi",
    },
    {
      label: "Spanish",
      value: "Spanish",
    },
    {
      label: "French",
      value: "French",
    },
    {
      label: "Arabic",
      value: "Arabic",
    },
    {
      label: "Bengali",
      value: "Bengali",
    },
    {
      label: "Russian",
      value: "Russian",
    },
    {
      label: "Portuguese",
      value: "Portuguese",
    },
    {
      label: "Indonesian",
      value: "Indonesian",
    },
  ];

  const languageLevelOptions = [
    {
      label: "Basic",
      value: "Basic",
    },
    {
      label: "Conversational",
      value: "Conversational",
    },
    {
      label: "Fluent",
      value: "Fluent",
    },
    {
      label: "Native or Bilingual",
      value: "Native or Bilingual",
    },
  ];

  const strToFormated = (str) => {
    let spliteLang = str == null || str == "" ? [] : str.split(",");
    let tmpFormattedLanguages = spliteLang.map((item) => {
      const el = item.split(":");
      const obj = {};
      obj["key"] = el[0];
      obj["val"] = el[1];
      return obj;
    });
    return tmpFormattedLanguages;
  };

  const [formattedLanguages, setFormattedLanguages] = useState(
    strToFormated(userProfile[0]?.name?.Languages)
  );

  const updateUserLanguage = async (allLanguages) => {

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

    const signedMessage_O = await SignMessageWithAlias("Languages");
    formData.append("message_O", signedMessage_O.message);
    formData.append("signature_O", signedMessage_O.signature);

    const signedMessage_objectId = await SignMessageWithAlias(userProfile[0].name.objectId);
    formData.append("message_objectId", signedMessage_objectId.message);
    formData.append("signature_objectId", signedMessage_objectId.signature);

    const signedMessage_Languages = await SignMessageWithAlias(allLanguages);
    formData.append("message_Languages", signedMessage_Languages.message);
    formData.append("signature_Languages", signedMessage_Languages.signature);
        
      
        

    //var formData = new FormData();
    //formData.append("O", "Languages");
    //formData.append("objectId", userProfile.objectId);
    //formData.append("Languages", allLanguages);

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

  const languageAddHandler = (addedLanguage, languageLevel) => {
    const langAsyc = async () => {
      let selectedLang = addedLanguage,
        selectedLangLevel = languageLevel;
      let tmpArrFormattedLanguages = JSON.parse(
        JSON.stringify(formattedLanguages)
      );

      const itemIndex = tmpArrFormattedLanguages.findIndex(
        (o) => o.key === selectedLang
      );

      if (itemIndex > -1) {
        tmpArrFormattedLanguages[itemIndex].val = selectedLangLevel;
      } else {
        const obj = {};
        obj["key"] = selectedLang;
        obj["val"] = selectedLangLevel;
        tmpArrFormattedLanguages.push(obj);
      }

      let allLanguages = [];
      tmpArrFormattedLanguages.map((i) => {
        allLanguages.push(i.key + ":" + i.val);
      });
      setFormattedLanguages(strToFormated(allLanguages.join(",")));
      updateUserLanguage(allLanguages.join(","));
    };

    langAsyc();
    setModelData({
      show: false,
    });
  };

  const languageEditHandler = (editedLanguages) => {
    const langAsyc = async () => {
      setFormattedLanguages(strToFormated(editedLanguages));
      await updateUserLanguage(editedLanguages); // allLanguages.join(",")
    };

    langAsyc();
    setModelData({
      show: false,
    });
  };

  console.log("formattedLanguages", formattedLanguages);

  return (
    <Fragment>
      <div className="userLanguages">
        <div className="blockHeader">
          <h3>Languages</h3>

          {userProfile[0]?.name.userAddress?.toLowerCase() ===
            currentAccount.toLowerCase() && (
            <div className="blockActions">
              <i>
                <PlusIc
                  onClick={() =>
                    setModelData({
                      show: true,
                      type: "modal",
                      title: "Add language",
                      body: (
                        <AddLanguage
                          languageOptions={languageOptions}
                          languageLevelOptions={languageLevelOptions}
                          languageAddFn={languageAddHandler}
                        />
                      ),
                    })
                  }
                />
              </i>
              {formattedLanguages.length > 0 && (
                <i>
                  <PencilIc
                    onClick={() =>
                      setModelData({
                        show: true,
                        type: "modal",
                        title: "Edit languages",
                        body: (
                          <EditLanguages
                            languageOptions={languageOptions}
                            languageLevelOptions={languageLevelOptions}
                            userLanguages={formattedLanguages}
                            editLanguagesFn={languageEditHandler}
                            closeModelFn={closeModelFn}
                          />
                        ),
                      })
                    }
                  />
                </i>
              )}
            </div>
          )}
        </div>
        <div className="languagesList">
          {formattedLanguages.map((item, index) => (
            <div key={index} className="languageItem">
              <strong>{item["key"]}: </strong>
              <span>{item["val"]}</span>
            </div>
          ))}
        </div>
      </div>

      <ModalUi content={modelData} closeModelFn={closeModelFn} />
    </Fragment>
  );
}

export default UserLanguages;
