import React, { useState, useEffect } from "react";
import "./assets/App.css";
import Navbar from "./components/Navbar";
import BaselineReporting from "./components/BaselineReporting";
import Model from "./components/Model";
import ProjectInfo from "./components/ProjectInfo";

const App = () => {
  const [showProjectInfo, setShowProjectInfo] = useState(true);
  const [showBaselineReporting, setShowBaselineReporting] = useState(false);
  const [showModel, setShowModel] = useState(false);
  const [projectData, setProjectData] = useState({});

  const handleChange = (e) => {
    const {name, value} = e.target
    setProjectData(current => ({ ...current, [name]: value }));
  };

  const handleDateChange = (e) => {
    const {name, value} = e.target
    setProjectData(current => ({
      ...current,
      dates: {
        ...current.dates,
        [name]: value
      }
    }))
  }


  const clickProjectInfo = () => {
    setShowProjectInfo(true);
    setShowBaselineReporting(false);
    setShowModel(false);
  };

  const clickBaselineReport = () => {
    setShowBaselineReporting(true);
    setShowModel(false);
    setShowProjectInfo(false);
  };

  const clickModel = () => {
    setShowModel(true);
    setShowProjectInfo(false);
    setShowBaselineReporting(false);
  };

  const getFormComponent = () => {
    if (showProjectInfo)
      return (
        <ProjectInfo
          handleChange={handleChange}
          clickBaselineReport={clickBaselineReport}
        ></ProjectInfo>
      );
    if (showBaselineReporting)
      return (
        <BaselineReporting
          handleChange={handleChange}
          handleDateChange={handleDateChange}
          projectData={projectData}
          setProjectData={setProjectData}
          clickModel={clickModel}
        ></BaselineReporting>
      );
    if (showModel) return <Model></Model>;
  };

  return (
    <div className="app">
      <Navbar></Navbar>
      <div className="tab-selector">
        <button
          className={showProjectInfo ? "active-button" : null}
          onClick={clickProjectInfo}
        >
          Project info
        </button>
        <button
          className={showBaselineReporting ? "active-button" : null}
          onClick={clickBaselineReport}
        >
          Baseline & reporting
        </button>
        <button
          className={showModel ? "active-button" : null}
          onClick={clickModel}
        >
          Model
        </button>
      </div>
      <div className="form">{getFormComponent()}</div>
    </div>
  );
};

export default App;
