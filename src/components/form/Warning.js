import Alert from "@mui/material/Alert";

const Warning = ({ message }) => {
    if (message === null) {
      return null
    }
  
    return (
        <div>
        <Alert severity="warning">{message}</Alert>
      </div>
    )
  }

export default Warning