import React, { useMemo, useState } from "react";
import spacetime from "spacetime";
import TimezoneSelect, { allTimezones } from "react-timezone-select";
import Button from "../ui/Button";

function EditTimezone(props) {
  const { timezone, setTimezone, saveTimezoneFn } = props;
  const [iptval, setIptval] = useState(timezone);

  const handleTimezone = () => {
    const tzValue = typeof iptval === "string" ? iptval : iptval.value;
    saveTimezoneFn(tzValue);
    setTimezone(tzValue);
  };

  const [datetime, setDatetime] = useState(spacetime.now());
  useMemo(() => {
    const tzValue = typeof iptval === "string" ? iptval : iptval.value;
    setDatetime(datetime.goto(tzValue));
  }, [iptval]);

  return (
    <div>
      <div className="customTimezonePicker">
        <label>Set Timezone</label>
        {/* https://github.com/ndom91/react-timezone-select */}
        <TimezoneSelect
          value={iptval}
          onChange={setIptval}
          labelStyle="abbrev"
          className="customDropdownControl"
          classNamePrefix="customDropdownControl"
        />

        <label>
          Current Date / Time in
          {typeof iptval === "string"
            ? iptval.split("/")[1]
            : iptval.value.split("/")[1]}
        </label>
        <br />
        {datetime.unixFmt("dd.MM.YY hh:mm a").toLowerCase()}
      </div>

      <div className="mt-10">
        <Button classes="button small dark" onClick={handleTimezone}>
          Save
        </Button>
      </div>
    </div>
  );
}

export default EditTimezone;
