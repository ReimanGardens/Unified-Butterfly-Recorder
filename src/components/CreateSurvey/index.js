import React, { useState, useContext, useEffect } from "react";
import { SurveyContext } from "../../contexts/surveyContext/surveyContext";
import CreateSurveyButton from "./CreateSurveyButton";
import InformationInput from "./InformationInput";
import { useLocation } from "react-router-dom";


const CreateSurveyComponent = () => {
  const [formData, setFormData] = useState([]);
  const Survey_Context = useContext(SurveyContext);
  
  const {state} = useLocation()
  const [surveyActive, setSurveyActive] = useState(state?.active)
  const [surveyObject, setSurveyObject] = useState(state?.surveyObject)

  useEffect(() => {
    Survey_Context.getPersistedSurvey();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div
      style={{ marginTop: "66px", marginBottom: "76px" }}
      className="d-flex flex-column gap-5"
    >
      <CreateSurveyButton formData={formData} surveyActive={surveyActive} surveyObject={surveyObject} />
      <InformationInput setFormData={setFormData} surveyActive={surveyActive} surveyObject={surveyObject} />
    </div>
  );
};

export default CreateSurveyComponent;
