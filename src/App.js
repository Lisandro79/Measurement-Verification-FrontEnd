import React, { useState } from "react";
import './assets/App.css';
import Navbar from './components/Navbar';
import BaselineReport from './components/BaselineReport';
import Model from './components/Model';
import ProjectInfo from './components/ProjectInfo';

const App = () => {

  const [showProjectInfo, setShowProjectInfo] = useState(true);
  const [showBaselineReport, setShowBaselineReport] = useState(false);
  const [showModel, setShowModel] = useState(false);
  const [buildingData, setBuildingData] = useState(null);
  


  const clickProjectInfo = () => {
    setShowProjectInfo(true)
    setShowBaselineReport(false)
    setShowModel(false)
  }

  const clickBaselineReport = () => {
    setShowBaselineReport(true)
    setShowModel(false)
    setShowProjectInfo(false)
  }

  const clickModel = () => {
    setShowModel(true)
    setShowProjectInfo(false)
    setShowBaselineReport(false)
  }

  const getFormComponent = () => {
    if(showProjectInfo) 
    return <ProjectInfo></ProjectInfo>
    if(showBaselineReport) 
    return <BaselineReport setBuildingData={setBuildingData} buildingData={buildingData}></BaselineReport>
    if(showModel) 
    return <Model></Model>
  }
  

  return (
    <div className="App">
      <Navbar></Navbar>
      <div className='tab-selector'>
      <button className={showProjectInfo ? 'active-button' : null} onClick={clickProjectInfo}>Project info</button>
      <button className={showBaselineReport ? 'active-button' : null} onClick={clickBaselineReport}>Baseline & reporting</button>
      <button className={showModel ? 'active-button' : null} onClick={clickModel}>Model</button>
      </div>
      <div className='form'>
      {getFormComponent()}
      </div>
      
      
    </div>
  );
}

export default App;
