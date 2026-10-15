import React, { useContext, useEffect, useState } from "react";
import { Button, Col, Container, Image, Row, Tab, Tabs } from "react-bootstrap";
import { useLocation, useNavigate } from "react-router-dom";
import { FaArrowLeft, FaCheck } from "react-icons/fa";
import { SurveyContext } from "contexts/surveyContext/surveyContext";
import { CSVLink } from "react-csv";
import Sightings from "./Sightings";
import SurveyOverviewPage from "./surveyOverviewPage";
import { FinishButton } from "components/ActiveSurvey/finishButton";
import { flatMap } from "lodash";

export default function SurveyDetailsPage() {
  const surveyContext = useContext(SurveyContext);

  // I am fetching the timer seperatly from the rest of the surveyData so that it counts up on the page dynamically
  const { getPersistedSurvey, surveyActive } = surveyContext;

  const { state } = useLocation();

  const defaultKey = state.defaultTabKey;
  const currentSurveyView = state.currentSurveyView;

  const [surveyData, setSurveyData] = useState(null);


  const SurveyObj = useContext(SurveyContext);
  const surveyType = SurveyObj.generalData.surveyType;

  /* Persistent storage for survey object */
  useEffect(() => {
    getPersistedSurvey().then((res) => {
      if (res.data && currentSurveyView) {
        setSurveyData(res.data);
      } else {
        setSurveyData(state.surveyObject);
      }
    });

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div
      className="text-center px-3 mb-5"
      style={{ paddingTop: "70px", paddingBottom: "75px" }}
    >
      {surveyData && (
        <Tabs
          defaultActiveKey={defaultKey}
          id="uncontrolled-tab-example"
          className="mb-3"
          justify
        >
          <Tab eventKey="overview" title="Overview">
            <SurveyOverviewPage
              surveyObject={surveyData}
              currentSurveyView={currentSurveyView}
            />
          </Tab>
          <Tab eventKey="sightings" title="Sightings">
            <Sightings
              surveyObject={surveyData}
              currentSurveyView={currentSurveyView}
            />
          </Tab>
        </Tabs>
      )}

      {surveyData && surveyType !== "Incidental" && (!currentSurveyView || !surveyActive) && (
        <div className="mt-3 d-flex flex-row gap-3 justify-content-center">
          <CSVLink
            data={[
              {
                ...surveyData?.generalData?.habitats,
                ...surveyData?.generalData,
                ...surveyData?.userWeatherData,
                ...surveyData?.endUserWeatherData,
                startTime: surveyData?.startTime,
                endTime: surveyData?.endTime,
                surveyDuration: surveyData?.surveyDuration,
                ...surveyData?.apiWeatherData,
              },
            ]}
            filename={`${surveyData?.generalData?.surveyName}_${
              surveyData?.currentDate.split("T")[0]
            }_Info.csv`}
          >
            <Button style={{ backgroundColor: "#24948B", border: "none" }}>
              DOWNLOAD Survey Info CSV
            </Button>
          </CSVLink>

          <CSVLink
            data={(surveyData?.sightingsArray).reverse()}
            filename={`${surveyData?.generalData?.surveyName}_${
              surveyData?.currentDate.split("T")[0]
            }_Sightings.csv`}
          >
            <Button style={{ backgroundColor: "#24948B", border: "none" }}>
              DOWNLOAD Sightings CSV
            </Button>
          </CSVLink>

          <CSVLink
            data={surveyData?.breadcrumbArray}
            filename={`${surveyData?.generalData?.surveyName}_${
              surveyData?.currentDate.split("T")[0]
            }_Breadcrumbs.csv`}
          >
            <Button style={{ backgroundColor: "#24948B", border: "none" }}>
              DOWNLOAD Breadcrumbs CSV
            </Button>
          </CSVLink>
        </div>
      )}
        {surveyData && surveyType === "Incidental" && (!currentSurveyView || !surveyActive) && (
            <CSVLink
                data={surveyData?.sightingsArray.map(sighting => ({
                    comment: sighting.comment,
                    commonfamily: sighting.commonfamily,
                    commonsubfamily: sighting.commonsubfamily,
                    genericname: sighting.genericname,
                    scientificfamily: sighting.scientificfamily,
                    scientificname: sighting.scientificname,
                    scientificsubfamily: sighting.scientificsubfamily,
                    section: sighting.section,
                    sightingID:sighting.sightingID,
                    time:sighting.time,
                    xCoord:sighting.xCoord,
                    yCoord:sighting.yCoord,
                    Humidity: surveyData.apiWeatherData.Humidity,
                    Pressure:surveyData.apiWeatherData.Pressure,
                    cloudCover:surveyData.apiWeatherData.cloudCover,
                    feels_like:surveyData.apiWeatherData.feels_like,
                    lat: surveyData.apiWeatherData.lat,
                    lon:surveyData.apiWeatherData.lon,
                    mainTemp:surveyData.apiWeatherData.mainTemp,
                    sunrise:surveyData.apiWeatherData.sunrise,
                    sunset:surveyData.apiWeatherData.sunset,
                    windDirection:surveyData.apiWeatherData.windDirection,
                    windSpeed:surveyData.apiWeatherData.windSpeed
                }))}
                filename={`${surveyData?.generalData?.surveyName}_${
                    surveyData?.currentDate.split("T")[0]
                }_Incidental.csv`}
            >
                <Button style={{ backgroundColor: "#24948B", border: "none" }}>
                    DOWNLOAD Incidental CSV
                </Button>
            </CSVLink>
        )}
        {surveyActive && (
        <>
          <ContinueButton />
          {currentSurveyView && <FinishButton Survey_Context={surveyContext} />}
        </>
      )}
    </div>
  );
}

const ContinueButton = () => {
  const navigate = useNavigate();
  const navigateToActiveSurveyButterflies = () => {
    // 👇️ navigate to /surveyDetails
    navigate("/auth/activeSurveyButterflies");
  };
  return (
    <Button
      className="fw-bold"
      onClick={navigateToActiveSurveyButterflies}
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
      <FaArrowLeft size={20} /> Continue
    </Button>
  );
};
