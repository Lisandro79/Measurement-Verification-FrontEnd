import '../assets/Form.css';

const ProjectInfo = () => {
  return (
    <div className="form-component">
      <h1>Project Info</h1>
      <div className="form-component-item">
      </div>
      <div className="form-component-item">
        <h3>Location of the facility</h3>
        <p>Please provide us with the geographical information about your building</p>
      </div>
      <div className="form-component-item">
        <p>City</p>
        <input></input>
        <p>ZIP Code</p>
        <input></input>
      </div>
      <div className="form-component-item">
        <h3>Building type</h3>
        <p>What type of building are you analysing?</p>
      </div>
      <div className="form-component-item">
        <p>Building type</p>
        <input></input>
      </div>
      <div className="form-component-item">
        <h3>Type of retrofit</h3>
        <p>What type of energy efficency measures have been performed?</p>
      </div>
      <div className="form-component-item">
        <p>Meassures installed</p>
        <input></input>
        <p>Date of installation</p>
        <input></input>
      </div>
      <button>Next</button>
    </div>
  );
}

export default ProjectInfo;