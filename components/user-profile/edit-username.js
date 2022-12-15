import { useState } from "react";
import Button from "../ui/Button";

function EditUsername(props) {
  const { username, setUsername, saveUsername } = props;
  const [iptval, setIptval] = useState(username);
  const [error, setError] = useState(false);

  const handleSaveUsername = () => {
    if (iptval) {
      saveUsername(iptval);
      setUsername(iptval);
    } else {
      setError(true);
    }
  };

  return (
    <div>
      <div>
        <label>Your username</label>
        <input
          type="text"
          value={iptval}
          placeholder="set your username..."
          className="formControl"
          onChange={(e) => setIptval(e.target.value)}
        />
        {error === true && (
          <div className="errorText mt-5">Username should not be empty.</div>
        )}
      </div>
      <div className="mt-10">
        <Button
          classes="button small dark"
          onClick={handleSaveUsername}
        >
          Save
        </Button>
      </div>
    </div>
  );
}

export default EditUsername;
