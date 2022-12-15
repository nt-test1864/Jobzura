import { useState } from "react";
import Button from "../ui/Button";

function EditHeadline(props) {
  const { userHeadline, setUserHeadline, saveUserHeadlineFn } = props;
  const [iptval, setIptval] = useState(userHeadline);
  const [error, setError] = useState(false);

  const handleSaveHadline = () => {
    if (iptval) {
      saveUserHeadlineFn(iptval);
      setUserHeadline(iptval);
    } else {
      setError(true);
    }
  };

  return (
    <div>
      <div>
        <label>Your title</label>
        <input
          type="text"
          value={iptval}
          placeholder="set your title..."
          className="formControl"
          onChange={(e) => setIptval(e.target.value)}
        />
        {error === true && (
          <div className="errorText mt-5">Headline should not be empty.</div>
        )}
      </div>
      <div className="mt-10">
        <Button
          classes="button small dark"
          onClick={handleSaveHadline}
        >
          Save
        </Button>
      </div>
    </div>
  );
}

export default EditHeadline;
