import React, { useState } from "react";
import { ThemeProvider, createTheme } from '@mui/material/styles';
import "./assets/App.css";
import Navbar from "./components/Navbar";
import BaselineReporting from "./components/form/BaselineReporting";
import Model from "./components/form/Model";
import ProjectInfo from "./components/form/ProjectInfo";

const theme = createTheme({
  typography: {
    fontFamily: ["Anek Malayalam", "sans-serif", "sans-serif"].join(","),
  },
  palette: {
    primary: {
      main: '#31ac9cd7',
      contrastText: "#ffffff"
    },
  },
  
});

const App = () => {
  const [projectData, setProjectData] = useState({});
  const [formStep, setFormStep] = useState(1);
  const [formData, setFormData] = useState({
    project_name: null,
    city: null,
    zip_code: null,
    price_kWh: null,
    measures_installed: null,
    date_installation: null,
    start_baseline: null,
    end_baseline: null,
    start_reporting: null,
    end_reporting: null,
  });

  const nextFormStep = () => {
    setFormStep(formStep + 1);
  };

  const prevFormStep = () => {
    setFormStep(formStep - 1);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProjectData((current) => ({ ...current, [name]: value }));
  };

  const handleDateChange = (e) => {
    const { name, value } = e.target;
    setProjectData((current) => ({
      ...current,
      dates: {
        ...current.dates,
        [name]: value,
      },
    }));
  };

  const getFormComponent = () => {
    switch (formStep) {
      case 1:
        return (
          <ProjectInfo
            projectData={projectData}
            handleChange={handleChange}
            nextFormStep={nextFormStep}
          ></ProjectInfo>
        );

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
        );

      case 3:
        return (
          <Model projectData={projectData} prevFormStep={prevFormStep}></Model>
        );
    }
  };

  return (
    <ThemeProvider theme={theme}>
      <div className="app">
        <Navbar></Navbar>
        <div className="tab-selector">
          <h4 className={formStep === 1 ? "active-form" : null}>
            Project info
          </h4>
          <h4 className={formStep === 2 ? "active-form" : null}>
            Baseline & reporting
          </h4>
          <h4 className={formStep === 3 ? "active-form" : null}>Model</h4>
        </div>
        <div className="form">{getFormComponent()}</div>
      </div>
    </ThemeProvider>
  );
};

export default App;
