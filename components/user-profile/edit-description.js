import { useState } from "react";
import Button from "../ui/Button";

function EditDescription(props) {
  const { userDescription, setUserDescription, saveUserDescriptionFn } = props;

  const [iptval, setIptval] = useState(userDescription);
  const [error, setError] = useState(false);
  console.log("iptval", iptval);

  const handleDescription = () => {
    if (iptval) {
      saveUserDescriptionFn(iptval);
      setUserDescription(iptval);
    } else {
      setError(true);
    }
  };

  return (
    <div>
      <div>
        <label>Your description</label>
        <textarea
          rows="8"
          defaultValue={iptval}
          placeholder="Set bio..."
          className="formControl textarea"
          onChange={(e) => setIptval(e.target.value)}
        />
        {error === true && (
          <div className="errorText mt-5">Textarea should not be empty.</div>
        )}
      </div>
      <div className="mt-10">
        <Button
          classes="button small dark"
          onClick={handleDescription}
        >
          Save
        </Button>
      </div>
    </div>
  );
}

export default EditDescription;
