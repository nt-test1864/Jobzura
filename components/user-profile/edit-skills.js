import { useState } from "react";
import Select from "react-dropdown-select";
import Button from "../ui/Button";

function EditSkills(props) {
  const { skillsOptions, closeModelFn, saveMySkillsFn, mySkills } = props;
  const strToSelectFormated = (str) => {
    let spliteSkills =
      str == null || str == ""
        ? []
        : str.split(",").map((i) => {
            return { label: i, value: i };
          });
    return spliteSkills;
  };
  const [editedSkills, setEditedSkills] = useState(
    strToSelectFormated(mySkills)
  );

  const changeValue = (value) => {
    const newArray = [...value];
    setEditedSkills(newArray);
  };

  const saveEdit = () => {
    let allSkills = [];
    editedSkills.map((i) => {
      allSkills.push(i.value);
    });
    saveMySkillsFn(allSkills.join(","));
  };

  return (
    <div>
      <div>
        <label>Skills</label>
        <Select
          multi={true}
          options={skillsOptions}
          values={editedSkills}
          onChange={(opt) => changeValue(opt)}
        />
      </div>
      <div className="editActions">
        <Button classes="button dark small" onClick={() => saveEdit()}>
          Save Changes
        </Button>
        <Button classes="button default small" onClick={closeModelFn}>
          Cancel
        </Button>
      </div>
    </div>
  );
}

export default EditSkills;
