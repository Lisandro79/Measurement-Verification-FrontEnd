import "../assets/Form.css";

function ProjectInfo({ handleChange, clickBaselineReport }) {
  return (
    <div className="form-component">
      <h1>Project Info</h1>
      <div className="item">
        <h3>Project name</h3>
        <p>Name</p>
        <input onChange={handleChange} name="project_name" />
      </div>
      <div className="item">
        <h3>Location of the facility</h3>
        <i>
          Please provide us with the geographical information about your
          building
        </i>
        <p>City</p>
        <input onChange={handleChange} name="city" />
        <p>ZIP Code</p>
        <input onChange={handleChange} name="zip_code" />
      </div>
      <div className="item">
        <h3>Building type</h3>
        <i>What type of building are you analysing?</i>
        <p>Building type</p>
        <input onChange={handleChange} name="building_type" />
      </div>
      <div className="item">
        <h3>Price of energy</h3>
        <i>How much energy costs in kWh?</i>
        <p>Price in kWh</p>
        <input
          onChange={handleChange}
          name="price_kWh"
          type="number"
          step="0.01"
        ></input>
      </div>
      <div className="item">
        <h3>Type of retrofit</h3>
        <i>What type of energy efficency measures have been performed?</i>
        <p>Meassures installed</p>
        <input onChange={handleChange} name="measures_installed" />
        <p>Date of installation</p>
        <input type="date" onChange={handleChange} name="date_installation" />
      </div>
      <button onClick={clickBaselineReport}>Next</button>
    </div>
  );
}

export default ProjectInfo;
