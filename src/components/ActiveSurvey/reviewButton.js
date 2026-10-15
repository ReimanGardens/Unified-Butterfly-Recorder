import * as React from 'react';
import { Button } from 'react-bootstrap';
import { FaClipboardList } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

export const ReviewButton = ({surveyObject}) => {
    const navigate = useNavigate();

    const handleChange = () => {
         // 👇️ navigate to /surveyDetails
        //if we nagivate from here display the buttons
        navigate("/auth/surveyDetails", {
            state: { surveyObject: surveyObject, defaultTabKey: "sightings", currentSurveyView: true },
        });
    };

  return (
    <Button
      className="fw-bold"
      onClick={handleChange}
      style={{
        position: "fixed",
        backgroundColor: "#FD5A89",
        border: "none",
        color: "#000000",
        borderRadius: "15px",
        bottom: "80px",
        left: "10px",
      }}
    >
      <FaClipboardList size={20} /> Review
    </Button>
  )
}