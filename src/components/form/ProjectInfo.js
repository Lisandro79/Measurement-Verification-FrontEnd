import "../../assets/Form.css";
import React, { useState, useEffect } from "react";

function ProjectInfo( props ) {

  const [projectInfoComplete, setProjectInfoComplete] = useState(false);

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
      setProjectInfoComplete(true);
    }
  }, [props.projectData]);

  return (
    <div className="form-component">
      <h1>Project Info</h1>
      <div className="item">
        <h3>Project name</h3>
        <p>Name</p>
        <input onChange={props.handleChange} name="project_name" />
      </div>
      <div className="item">
        <h3>Location of the facility</h3>
        <i>
          Please provide us with the geographical information about your
          building
        </i>
        <p>City</p>
        <input onChange={props.handleChange} name="city" />
        <p>ZIP Code</p>
        <input onChange={props.handleChange} name="zip_code" />
      </div>
      <div className="item">
        <h3>Building type</h3>
        <i>What type of building are you analysing?</i>
        <p>Building type</p>
        <input onChange={props.handleChange} name="building_type" />
      </div>
      <div className="item">
        <h3>Price of energy</h3>
        <i>How much energy costs in kWh?</i>
        <p>Price in kWh</p>
        <input
          onChange={props.handleChange}
          name="price_kWh"
          type="number"
          step="0.01"
        ></input>
      </div>
      <div className="item">
        <h3>Type of retrofit</h3>
        <i>What type of energy efficency measures have been performed?</i>
        <p>Meassures installed</p>
        <input onChange={props.handleChange} name="measures_installed" />
        <p>Date of installation</p>
        <input type="date" onChange={props.handleChange} name="date_installation" />
      </div>
      <button disabled={projectInfoComplete ? false : true} onClick={props.nextFormStep}>Next</button>
    </div>
  );
}

export default ProjectInfo;
