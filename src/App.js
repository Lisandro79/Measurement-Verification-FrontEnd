import React, { useEffect, useState } from "react";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import "./assets/App.css";
import Navbar from "./components/layout/Navbar";
import BaselineReporting from "./components/form/BaselineReporting";
import Model from "./components/form/Model";
import ProjectInfo from "./components/form/ProjectInfo";

const theme = createTheme({
  typography: {
    fontFamily: ["Anek Malayalam", "sans-serif", "sans-serif"].join(","),
  },
  palette: {
    primary: {
      main: "#31ac9cd7",
      contrastText: "#ffffff",
    },
  },
});

const App = () => {
  const [formStep, setFormStep] = useState(1);
  const [projectData, setProjectData] = useState({
    project_name: "",
    city: "",
    zip_code: "",
    building_type: "",
    price_kWh: "",
    measures_installed: "",
    date_installation: "",
    dates: {
      start_baseline: "",
      end_baseline: "",
      start_reporting: "",
      end_reporting: "",
    },
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
    let { name, value } = e.target;
    value = value.slice(0, -2) + "00"; //rounded hour
    setProjectData((current) => ({
      ...current,
      dates: {
        ...current.dates,
        [name]: value,
      },
    }));
  };

  const getFormStep = () => {
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
        <div className="form">{getFormStep()}</div>
      </div>
    </ThemeProvider>
  );
};

export default App;
