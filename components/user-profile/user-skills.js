import { Fragment, useState } from "react";
import axios from "axios";
import PencilIc from "../icons/Pencil";
import ModalUi from "../ui/ModalUi";
import EditSkills from "./edit-skills";
import { GetWallet_NonMoralis } from '../../JS/local_web3_Moralis.js';
import { SignMessageWithAlias } from "../../JS/auth/messageSigning";
import { CheckAndCreateAlias } from "../../JS/auth/AliasAuthentication";

function UserSkills(props) {
  const { userProfile, currentAccount } = props;
  const [modelData, setModelData] = useState({
    show: false,
    type: "alert",
    status: "Error",
    message: "",
  });

  const [mySkills, setMySkills] = useState(userProfile[0]?.name?.Skills);

  const skillsOptions = [
    {
      label: "IT",
      value: "IT",
    },
    {
      label: "Web Development",
      value: "Web Development",
    },
    {
      label: "Youtuber",
      value: "Youtuber",
    },
    {
      label: "Twitter Promotion",
      value: "Twitter Promotion",
    },
    {
      label: "Test Skills 1",
      value: "Test Skills 1",
    },
    {
      label: "Test Skills 2",
      value: "Test Skills 2",
    },
    {
      label: "Test Skills 3",
      value: "Test Skills 3",
    },
    {
      label: "Test Skills 4",
      value: "Test Skills 4",
    },
    {
      label: "Test Skills 5",
      value: "Test Skills 5",
    },
    {
      label: "Test Skills 6",
      value: "Test Skills 6",
    },
  ];

  function closeModelFn() {
    setModelData({
      show: false,
    });
  }

  const updateMySkills = async (skills) => {

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

    const signedMessage_O = await SignMessageWithAlias("Skills");
    formData.append("message_O", signedMessage_O.message);
    formData.append("signature_O", signedMessage_O.signature);

    const signedMessage_objectId = await SignMessageWithAlias(userProfile[0].name.objectId);
    formData.append("message_objectId", signedMessage_objectId.message);
    formData.append("signature_objectId", signedMessage_objectId.signature);

    const signedMessage_Skills = await SignMessageWithAlias(skills);
    formData.append("message_Skills", signedMessage_Skills.message);
    formData.append("signature_Skills", signedMessage_Skills.signature);
            
      
        
    //var formData = new FormData();
    //formData.append("O", "Skills");
    //formData.append("objectId", userProfile.objectId);
    //formData.append("Skills", skills);

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

  function saveMySkillsHandler(skills) {
    setMySkills(skills);
    updateMySkills(skills);
    setModelData({ show: false });
  }

  return (
    <Fragment>
      <div className="userSkills">
        <div className="blockHeader">
          <h3>Skills</h3>

          {userProfile[0]?.name.userAddress?.toLowerCase() ===
            currentAccount.toLowerCase() && (
            <div className="blockActions">
              <i>
                <PencilIc
                  onClick={() =>
                    setModelData({
                      show: true,
                      type: "modal",
                      title: "Edit skills",
                      body: (
                        <EditSkills
                          skillsOptions={skillsOptions}
                          closeModelFn={closeModelFn}
                          saveMySkillsFn={saveMySkillsHandler}
                          mySkills={mySkills}
                        />
                      ),
                    })
                  }
                />
              </i>
            </div>
          )}
        </div>

        {mySkills && (
          <div className="skillsTags">
            {mySkills.split(",").map((item, index) => (
              <span key={index}>{item}</span>
            ))}
          </div>
        )}
      </div>
      
      <ModalUi content={modelData} closeModelFn={closeModelFn} />
    </Fragment>
  );
}

export default UserSkills;
