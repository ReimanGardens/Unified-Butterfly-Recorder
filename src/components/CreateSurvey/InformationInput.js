import React, {useState, useEffect, useContext} from "react";
import { stateOptions } from "components/Uitilities";
import { UserPreferencesContext } from "contexts/UserPreferences/UserPreferences";
import { Form, InputGroup } from "react-bootstrap";
import {SurveyContext} from "../../contexts/surveyContext/surveyContext";

const InformationInput = ({ setFormData, surveyActive, surveyObject }) => {
  const { setPollardSectionQuantity, setPollardNumOrAlpha } = useContext(SurveyContext);
  const { 
    DefaultSurveyName,
    DefaultSurveyorName,
    DefaultSurveyType,
    DefaultTransectDivisionFormat,
    DefaultLocation,
    DefaultPollardSectionType,
    DefaultPollardSectionNum,
    DefaultHabitats,
    DefaultWindSpeedType,
    DefaultCloudCoverType,
    DefaultTransectDistanceMeasurement,
    DefaultViewingRadius,
  } = useContext(UserPreferencesContext);

  const [SurveyName, setSurveyName] = useState(
    surveyActive ? surveyObject.generalData.surveyName : DefaultSurveyName
  );
  const [SurveyType, setSurveyType] = useState(
    surveyActive ? surveyObject.generalData.surveyType : DefaultSurveyType
  );
  const [NumOfSurveyors, setNumOfSurveyors] = useState(
    surveyActive ? surveyObject.generalData.numberOfSurveyors : 1
  );
  const [NamesOfSurveyors, setNamesOfSurveyors] = useState(
    surveyActive ? surveyObject.generalData.namesOfSurveyors : DefaultSurveyorName
  );
  const [Location, setLocation] = useState(
    surveyActive ? surveyObject.generalData.surveyState : DefaultLocation
  );
  const [Comments, setComments] = useState(
    surveyActive ? surveyObject.generalData.comments : ""
  );
  const [HabitatType, setHabitatType] = useState(
    surveyActive ? surveyObject.generalData.habitatType : ""
  );
  const [HabitatCondition, setHabitatCondition] = useState(
    surveyActive ? surveyObject.generalData.habitatCondition : ""
  );
  const [WindSpeed, setWindSpeed] = useState(
    surveyActive ? surveyObject.userWeatherData.windSpeed : ""
  );
  const [CloudCover, setCloudCover] = useState(
    surveyActive ? surveyObject.userWeatherData.cloudCover : ""
  );
  const [Temperature, setTemperature] = useState(
    surveyActive ? surveyObject.userWeatherData.temperature : ""
  );
  const [Transect, setTransect] = useState(
    surveyActive ? surveyObject.generalData.transect : DefaultTransectDivisionFormat
  );
  const [SectionType, setSectionType] = useState(
    surveyActive ? surveyObject.generalData.sectionType : DefaultPollardSectionType
  );
  const [NumSections, setNumSections] = useState(
    surveyActive ? surveyObject.generalData.numSections : DefaultPollardSectionNum
  );
  const [Habitats, setHabitats] = useState(
    surveyActive ? surveyObject.generalData.habitats : DefaultHabitats
  );
  const [TransectDistance, setTransectDistance] = useState(
    surveyActive ? surveyObject.generalData.transectDistance : DefaultTransectDistanceMeasurement
  );
  const [ViewingRadius, setViewingRadius] = useState(
    surveyActive ? surveyObject.generalData.viewingRadius : DefaultViewingRadius
  );
  const [EngagementLevel, setEngagementLevel] = useState(
    surveyActive ? surveyObject.generalData.engagementLevel : 3
  );

  const onUpdateSectionType = (val) => {
    let copyObj = structuredClone(Habitats)

    for(let i = 0; i < NumSections; i++){
      if(val === "Alpha"){
        copyObj[String.fromCharCode(i + 65).toUpperCase()] = copyObj[i + 1];
        delete copyObj[i + 1];
      }
      else{
        copyObj[i + 1] = copyObj[String.fromCharCode(i + 65).toUpperCase()];
        delete copyObj[String.fromCharCode(i + 65).toUpperCase()];
      }
    }

    setSectionType(val)
    setHabitats(copyObj)
  }

  const onUpdateHabitat = (index, val) => {
    let copyObj = structuredClone(Habitats)
    copyObj[index] = val
    setHabitats(copyObj)
  }

  useEffect(() => {
    setFormData({
      SurveyName,
      SurveyType,
      NumOfSurveyors,
      NamesOfSurveyors,
      Location,
      Comments,
      HabitatType,
      HabitatCondition,
      WindSpeed,
      CloudCover,
      Temperature,
      Transect,
      SectionType,
      NumSections,
      Habitats,
      TransectDistance,
      ViewingRadius,
      EngagementLevel,
    });
    setNumSections(NumSections);
    setPollardSectionQuantity(NumSections); // Sets number of Pollard sections in SurveyContext
    setSectionType(SectionType);
    setPollardNumOrAlpha(SectionType);

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    SurveyName,
    SurveyType,
    NumOfSurveyors,
    NamesOfSurveyors,
    Location,
    Comments,
    HabitatType,
    HabitatCondition,
    WindSpeed,
    CloudCover,
    Temperature,
    Transect,
    SectionType,
    NumSections,
    Habitats,
    TransectDistance,
    ViewingRadius,
    EngagementLevel
  ]);

  return (
    <div className="d-flex justify-content-center mb-5">
      <Form className="d-flex flex-column px-4 col-12 col-md-6 gap-4">
        <Form.Group>
          <Form.Label>Survey Name *</Form.Label>
          <Form.Control
            style={{
              backgroundColor: "#D9D9D9",
              borderRadius: "3vw",
            }}
            type="text"
            placeholder=""
            value={SurveyName}
            onChange={(e) => setSurveyName(e.target.value)}
          />
        </Form.Group>
        <Form.Group>
          <Form.Label>Survey Type *</Form.Label>
          <Form.Select
            disabled={surveyActive}
            style={{
              backgroundColor: "#D9D9D9",
              borderRadius: "3vw",
            }}
            value={SurveyType}
            onChange={(e) => {
              setSurveyType(e.target.value);
            }}
          >
            <option value="">Select survey type</option>
            <option value="Pollard">Pollard</option>
            <option value="Meandering">Meandering</option>
            <option value="Incidental">Incidental</option>
          </Form.Select>
        </Form.Group>
        <Form.Group hidden={SurveyType !== "Pollard" || SurveyType == "Incidental"}>
          <Form.Label>Section Type *</Form.Label>
          <Form.Select
            disabled={surveyActive}
            style={{
              backgroundColor: "#D9D9D9",
              borderRadius: "3vw",
            }}
            value={SectionType}
            onChange={(e) => {
              onUpdateSectionType(e.target.value);
            }}
          >
            <option value="">Select section type</option>
            <option value="Alpha">Alpha</option>
            <option value="Numeric">Numeric</option>
          </Form.Select>
        </Form.Group>
        <Form.Group hidden={SurveyType !== "Pollard" || SurveyType == "Incidental"}>
          <Form.Label>Number of Sections *</Form.Label>
          <Form.Control
            disabled={surveyActive}
            style={{
              backgroundColor: "#D9D9D9",
              borderRadius: "3vw",
            }}
            type="number"
            placeholder=""
            value={NumSections}
            onChange={(e) => {
              setNumSections(e.target.value);
            }}
          />
        </Form.Group>
        <Form.Group hidden={SurveyType !== "Pollard" || SurveyType == "Incidental"}>
          <Form.Label>Transect division format *</Form.Label>
          <Form.Select
            disabled={surveyActive}
            style={{
              backgroundColor: "#D9D9D9",
              borderRadius: "3vw",
            }}
            value={Transect}
            onChange={(e) => setTransect(e.target.value)}
          >
            <option value="">Select transect division format</option>
            <option value="Habitat">Habitat</option>
            <option value="Distance">Distance</option>
          </Form.Select>
        </Form.Group>
        <Form.Group hidden={SurveyType == "Incidental"}>
          <Form.Label>Number of Surveyors *</Form.Label>
          <Form.Control
            style={{
              backgroundColor: "#D9D9D9",
              borderRadius: "3vw",
            }}
            type="number"
            placeholder=""
            value={NumOfSurveyors}
            onChange={(e) => setNumOfSurveyors(e.target.value)}
          />
        </Form.Group>
        <Form.Group hidden={SurveyType == "Incidental"}>
          <Form.Label>Names of Surveyors *</Form.Label>
          <Form.Control
            style={{
              backgroundColor: "#D9D9D9",
              borderRadius: "3vw",
            }}
            type="text"
            placeholder=""
            value={NamesOfSurveyors}
            onChange={(e) => setNamesOfSurveyors(e.target.value)}
          />
        </Form.Group>
        <Form.Group hidden={SurveyType == "Incidental"}>
          <Form.Label>Location *</Form.Label>
          <Form.Select
            disabled={surveyActive}
            placeholder=""
            value={Location}
            style={{
              backgroundColor: "#D9D9D9",
              borderRadius: "3vw",
            }}
            onChange={(e) => setLocation(e.target.value)}
          >
            <option value="">Select State</option>
            {stateOptions.map((state) => (
              <option key={state.value} value={state.value} defaultValue="">
                {state.label}
              </option>
            ))}
          </Form.Select>
        </Form.Group>
        {Transect === "Distance" &&
        <Form.Group hidden={SurveyType == "Incidental"}>
          <Form.Label>Habitat Type</Form.Label>
          <Form.Control
            style={{
              backgroundColor: "#D9D9D9",
              borderRadius: "3vw",
            }}
            type="text"
            placeholder=""
            value={HabitatType}
            onChange={(e) => setHabitatType(e.target.value)}
          />
        </Form.Group>}
        <Form.Group hidden={SurveyType == "Incidental"}>
          <Form.Label>Habitat Condition</Form.Label>
          <Form.Control
            style={{
              backgroundColor: "#D9D9D9",
              borderRadius: "3vw",
            }}
            type="text"
            placeholder=""
            value={HabitatCondition}
            onChange={(e) => setHabitatCondition(e.target.value)}
          />
        </Form.Group>
        <Form.Group hidden={DefaultWindSpeedType === "Beaufort" || SurveyType == "Incidental"}>
          <Form.Label>Wind Speed (mph) *</Form.Label>
          <Form.Control
            style={{
              backgroundColor: "#D9D9D9",
              borderRadius: "3vw",
            }}
            type="number"
            placeholder=""
            value={WindSpeed}
            onChange={(e) => setWindSpeed(e.target.value)}
          />
        </Form.Group>

        <Form.Group hidden={DefaultWindSpeedType !== "Beaufort"|| SurveyType == "Incidental"}>
          <Form.Label>Wind Speed *</Form.Label>
          <Form.Select
              disabled={surveyActive}
              style={{
                backgroundColor: "#D9D9D9",
                borderRadius: "3vw",
              }}
              value={WindSpeed}
              onChange={(e) => setWindSpeed(e.target.value)}
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
          <Form.Label>Cloud Cover *</Form.Label>
          <Form.Control
            type="number"
            style={{
              backgroundColor: "#D9D9D9",
              borderRadius: "3vw",
            }}
            placeholder=""
            value={CloudCover}
            onChange={(e) => setCloudCover(e.target.value)}
          />
        </Form.Group>

        <Form.Group hidden={DefaultCloudCoverType !== "Text"|| SurveyType == "Incidental"}>
          <Form.Label>Cloud Cover *</Form.Label>
          <Form.Select
              disabled={surveyActive}
              style={{
                backgroundColor: "#D9D9D9",
                borderRadius: "3vw",
              }}
              value={CloudCover}
              onChange={(e) => setCloudCover(e.target.value)}
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
          <Form.Label>Temperature (F) *</Form.Label>
          <Form.Control
            style={{
              backgroundColor: "#D9D9D9",
              borderRadius: "3vw",
            }}
            type="number"
            placeholder=""
            value={Temperature}
            onChange={(e) => setTemperature(e.target.value)}
          />
        </Form.Group>
        <Form.Group hidden={SurveyType == "Incidental"}>
          <Form.Label>Comments</Form.Label>
          <Form.Control
            style={{
              backgroundColor: "#D9D9D9",
              borderRadius: "3vw",
            }}
            as="textarea"
            placeholder=""
            value={Comments}
            onChange={(e) => setComments(e.target.value)}
          />
        </Form.Group>
        {SurveyType === "Pollard" && 
          <>
          {Transect === "Habitat" ? 
            Array.from({ length: NumSections }, (_, index) => { 
              const retVal = SectionType === "Alpha" ? String.fromCharCode(index + 65).toUpperCase() : String(index+1)

              return <InputGroup key={index}>
                <InputGroup.Text >
                  Habitat {retVal}
                </InputGroup.Text>
                <Form.Control
                  type="text"
                  placeholder=""
                  value={Habitats[retVal]}
                  onChange={(e) =>
                    onUpdateHabitat(retVal, e.target.value)
                  }
                />
              </InputGroup>
            })
            :
            <Form.Group>
              <Form.Label>Transect Distance Measurement</Form.Label>
              <Form.Control
                style={{
                  backgroundColor: "#D9D9D9",
                  borderRadius: "3vw",
                }}
                type="text"
                placeholder=""
                value={TransectDistance}
                onChange={(e) => setTransectDistance(e.target.value)}
              />
            </Form.Group>
          }
          </>
        }
        <Form.Group>
          <Form.Label>Viewing Radius (meters)</Form.Label>
          <Form.Control
            disabled={surveyActive}
            style={{
              backgroundColor: "#D9D9D9",
              borderRadius: "3vw",
            }}
            type="number"
            placeholder=""
            value={ViewingRadius}
            onChange={(e) => setViewingRadius(e.target.value)}
          />
        </Form.Group>
        <Form.Group>
          <Form.Label>Level of Engagement (1 is low)</Form.Label>
          <Form.Select
              style={{
                backgroundColor: "#D9D9D9",
                borderRadius: "3vw",
              }}
              value={EngagementLevel}
              onChange={(e) => setEngagementLevel(e.target.value)}
          >
            <option value="1">1</option>
            <option value="2">2</option>
            <option value="3">3</option>
            <option value="4">4</option>
            <option value="5">5</option>
          </Form.Select>
        </Form.Group>
      </Form>
    </div>
  );
};

export default InformationInput;
