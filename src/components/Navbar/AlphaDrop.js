import React, { useContext } from "react";
import { Form } from "react-bootstrap";
import { SurveyContext } from "../../contexts/surveyContext/surveyContext";

const AlphaNumericDropdown = ({n}) => {
  const { currentPollardSection } = useContext(SurveyContext);
  const { changePollardSection } = useContext(SurveyContext);
  const handleNewPollardSection = function (val) {
    changePollardSection(val);
  };

  const options = [];
  for (let i = 1; i <= n; i++) {
    const optionValue = String.fromCharCode(i + 64); // convert number to corresponding letter
    options.push(
      <option key={i} value={optionValue}>
        {optionValue}
      </option>
    );
  }

  return (
    <Form.Group>
      <Form.Select
        style={{
          backgroundColor: "#D9D9D9",
          width: "auto",
          height: "90%",
          textAlign: "center",
        }}
        value={currentPollardSection}
        onChange={(e) => handleNewPollardSection(e.target.value)}
      >
        {options}
      </Form.Select>
    </Form.Group>
  );
};

export default AlphaNumericDropdown;
