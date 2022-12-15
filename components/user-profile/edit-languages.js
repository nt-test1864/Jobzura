import { Fragment, useState } from "react";
import Button from "../ui/Button";
import Select from "react-dropdown-select";
import BinIc from "../icons/Bin";

function EditLanguages(props) {
  const {
    languageOptions,
    languageLevelOptions,
    userLanguages,
    editLanguagesFn,
    closeModelFn,
  } = props;

  const [tmpArrFormattedLanguages, setTmpArrFormattedLanguages] = useState(
    JSON.parse(JSON.stringify(userLanguages))
  );

  const saveEdit = () => {
    let allLanguages = [];
    tmpArrFormattedLanguages.map((i) => {
      allLanguages.push(i.key + ":" + i.val);
    });
    editLanguagesFn(allLanguages.join(","));
  };

  const changeValue = (index, value) => {
    const newArray = [...tmpArrFormattedLanguages];
    newArray[index]["val"] = value[0]["value"];
    setTmpArrFormattedLanguages(newArray);
  };

  const languageDeleteHandler = (index) => {
    // if (confirm("Are you sure?")) {
    const newArray = [...tmpArrFormattedLanguages];
    newArray.splice(index, 1);
    setTmpArrFormattedLanguages(newArray);
    // }
  };

  return (
    <Fragment>
      {tmpArrFormattedLanguages.map((lang, index) => (
        <div key={index} className="editLangRow">
          <div className="rowOptions">
            <div>
              <label>Language</label>
              <Select
                disabled={true}
                options={languageOptions}
                values={[languageOptions.find((opt) => opt.label === lang.key)]}
              />
            </div>
            <div>
              <label>Proficiency Level</label>
              <Select
                options={languageLevelOptions}
                values={[
                  languageLevelOptions.find((opt) => opt.label === lang.val),
                ]}
                onChange={(opt) => changeValue(index, opt)}
              />
            </div>
          </div>
          <div className="rowAction">
            {tmpArrFormattedLanguages.length > 1 && (
              <i>
                <BinIc onClick={() => languageDeleteHandler(index)} />
              </i>
            )}
          </div>
        </div>
      ))}
      <div className="editActions">
        <Button classes="button dark small" onClick={() => saveEdit()}>
          Save Changes
        </Button>
        <Button classes="button default small" onClick={closeModelFn}>
          Cancel
        </Button>
      </div>
    </Fragment>
  );
}

export default EditLanguages;
