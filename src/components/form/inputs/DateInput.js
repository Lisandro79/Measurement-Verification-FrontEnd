import React from "react";
import TextField from "@mui/material/TextField";

const DateInput = (props) => {
  return (
    <TextField
      type="datetime-local"
      step="3600"
      name={props.name}
      onChange={props.onChange}
      label={props.label}
      InputLabelProps={{
        shrink: true,
      }}
      size="small"
      value={props.value}
    />
  );
};

export default DateInput;
