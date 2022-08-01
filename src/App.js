import React, { useState } from "react";
import "./assets/App.css";
import Navbar from "./components/Navbar";
import BaselineReporting from "./components/form/BaselineReporting";
import Model from "./components/form/Model";
import ProjectInfo from "./components/form/ProjectInfo";

const App = () => {
  const [projectData, setProjectData] = useState({});
  const [formStep, setFormStep] = useState(1);

  const nextFormStep = () => {
    setFormStep(formStep + 1);
  };

  const prevFormStep = () => {
    setFormStep(formStep - 1);
  };

  const handleChange = (e) => {
    const { name, value } = e.target
    setProjectData(current => ({ ...current, [name]: value }));
  };

  const handleDateChange = (e) => {
    const { name, value } = e.target
    setProjectData(current => ({
      ...current,
      dates: {
        ...current.dates,
        [name]: value
      }
    }))
  }

  const getFormComponent = () => {
    switch (formStep) {
      case 1:
        return (
          <ProjectInfo
            handleChange={handleChange}
            nextFormStep={nextFormStep}
          ></ProjectInfo>
        )

      case 2:
        return (
          <BaselineReporting
            handleChange={handleChange}
            handleDateChange={handleDateChange}
            projectData={projectData}
            setProjectData={setProjectData}
            nextFormStep={nextFormStep}
            prevFormStep={prevFormStep}
          ></BaselineReporting>
        )

      case 3:
        return (
          <Model 
          projectData={projectData}
          prevFormStep={prevFormStep}
          ></Model>
        )
    }
  };

  return (
    <div className="app">
      <Navbar></Navbar>
      <div className="tab-selector">
        <h3
          className={formStep === 1 ? "active-form" : null}
        >
          Project info
        </h3>
        <h3
          className={formStep === 2 ? "active-form" : null}
        >
          Baseline & reporting
        </h3>
        <h3
          className={formStep === 3 ? "active-form" : null}
        >
          Model
        </h3>
      </div>
      <div className="form">{getFormComponent()}</div>
    </div>
  );
};

export default App;
