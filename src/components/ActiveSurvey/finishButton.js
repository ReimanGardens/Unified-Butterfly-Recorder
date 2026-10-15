import * as React from 'react';
import {useState, useEffect, useContext} from "react";
import { Button } from 'react-bootstrap';
import { FaCheck } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import { Form, InputGroup } from "react-bootstrap";
import { UserPreferencesContext } from "contexts/UserPreferences/UserPreferences";
import { Survey } from 'contexts/surveyContext/surveyContext';

export const FinishButton = ({Survey_Context}) => {
    const navigate = useNavigate();
    const { addEndUserWeatherData } = Survey_Context;

    const handleSubmit = async () => {
      // // 👇️ navigate to /surveyDetails
      const retVal = await Survey_Context.sendSurveyToDatabase();
  
      navigate("/auth/surveyDetails", {
          state: { surveyObject: retVal.data, defaultTabKey: "overview", currentSurveyView: false },
      });
    };

  const [open, setOpen] = React.useState(false);

  const { 
    DefaultWindSpeedType,
    DefaultCloudCoverType,
  } = useContext(UserPreferencesContext);

  // I believe his use effect fixes another race condition where we try to access the survey type
  // before it is added to the Survey_Context from the create_survey page.
  // Now, we are setting it to null if surveyType is null
  // And whenever the value is updated in Survey_Context, this useEffect sets it here.
  useEffect(() => {
    setSurveyType(Survey_Context.surveyObject.generalData?.surveyType);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    Survey_Context.surveyObject.generalData?.surveyType,
  ]);
  
  const [SurveyType, setSurveyType] = useState(Survey_Context.surveyObject.generalData?.surveyType);

  // We give the users the option to record the end weather data
  const [endWindSpeed, setEndWindSpeed] = useState("");
  const [endCloudCover, setEndCloudCover] = useState("");
  const [endTemperature, setEndTemperature] = useState("");

  // This useEffect updates the surveyContext as soon as you change the input in the dialog
  // This helps eliminate the race condition when you finish the survey.
  useEffect(() => {
    addEndUserWeatherData({
      endWindSpeed,
      endCloudCover,
      endTemperature,
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    endWindSpeed,
    endCloudCover,
    endTemperature,
  ]);

  const handleClose = () => {
      setOpen(false);
  };

  const handleOpen = () => {
    setOpen(true);
  };

  return (
    <div>
      <Button
        className="fw-bold"
        onClick={handleOpen}
        style={{
          position: "fixed",
          backgroundColor: "#FD5A89",
          border: "none",
          color: "#000000",
          borderRadius: "15px",
          bottom: "80px",
          right: "10px",
        }}
      >
        Finish <FaCheck size={20} />
      </Button>
      <div>
        <Dialog
          open={open}
          onClose={handleClose}
          aria-labelledby="responsive-dialog-title"
        >
          <DialogTitle id="responsive-dialog-title">
            {"Submit Survey?"}
          </DialogTitle>
          <DialogContent>
            <Form>
              <Form.Label hidden={SurveyType == "Incidental"}>
                You may record the weather at the end of the survey:
              </Form.Label>
              <Form.Label hidden={SurveyType !== "Incidental"}>
                You may continue or finish your incedental survey.
              </Form.Label>
              <Form.Group hidden={DefaultWindSpeedType === "Beaufort" || SurveyType == "Incidental"}>
                <Form.Label>Wind Speed (mph)</Form.Label>
                <Form.Control
                  style={{
                    backgroundColor: "#D9D9D9",
                    borderRadius: "3vw",
                  }}
                  type="number"
                  placeholder=""
                  value={endWindSpeed}
                  onChange={(e) => setEndWindSpeed(e.target.value)}
                />
              </Form.Group>

              <Form.Group hidden={DefaultWindSpeedType !== "Beaufort"|| SurveyType == "Incidental"}>
                <Form.Label>Wind Speed</Form.Label>
                <Form.Select
                    style={{
                      backgroundColor: "#D9D9D9",
                      borderRadius: "3vw",
                    }}
                    value={endWindSpeed}
                    onChange={(e) => setEndWindSpeed(e.target.value)}
                >
                  <option value="">Select wind speed</option>
                  <option value="Calm">Calm</option>
                  <option value="Relatively Still">Relatively Still</option>
                  <option value="Moderately Windy">Moderately Windy</option>
                  <option value="Windy">Windy</option>
                  <option value="Very Windy">Very Windy</option>
                </Form.Select>
              </Form.Group>

              <Form.Group hidden={DefaultCloudCoverType === "Text"|| SurveyType == "Incidental"}>
                <Form.Label>Cloud Cover</Form.Label>
                <Form.Control
                  type="number"
                  style={{
                    backgroundColor: "#D9D9D9",
                    borderRadius: "3vw",
                  }}
                  placeholder=""
                  value={endCloudCover}
                  onChange={(e) => setEndCloudCover(e.target.value)}
                />
              </Form.Group>

              <Form.Group hidden={DefaultCloudCoverType !== "Text"|| SurveyType == "Incidental"}>
                <Form.Label>Cloud Cover</Form.Label>
                <Form.Select
                    style={{
                      backgroundColor: "#D9D9D9",
                      borderRadius: "3vw",
                    }}
                    value={endCloudCover}
                    onChange={(e) => setEndCloudCover(e.target.value)}
                >
                  <option value="">Select Cloud Cover</option>
                  <option value="Clear">Clear</option>
                  <option value="Partly Cloudy">Partly Cloudy</option>
                  <option value="Mostly Cloudy">Mostly Cloudy</option>
                  <option value="Overcast">Overcast</option>
                  <option value="Hazy">Hazy</option>
                </Form.Select>
              </Form.Group>

              <Form.Group hidden={SurveyType == "Incidental"}>
                <Form.Label>Temperature (F)</Form.Label>
                <Form.Control
                  style={{
                    backgroundColor: "#D9D9D9",
                    borderRadius: "3vw",
                  }}
                  type="number"
                  placeholder=""
                  value={endTemperature}
                  onChange={(e) => setEndTemperature(e.target.value)}
                />
              </Form.Group>
            </Form>
          </DialogContent>
          <DialogActions>
            <Button width='50%' style={{ backgroundColor: '#24948b', border: '#24948b'}} onClick={handleClose} autoFocus>
              No, Continue Survey
            </Button>
            <Button style={{backgroundColor: '#fd5a89', border: '#fd5a89'}} onClick={handleSubmit} autoFocus>
              Yes, Submit
            </Button>
          </DialogActions>
        </Dialog>
      </div>
    </div>
  )
}