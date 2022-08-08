import "../../assets/Form.css";
import React, { useState, useEffect } from "react";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Box from "@mui/material/Box";

function ProjectInfo(props) {
  
  const [fieldsCompleted, setFieldsCompleted] = useState(false);

  useEffect(() => {
    if (
      props.projectData.project_name &&
      props.projectData.city &&
      props.projectData.zip_code &&
      props.projectData.building_type &&
      props.projectData.price_kWh &&
      props.projectData.measures_installed &&
      props.projectData.date_installation
    ) {
      setFieldsCompleted(true);
    }
  }, [props.projectData]);

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  return (
    <Box
      component="form"
      sx={{
        "& .MuiTextField-root": { my: 1.5, width: "25ch" },
      }}
      noValidate
      autoComplete="off"
    >
      <div className="form-component">
        <h1>Project Info</h1>
        <div className="item">
          <h3>Project name</h3>
          <TextField
            size="small"
            id="filled-basic"
            label="Project name"
            variant="filled"
            onChange={props.handleChange}
            name="project_name"
            value={props.projectData.project_name}
          />
        </div>
        <div className="item">
          <h3>Location of the facility</h3>
          <i>
            Please provide us with the geographical information about your
            building
          </i>
          <div>
            <TextField
              size="small"
              id="filled-basic"
              label="City"
              variant="filled"
              onChange={props.handleChange}
              name="city"
              value={props.projectData.city}
            />
          </div>
          <div>
            <TextField
              size="small"
              id="filled-basic"
              label="ZIP Code"
              variant="filled"
              onChange={props.handleChange}
              name="zip_code"
              value={props.projectData.zip_code}
            />
          </div>
        </div>
        <div className="item">
          <h3>Building type</h3>
          <i>What type of building are you analysing?</i>
          <div>
            <TextField
              size="small"
              id="filled-basic"
              label="Building type"
              variant="filled"
              onChange={props.handleChange}
              name="building_type"
              value={props.projectData.building_type}
            />
          </div>
        </div>
        <div className="item">
          <h3>Price of energy</h3>
          <i>How much energy costs in kWh?</i>
          <div>
            <TextField
              size="small"
              id="filled-basic"
              label="Price in kWh"
              variant="filled"
              onChange={props.handleChange}
              name="price_kWh"
              type="number"
              value={props.projectData.price_kWh}
            />
          </div>
        </div>
        <div className="item">
          <h3>Type of retrofit</h3>
          <i>What type of energy efficency measures have been performed?</i>
          <div>
            <TextField
              size="small"
              id="filled-basic"
              label="Meassures installed"
              variant="filled"
              onChange={props.handleChange}
              name="measures_installed"
              value={props.projectData.measures_installed}
            />
            <p>
              <i>Date of installation</i>
            </p>
            <div>
              <TextField
                type="date"
                onChange={props.handleChange}
                name="date_installation"
                label="Date of installation"
                InputLabelProps={{
                  shrink: true,
                }}
                value={props.projectData.date_installation}
                size="small"
              />
            </div>
          </div>
        </div>
        <Button
          sx={{ my: 2 }}
          variant="contained"
          disabled={fieldsCompleted ? false : true}
          onClick={props.nextFormStep}
        >
          Next
        </Button>
        <Button
          sx={{ my: 2 }}
          variant="contained"
          onClick={props.nextFormStep}
        >
          Next
        </Button>
      </div>
    </Box>
  );
}

export default ProjectInfo;
