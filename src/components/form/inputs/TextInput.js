import React from "react";
import TextField from "@mui/material/TextField";

const TextInput = (props) => {
  return (
    <TextField
      size="small"
      id="filled-basic"
      variant="filled"
      label={props.label}
      onChange={props.onChange}
      name={props.name}
      value={props.value}
      type={props.type ? props.type : null}
      InputLabelProps={props.InputLabelProps ? props.InputLabelProps : null}
    />
  );
};

export default TextInput;
