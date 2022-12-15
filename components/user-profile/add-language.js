import Button from "../ui/Button";
import Select from "react-dropdown-select";
import { useState } from "react";

function AddLanguage(props) {
  const {
    languageOptions,
    languageLevelOptions,
    languageAddFn,
  } = props;

  const [addedLanguage, setAddedLanguage] = useState("");
  const [languageLevel, setLanguageLevel] = useState("");

  return (
    <div>
      <div>
        <label>Language</label>
        <Select
          options={languageOptions}
          onChange={(opt) => setAddedLanguage(opt)}
        />
      </div>
      <div className="mt-10">
        <label>Proficiency level</label>
        <Select
          options={languageLevelOptions}
          onChange={(opt) => setLanguageLevel(opt)}
        />
      </div>
      <Button
        classes="button dark small mt-10"
        onClick={() =>
          languageAddFn(addedLanguage[0].value, languageLevel[0].value)
        }
      >
        Add Language
      </Button>
    </div>
  );
}

export default AddLanguage;
