import React from "react";
import "../../assets/Form.css";
import { useState, useEffect } from "react";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import TextInput from "./inputs/TextInput";
import DateInput from "./inputs/DateInput";

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
    window.scrollTo(0, 0);
  }, []);

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
          <TextInput
            label={"Project name"}
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
            <TextInput
              label={"City"}
              onChange={props.handleChange}
              name="city"
              value={props.projectData.city}
            />
          </div>
          <div>
            <TextInput
              label={"ZIP Code"}
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
            <TextInput
              label={"Building type"}
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
            <TextInput
              label={"Price in kWh"}
              onChange={props.handleChange}
              name="price_kWh"
              value={props.projectData.price_kWh}
            />
          </div>
        </div>
        <div className="item">
          <h3>Type of retrofit</h3>
          <i>What type of energy efficency measures have been performed?</i>
          <div>
            <TextInput
              label={"Meassures installed"}
              onChange={props.handleChange}
              name="measures_installed"
              value={props.projectData.measures_installed}
            />
            <p>
              <i>Date of installation</i>
            </p>
            <div>
              <DateInput
                label={"Date of installation"}
                onChange={props.handleChange}
                name="date_installation"
                value={props.projectData.date_installation}
              />
            </div>
          </div>
        </div>
        <Button
          sx={{ my: 2 }}
          variant="contained"
          //disabled={fieldsCompleted ? false : true}
          onClick={props.nextFormStep}
        >
          Next
        </Button>
      </div>
    </Box>
  );
}

export default ProjectInfo;
