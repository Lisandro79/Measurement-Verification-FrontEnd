import "../assets/Form.css";
import React, { useState, useEffect } from "react";

function ProjectInfo({ handleChange }) {
  return (
    <div className="form-component">
      <h1>Project Info</h1>
      <div className="form-component-item" />
      <div className="form-component-item">
        <h3>Project name</h3>
      </div>
      <div className="form-component-item">
        <p>Name</p>
        <input onChange={handleChange} name="project_name" />
      </div>
      <div className="form-component-item">
        <h3>Location of the facility</h3>
        <p>
          Please provide us with the geographical information about your
          building
        </p>
      </div>
      <div className="form-component-item">
        <p>City</p>
        <input onChange={handleChange} name="city" />
        <p>ZIP Code</p>
        <input />
      </div>
      <div className="form-component-item">
        <h3>Building type</h3>
        <p>What type of building are you analysing?</p>
      </div>
      <div className="form-component-item">
        <p>Building type</p>
        <input onChange={handleChange} name="building_type" />
      </div>
      <div className="form-component-item">
        <h3>Type of retrofit</h3>
        <p>What type of energy efficency measures have been performed?</p>
      </div>
      <div className="form-component-item">
        <p>Meassures installed</p>
        <input onChange={handleChange} name="measures_installed" />
        <p>Date of installation</p>
        <input type="date" onChange={handleChange} name="date_installation" />
      </div>
      <button>Next</button>
    </div>
  );
}

export default ProjectInfo;
