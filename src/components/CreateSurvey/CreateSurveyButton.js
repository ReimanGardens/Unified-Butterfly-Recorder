import React, { useContext } from "react";
import { Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { FaArrowRight } from "react-icons/fa";
import { SurveyContext } from "../../contexts/surveyContext/surveyContext";
import { AccountContext } from "../../contexts/Auth/Account";
import { swalError, swalIsLoading } from "components/Uitilities";
import { ListContext } from "contexts/listContext";

const CreateSurveyButton = ({ formData, surveyActive, surveyObject }) => {
  const { addSurveyFunction, editSurveyFunction } = useContext(SurveyContext);
  const { persistSortedListByState } = useContext(ListContext);
  const { currentUsername, currentUserEmail } = useContext(AccountContext);
  const navigate = useNavigate();

  const onStartSurvey = () => {
    if (
      validateForm([
        "SurveyName",
        "SurveyType",
        "NumOfSurveyors",
        "NamesOfSurveyors",
        "Location",
        "WindSpeed",
        "CloudCover",
        "Temperature",
      ])
      &&
      (!(formData.SurveyType === "Pollard")
      ||
      validateForm([
        "SectionType",
        "Transect"
      ]))
        || (formData.SurveyType === "Incidental")
    ) {
      swalIsLoading()
      persistSortedListByState(formData?.Location)
      const initialSurveyData = {
        currentDate: new Date().toISOString(),
        generalData: {
          surveyName: formData?.SurveyName,
          numberOfSurveyors: formData?.NumOfSurveyors,
          namesOfSurveyors: formData?.NamesOfSurveyors,
          surveyType: formData?.SurveyType,
          numSections: formData?.NumSections,
          sectionType: formData?.SectionType,
          transect: formData?.Transect,
          surveyDate: new Date().toISOString(),
          comments: formData?.Comments,
          habitatType: formData?.HabitatType,
          habitatCondition: formData?.HabitatCondition,
          surveyState: formData?.Location,
          habitats: formData?.Habitats,
          transectDistance: formData?.TransectDistance,
          viewingRadius: formData?.ViewingRadius,
          engagementLevel: formData?.EngagementLevel,
        },
        surveyorInfo: {
          userName: currentUsername,
          userEmail: currentUserEmail,
        },
        userWeatherData: {
          userWindSpeed: formData?.WindSpeed,
          userCloudCover: formData?.CloudCover,
          userTemperature: formData?.Temperature,
        },
      };
      addSurveyFunction(
        initialSurveyData?.generalData?.surveyName,
        initialSurveyData
      ).then((res) => {
        navigate("/auth/activeSurveyButterflies");
      });
    } else {
      swalError("Please fill out all required form inputs");
    }
  };

  const onEditSurvey = () => {
    if (
      validateForm([
        "SurveyName",
        "SurveyType",
        "NumOfSurveyors",
        "NamesOfSurveyors",
        "Location",
        "WindSpeed",
        "CloudCover",
        "Temperature",
      ])
      &&
      (!(formData.SurveyType === "Pollard")
      ||
      validateForm([
        "SectionType",
        "Transect"
      ]))
    ) {
      const editedSurveyData = {
        currentDate: surveyObject.currentDate,
        generalData: {
          surveyName: formData?.SurveyName,
          numberOfSurveyors: formData?.NumOfSurveyors,
          namesOfSurveyors: formData?.NamesOfSurveyors,
          surveyType: formData?.SurveyType,
          numSections: formData?.NumSections,
          sectionType: formData?.SectionType,
          transect: formData?.Transect,
          surveyDate: surveyObject.currentDate,
          comments: formData?.Comments,
          habitatType: formData?.HabitatType,
          habitatCondition: formData?.HabitatCondition,
          surveyState: formData?.Location,
          habitats: formData?.Habitats,
          transectDistance: formData?.TransectDistance,
        },
        surveyorInfo: {
          userName: currentUsername,
          userEmail: currentUserEmail,
        },
        userWeatherData: {
          windSpeed: formData?.WindSpeed,
          cloudCover: formData?.CloudCover,
          temperature: formData?.Temperature,
        },
      };
      editSurveyFunction(
        editedSurveyData
      ).then((res) => {
        navigate("/auth/surveyDetails", {
          state: { surveyObject: null, defaultTabKey: "overview", currentSurveyView: true },
        });
      });
    } else {
      swalError("Please fill out all required form inputs");
    }
  };

  function validateForm(keyList) {
    return !keyList.some(
      (item) => formData[item] === "" || formData[item] === null
    );
  }

  return (
    <Button
      className="fw-bold"
      onClick={() => {
        if(!surveyActive){
          onStartSurvey()
        }
        else{
          onEditSurvey()
        }
      }}
      style={{
        position: "fixed",
        backgroundColor: "#FD5A89",
        border: "none",
        color: "#000000",
        borderRadius: "15px",
        bottom: "80px",
        right: "10px",
        zIndex: "1"
      }}
    >
      <FaArrowRight size={20} /> {surveyActive ? "Continue":"Start Survey"}
    </Button>
  );
};

export default CreateSurveyButton;
