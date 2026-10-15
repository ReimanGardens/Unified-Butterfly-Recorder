import React, { useContext } from "react";
import AppColumn from "../components/AppColumn";
import "../css/settings.css";
import { UserPreferencesContext } from "../contexts/UserPreferences/UserPreferences";
import { Button, Form, InputGroup } from "react-bootstrap";
import UserPool from "../UserPool";
import { useNavigate } from "react-router-dom";
import { stateOptions } from "components/Uitilities";
import { FaRegQuestionCircle } from "react-icons/fa";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";

const Settings = () => {
  const curUser = UserPool.getCurrentUser();
  const { 
    setDefSurveyName,
    setDefSurveyorName,
    setDefSurveyType,
    setDefTransectDivisionFormat,
    setDefLocation,
    setDefTemp,
    setDefPollardSectionType,
    setDefPollardSectionNum,
    setDefHabitats,
    setDefWindSpeedType,
    setDefCloudCoverType,
    setDefTransectDistanceMeasurement,
    setDefViewingRadius,

    DefaultSurveyName,
    DefaultSurveyorName,
    DefaultSurveyType,
    DefaultTransectDivisionFormat,
    DefaultLocation,
    DefaultTemp,
    DefaultPollardSectionType,
    DefaultPollardSectionNum,
    DefaultHabitats,
    DefaultWindSpeedType,
    DefaultCloudCoverType,
    DefaultTransectDistanceMeasurement,
    DefaultViewingRadius,
   } = useContext(UserPreferencesContext);

  const handleNewDefaultSurvey = async function (val) {
    await setDefSurveyName(val);
  };

  const handleNewDefaultSurveyor = async function (val) {
    await setDefSurveyorName(val);
  };

  const handleNewDefaultSurveyType = async function (val) {
    await setDefSurveyType(val);
  };

  const handleNewDefaultTransectDivisionFormat = async function (val) {
    await setDefTransectDivisionFormat(val);
  };

  const handleNewDefaultLocation = async function (val) {
    await setDefLocation(val);
  };

  const handleNewDefTemp = async function (val) {
    await setDefTemp(val);
  };

  const handleNewDefPollardSectionType = async function (val) {
    await setDefPollardSectionType(val);
  };

  const handleNewDefWindSpeedType = async function (val) {
    await setDefWindSpeedType(val);
  };

  const handleNewDefCloudCoverType = async function (val) {
    await setDefCloudCoverType(val);
  };

  const onUpdateSectionType = (val) => {
    let copyObj = structuredClone(DefaultHabitats);

    for (let i = 0; i < DefaultPollardSectionNum; i++) {
      if (val === "Alpha") {
        copyObj[String.fromCharCode(i + 65).toUpperCase()] = copyObj[i + 1];
        delete copyObj[i + 1];
      } else {
        copyObj[i + 1] = copyObj[String.fromCharCode(i + 65).toUpperCase()];
        delete copyObj[String.fromCharCode(i + 65).toUpperCase()];
      }
    }

    handleNewDefPollardSectionType(val);
    setDefHabitats(copyObj);
  };

  const handleNewDefPollardSectionNum = async function (val) {
    await setDefPollardSectionNum(val);
  };

  const handleNewDefTransectDistanceMeasurement = async function (val) {
    await setDefTransectDistanceMeasurement(val);
  };

  const handleNewDefViewingRadius = async function (val) {
    await setDefViewingRadius(val);
  };

  const handleNewDefHabitats = async function (index, val) {
    let copyObj = structuredClone(DefaultHabitats);
    copyObj[index] = val;
    await setDefHabitats(copyObj);
  };

  const [open, setOpen] = React.useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const CreateSignOutButton = () => {
    const navigate = useNavigate();
    const signOutAndNavigateToLogin = () => {
      curUser.signOut();
      navigate("/");
    };
    return (
      <Button
        style={{
          backgroundColor: "#24948B",
          color: "#FFFFFF",
          width: "60%",
          fontSize: "130%",
          border: "none",
        }}
        onClick={() => {
          signOutAndNavigateToLogin();
        }}
      >
        Sign Out
      </Button>
    );
  };

  return (
    <>
      <AppColumn>
        <div className="overall" style={{ width: "100%", textAlign: "center" }}>
          <h1>User Preferences</h1>
          <h3>Hello {curUser.username}</h3>
          <CreateSignOutButton />
          <hr />
          <div className="forms">
            <Form className="d-flex flex-column px-4 col-12 col-md-6 gap-4">
              <Form.Group>
                <Form.Label>Default Survey Name</Form.Label>
                <Form.Control
                  style={{
                    backgroundColor: "#D9D9D9",
                    borderRadius: "3vw",
                  }}
                  type="text"
                  placeholder=""
                  value={DefaultSurveyName}
                  onChange={(e) => handleNewDefaultSurvey(e.target.value)}
                />
              </Form.Group>
              <Form.Group>
                <Form.Label>Default Surveyor Name</Form.Label>
                <Form.Control
                  style={{
                    backgroundColor: "#D9D9D9",
                    borderRadius: "3vw",
                  }}
                  type="text"
                  placeholder=""
                  value={DefaultSurveyorName}
                  onChange={(e) => handleNewDefaultSurveyor(e.target.value)}
                />
              </Form.Group>
              <Form.Group>
                <Form.Label>Default Surveyor Type</Form.Label>
                <Form.Select
                  style={{
                    backgroundColor: "#D9D9D9",
                    borderRadius: "3vw",
                    textAlign: "center",
                  }}
                  value={DefaultSurveyType}
                  onChange={(e) => handleNewDefaultSurveyType(e.target.value)}
                >
                  <option value="">Select survey type</option>
                  <option value="Pollard">Pollard</option>
                  <option value="Meandering">Meandering</option>
                </Form.Select>
              </Form.Group>
              <Form.Group>
                <Form.Label>Default Transect Division Format</Form.Label>
                <Form.Select
                  style={{
                    backgroundColor: "#D9D9D9",
                    borderRadius: "3vw",
                    textAlign: "center",
                  }}
                  value={DefaultTransectDivisionFormat}
                  onChange={(e) =>
                    handleNewDefaultTransectDivisionFormat(e.target.value)
                  }
                >
                  <option value="">Select transect division format</option>
                  <option value="Habitat">Habitat</option>
                  <option value="Distance">Distance</option>
                </Form.Select>
              </Form.Group>
              <Form.Group>
                <Form.Label>Default Location</Form.Label>
                <Form.Select
                  style={{
                    backgroundColor: "#D9D9D9",
                    borderRadius: "3vw",
                    textAlign: "center",
                  }}
                  value={DefaultLocation}
                  onChange={(e) => handleNewDefaultLocation(e.target.value)}
                >
                  <option value="">Select State</option>
                  {stateOptions.map((state, index) => (
                    <option key={index} value={state.value}>
                      {state.label}
                    </option>
                  ))}
                </Form.Select>
              </Form.Group>

              <Form.Group>
                <Form.Label>Temp Preference</Form.Label>
                <Form.Select
                  style={{
                    backgroundColor: "#D9D9D9",
                    borderRadius: "3vw",
                    textAlign: "center",
                  }}
                  value={DefaultTemp}
                  onChange={(e) => handleNewDefTemp(e.target.value)}
                >
                  <option value="Celsius">Celsius</option>
                  <option value="Fahrenheit">Fahrenheit</option>
                </Form.Select>
              </Form.Group>

              <Form.Group>
                <Form.Label>Section Type</Form.Label>
                <Form.Select
                  style={{
                    backgroundColor: "#D9D9D9",
                    borderRadius: "3vw",
                    textAlign: "center",
                  }}
                  value={DefaultPollardSectionType}
                  onChange={(e) => onUpdateSectionType(e.target.value)}
                >
                  <option value="">Select transect division format</option>
                  <option value="Alpha">Alpha</option>
                  <option value="Numeric">Numeric</option>
                </Form.Select>
              </Form.Group>

              <Form.Group>
                <Form.Label>Number of Sections</Form.Label>
                <Form.Control
                  style={{
                    backgroundColor: "#D9D9D9",
                    borderRadius: "3vw",
                  }}
                  type="number"
                  placeholder=""
                  value={DefaultPollardSectionNum}
                  onChange={(e) =>
                    handleNewDefPollardSectionNum(e.target.value)
                  }
                />
              </Form.Group>

              <Form.Group>
                <Form.Label>Wind Speed Type</Form.Label>
                <Form.Select
                  style={{
                    backgroundColor: "#D9D9D9",
                    borderRadius: "3vw",
                    textAlign: "center",
                  }}
                  value={DefaultWindSpeedType}
                  onChange={(e) => handleNewDefWindSpeedType(e.target.value)}
                >
                  <option value="">Select wind speed format</option>
                  <option value="Numeric">Numeric</option>
                  <option value="Beaufort">Beaufort</option>
                </Form.Select>
              </Form.Group>

              <Form.Group>
                <Form.Label>Cloud Cover Type</Form.Label>
                <Form.Select
                  style={{
                    backgroundColor: "#D9D9D9",
                    borderRadius: "3vw",
                    textAlign: "center",
                  }}
                  value={DefaultCloudCoverType}
                  onChange={(e) => handleNewDefCloudCoverType(e.target.value)}
                >
                  <option value="">Select cloud cover format</option>
                  <option value="Numeric">Numeric</option>
                  <option value="Text">Text</option>
                </Form.Select>
              </Form.Group>

              <Form.Group>
                <Form.Label>Viewing Radius (meters)</Form.Label>
                <Form.Control
                  style={{
                    backgroundColor: "#D9D9D9",
                    borderRadius: "3vw",
                  }}
                  type="number"
                  placeholder=""
                  value={DefaultViewingRadius}
                  onChange={(e) =>
                    handleNewDefViewingRadius(e.target.value)
                  }
                />
              </Form.Group>

              <Form.Group>
                <Form.Label>Transect Distance Measurement</Form.Label>
                <Form.Control
                  style={{
                    backgroundColor: "#D9D9D9",
                    borderRadius: "3vw",
                  }}
                  type="text"
                  placeholder=""
                  value={DefaultTransectDistanceMeasurement}
                  onChange={(e) =>
                    handleNewDefTransectDistanceMeasurement(e.target.value)
                  }
                />
              </Form.Group>

              {DefaultTransectDivisionFormat === "Habitat" &&
                Array.from({ length: DefaultPollardSectionNum }, (_, index) => {
                  const retVal =
                    DefaultPollardSectionType === "Alpha"
                      ? String.fromCharCode(index + 65).toUpperCase()
                      : String(index + 1);

                  return (
                    <InputGroup key={index}>
                      <InputGroup.Text id="basic-addon1">
                        Habitat {retVal}
                      </InputGroup.Text>
                      <Form.Control
                        type="text"
                        placeholder=""
                        value={DefaultHabitats[retVal]}
                        onChange={(e) =>
                          handleNewDefHabitats(retVal, e.target.value)
                        }
                      />
                    </InputGroup>
                  );
                })}
            </Form>
            {/* HERE */}
            <div style={{ marginTop: "45px" }}>
              Need help?
              <br />
              <FaRegQuestionCircle size={65} onClick={handleClickOpen} />
              <hr />
              <div
                style={{
                  width: "90%",
                  margin: "0 auto",
                  marginTop: "25px",
                  border: "1px solid black",
                  padding: "10px",
                  borderRadius: "15px",
                }}
              >
                The Unified Butterfly Recorder 2.0 is an app developed by seven
                students in Iowa State University's Electrical and Computer
                Engineering Senior Design program in collaboration with the
                Entomology staff at Reiman Gardens.
              </div>
              <Dialog
                open={open}
                onClose={handleClose}
                aria-labelledby="responsive-dialog-title"
              >
                <DialogTitle id="responsive-dialog-title">
                  {"Need a hand?"}
                </DialogTitle>
                <DialogContent>
                  <DialogContentText>
                    A tutorial on how to use UBR can be found here:
                    <br />
                    <br />
                    <a
                      href="https://www.reimangardens.com/collections/insects/unified-butterfly-recorder-app/"
                      target="_blank"
                      rel="noreferrer"
                    >
                      <p style={{ textAlign: "center" }}>UBR Tutorial</p>
                    </a>
                    <br />
                    For any questions regarding UBR, please contact
                    UBR@iastate.edu.
                    <br />
                  </DialogContentText>
                </DialogContent>
                <DialogActions>
                  <Button onClick={handleClose} autoFocus>
                    Close
                  </Button>
                </DialogActions>
              </Dialog>
            </div>
          </div>
        </div>
        <p className="mb-0 text-center">Version 1.0</p>
      </AppColumn>
    </>
  );
};

export default Settings;
