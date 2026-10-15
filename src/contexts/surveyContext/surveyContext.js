import React, { useState, createContext, useEffect, useContext } from "react";
import { set, get, clear } from "idb-keyval";
import config from "config";
import { swalSuccess } from "components/Uitilities";
import { swalIsLoading } from "components/Uitilities";
import { OpenWeather } from "components/WeatherAPI/OpenWeather";
import { swalError } from "components/Uitilities";

import { AccountContext } from "../Auth/Account";
import { StringTimer } from "components/Timer/ParseSecondsTimer";

const SurveyContext = createContext();

const Survey = ({ children }) => {
  const { currentUsername } = useContext(AccountContext);

  /* Get today's date */
  let today = new Date().toLocaleDateString();

  /* Store surveyActive in useState React Hook, and create handler "setSurveyActive" to toggle surveyActive  */
  const [surveyActive, setSurveyActive] = useState(false);

  /* Store surveyPaused in useState React Hook, and create handler "toggleSurveyPause" to toggle surveyActive  */
  const [surveyPaused, setSurveyPaused] = useState(false);

  /* Store the timer value of the survey in seconds. It is incremented with the useEffect function below */
  const [timer, setTimer] = useState(0);

  /* The time the survey started */
  const [startTime, setStartTime] = useState(0);

  /* Store searchBar in useState React Hook, and create handler "toggleSearchBar" to toggle searchBar  */
  const [searchBar, toggleSearch] = useState(false);

  /* Store if survey is Pollard in useState React Hook, and create handler "setIsPollard" to toggle isPollard  */
  const [isPollard, setIsPollard] = useState(false);

  /* Store currentDate in useState React Hook, and create handler "setCurrentDate" to modify currentDate  */
  const [currentDate, setCurrentDate] = useState(today);

  /* Store surveyState in useState React Hook, and create handler "setSurveyState" to modify surveyState */
  const [surveyState, setSurveyState] = useState("IA");

  /* Store currentPollardSection in useState React Hook, and create handler "setCurrentPollardSection" to modify currentPollardSection */
  const [currentPollardSection, setCurrentPollardSection] = useState("");

  /* Store pollardSectionQuantity in useState React Hook, and create handler "setPollardSectionQuantity" to modify pollardSectionQuantity */
  const [pollardSectionQuantity, setPollardSectionQuantity] = useState(3);

  const [pollardNumOrAlpha, setPollardNumOrAlpha] = useState("");

  /* Store generalData in useState React Hook, and create handler "setGeneralData" to modify generalData  */
  const [generalData, setGeneralData] = useState({
    surveyName: "defaultSurveyName",
    numberOfSurveyors: 1,
    namesOfSurveyors: "",
    numSections: 5,
    sectionType: "Numeric",
    surveyType: "defaultSurveyType",
    surveyDate: today,
    surveyState: "IA",
    comments: "default comment",
    habitatType: "defaultHabitat",
    habitatCondition: "defaultCondition",
  });

  /* Store surveyorInfo in useState React Hook, and create handler "setSurveyorInfo" to modify surveyorInfo */
  const [surveyorInfo, setSurveyorInfo] = useState({
    userName: "defaultUser",
    userEmail: "defaultEmail",
  });

  /* Store sightingsArray in useState React Hook, and create handler "setSightingsArray" to modify sightingsArray  */
  const [sightingsArray, setSightingsArray] = useState([]);

  /* Store breadcrumbArray in useState React Hook, and create handler "setBreadcrumbArray" to modify breadcrumbArray  */
  const [breadcrumbArray, setBreadcrumbArray] = useState([]);

  /* Store userWeatherData in useState React Hook, and create handler "setUserWeatherData" to modify userWeatherData  */
  const [userWeatherData, setUserWeatherData] = useState({
    windSpeed: "15",
    cloudCover: "some",
    temperature: "77",
  });

    /* Store endUserWeatherData in useState React Hook, and create handler "setEndUserWeatherData" to modify endUserWeatherData  */
    const [endUserWeatherData, setEndUserWeatherData] = useState({
      endWindSpeed: "",
      endCloudCover: "",
      endTemperature: "",
    });

  /* Store apiWeatherData in useState React Hook, and create handler "setApiWeatherData" to modify apiWeatherData  */
  const [apiWeatherData, setApiWeatherData] = useState({});

  /* Store surveyObject in useState React Hook, and create handler "setSurveyObject" to modify surveyObject  */
  const [surveyObject, setSurveyObject] = useState({});

  const [currentSurveyName, setCurrentSurveyName] = useState("");

  var surveyObj = {
    currentDate,
    generalData,
    surveyorInfo,
    sightingsArray,
    breadcrumbArray,
    apiWeatherData,
    userWeatherData,
    endUserWeatherData,
    timer,
    startTime,
    surveyDuration: StringTimer(timer),
  };

  const [location, setLocation] = useState(null);

  const handleSuccess = (position) => {
    setLocation({
      latitude: position.coords.latitude,
      longitude: position.coords.longitude,
    });
  };

  const handleError = (error) => {
    console.log(error);
  };

  /* Grabs current location every 5 seconds */
  useEffect(() => {
    let intervalId;
    if (surveyActive && !surveyPaused) {
      intervalId = setInterval(() => {
        navigator.geolocation.getCurrentPosition(handleSuccess, handleError, {enableHighAccuracy: true});
      }, 5000);
    }
    return () => clearInterval(intervalId);
  }, [surveyPaused, surveyActive]);

  /* Appends breadcrumb when location changes. Location is updated at most every 5 seconds. Note: breadcrumbs are only appended while survey is active and not paused. */
  useEffect(() => {
    if (surveyActive === true && surveyPaused === false) {
      appendBreadcrumb();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location]);

  /* Any time the objects in the dependency array at the bottom of the useEffect hook are updated, the entire useEffect function is executed. This upates the surveyObj and the IDXDB. */
  useEffect(
    () => {
      if (currentSurveyName !== "" && currentSurveyName !== null) {
        var tempObj = {
          currentDate,
          generalData,
          surveyorInfo,
          sightingsArray,
          breadcrumbArray,
          apiWeatherData,
          userWeatherData,
          endUserWeatherData,
          timer,
          startTime,
          surveyDuration: StringTimer(timer),
        };

        surveyObj.currentDate = currentDate;
        surveyObj.generalData = generalData;
        surveyObj.surveyorInfo = surveyorInfo;
        surveyObj.sightingsArray = sightingsArray;
        surveyObj.breadcrumbArray = breadcrumbArray;
        surveyObj.apiWeatherData = apiWeatherData;
        surveyObj.userWeatherData = userWeatherData;
        surveyObj.endUserWeatherData = endUserWeatherData;
        surveyObj.timer = timer;
        surveyObj.startTime = startTime;
        surveyObj.surveyDuration = StringTimer(timer);

        setSurveyObject(tempObj);

        set(currentSurveyName, tempObj)
          .then(() => console.log("Successfully updated IDXDB."))
          .catch((err) => console.log("Failed updating IDXDB, error:" + err));
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [
      currentDate,
      generalData,
      surveyorInfo,
      sightingsArray,
      breadcrumbArray,
      apiWeatherData,
      userWeatherData,
      endUserWeatherData,
      timer,
    ]
  );

  /* This function implements the timer of the survey, counting up when the survey is active and not paused */
  useEffect(() => {
    let intervalId;
    if (surveyActive && !surveyPaused) {
      intervalId = setInterval(() => {
        setTimer((timer) => timer + 1);
      }, 1000);
    }
    return () => clearInterval(intervalId);
  }, [surveyPaused, surveyActive]);

  /* ------------------------------------ */
  /* ------------------------------------ */
  /* ------------------------------------ */
  /* ------------------------------------ */
  /* ------------------------------------ */
  /* ------------------------------------ */

  /* Allows consumers of the Survey Context to: toggle the surveyActive variable, and therefore toggle active surveys */
  async function toggleSurveyActive(status) {
    await set("surveyActive", status).then((res) => {
      setSurveyActive(status);
    });
  }

  /* Allows consumers of the Survey Context to: toggle the surveyPaused variable, and therefore toggle the pause button */
  async function toggleSurveyPause() {
    setSurveyPaused((prevState) => {
      const prev = !prevState;
      set("surveyPaused", prev);
      return prev;
    });
  }

  /* Allows consumers of the Survey Context to: toggle the searchBar variable, and therefore toggle the search bar */
  const toggleSearchBar = () => {
    toggleSearch(!searchBar);
  };

  /* Allows consumers of the Survey Context to: set survey date (currentDate) */
  async function setSurveyDate(newDate) {
    setCurrentDate(newDate);
  }

  /* Allows consumers of the Survey Context to: set Pollard survey state/section */
  async function changePollardSection(pollState) {
    console.log("Changing pollard state to: " + pollState);
    await set("currentPollardSection", pollState).then(() => {
      setCurrentPollardSection(pollState);
    });
  }

  /* Allows consumers of the Survey Context to: append sightings to the sightingsArray */
  async function appendSightings(newSighting) {
    // console.log(newSighting)
    const {
      genericname,
      scientificname,
      commonsubfamily,
      scientificsubfamily,
      commonfamily,
      scientificfamily,
      number,
      xCoord,
      yCoord,
    } = newSighting;

    setSightingsArray(prevState => {
      if (prevState.length === 0) {
        return [
          {
            sightingID: 0,
            genericname: genericname,
            scientificname: scientificname,
            commonsubfamily: commonsubfamily,
            scientificsubfamily: scientificsubfamily,
            commonfamily: commonfamily,
            scientificfamily: scientificfamily,
            number: number,
            time: new Date().toLocaleString(),
            xCoord: xCoord,
            yCoord: yCoord,
            section: currentPollardSection,
            comment: "",
            picture: false,
          },
          ...prevState,
        ]
      } else {
        return [
          {
            sightingID: prevState[0].sightingID + 1,
            genericname: genericname,
            scientificname: scientificname,
            commonsubfamily: commonsubfamily,
            scientificsubfamily: scientificsubfamily,
            commonfamily: commonfamily,
            scientificfamily: scientificfamily,
            number: number,
            time: new Date().toLocaleString(),
            xCoord: xCoord,
            yCoord: yCoord,
            section: currentPollardSection,
            comment: "",
            picture: false,
          },
          ...prevState,
        ]
      }
    });
  }

  /* Allows consumers of the Survey Context to: add surveyor data */
  function addSurveyorInformation(newSurveyorInfo) {
    setSurveyorInfo(newSurveyorInfo);
  }

  /* Allows consumers of the Survey Context to: add general survey data */
  function addGeneralData(newGeneralData) {
    setGeneralData(newGeneralData);
  }

  /* Allows consumers of the Survey Context to: append breadcrumbs to the breadcrumbArray */
  function appendBreadcrumb() {
    const arrayLen = breadcrumbArray.length;

    if (arrayLen === 0) {
      // console.log("Adding first breadcrumb: " + JSON.stringify(location));

      if (isPollard === true) {
        setBreadcrumbArray([
          ...breadcrumbArray,
          {
            breadcrumbID: 0,
            latitude: location?.latitude,
            longitude: location?.longitude,
            currentPollardSection: currentPollardSection,
          },
        ]);
      } else {
        setBreadcrumbArray([
          ...breadcrumbArray,
          {
            breadcrumbID: 0,
            latitude: location?.latitude,
            longitude: location?.longitude,
          },
        ]);
      }
    } else {
      // console.log("Appending breadcrumb " + JSON.stringify(location));
      if (isPollard === true) {
        setBreadcrumbArray([
          ...breadcrumbArray,
          {
            breadcrumbID: arrayLen + 1,
            latitude: location?.latitude,
            longitude: location?.longitude,
            currentPollardSection: currentPollardSection,
          },
        ]);
      } else {
        setBreadcrumbArray([
          ...breadcrumbArray,
          {
            breadcrumbID: arrayLen + 1,
            latitude: location?.latitude,
            longitude: location?.longitude,
          },
        ]);
      }
    }
  }

  /* Allows consumers of the Survey Context to: add user weather data to userWeatherData */
  function addUserWeatherData(newUserWeatherData) {
    setUserWeatherData(newUserWeatherData);
  }

  /* Allows consumers of the Survey Context to: add user weather data to userWeatherData */
  function addEndUserWeatherData(newEndUserWeatherData) {
    setEndUserWeatherData(newEndUserWeatherData);
  }

  /* Allows consumers of the Survey Context to: add API weather data to apiWeatherData */
  function addApiWeatherData(newApiWeatherData) {
    setApiWeatherData(newApiWeatherData);
  }

  /* Allows consumers of the Survey Context to: get Sighting by ID */
  function getSightingByID(findingID) {
    if (sightingsArray.length === 0) {
      console.log("There are currently 0 sightings");
      return;
    }
    console.log(
      `Searching for SightingID ${findingID} (type: ${typeof findingID})`
    );

    /* Loop sightings */
    for (var i = 0; i < sightingsArray.length; i++) {
      if (typeof sightingsArray[i] === "undefined") {
        console.log(
          "This sighting has been permanently deleted and is unable to be retrieved."
        );
        return;
      }
      /* If the sighting ID matches the ID finding, print to console */
      if (sightingsArray[i].sightingID === parseInt(findingID)) {
        console.log(`Found object.`);
        console.log(`(surveyObj.sightingsArray[${i}]): ` + sightingsArray[i]);
        console.log(`Object string: ` + JSON.stringify(sightingsArray[i]));
        return;
      }
    }
    console.log(`Error: SightingID ${findingID} not found.`);
  }

  /* Allows consumers of the Survey Context to: send surveys to the AWS DynamoDB */
  async function sendSurveyToDatabase() {
    const response = { ok: true, error: "", data: null };
    console.log("Sending survey to AWS...");
    swalIsLoading("Sending survey to AWS...");

    try {
      const retName = await get("CurrentSurveyName");
      if (retName) {
        await get(retName).then((res) => {
          const retSurveyVal = structuredClone(res);
          retSurveyVal.endTime = new Date().toLocaleString();
          retSurveyVal.sightingsArray = retSurveyVal.sightingsArray.reverse();

          response.data = retSurveyVal;

          var surveyData = JSON.stringify({
            incomingUser: currentUsername,
            incomingDate: new Date().toISOString(),
            surveyData: retSurveyVal,
          });

          var requestOptions = {
            method: "POST",
            body: surveyData,
            redirect: "follow",
          };

          fetch(
            config.surveyApiUrl,
            requestOptions
          )
            .then((response) => response.json())
            .then(async (result) => {
              console.log("Fetch result: " + result);

              await clearIDXBD();
              swalSuccess();
            })
            .catch((error) => {
              swalError();
              console.log("error", error);
            });
        });
      }
    } catch (error) {
      response.ok = false;
      response.error = error.message;
      swalError();

      console.log(
        "No Surveys in IDXDB to load, user must create a new survey."
      );
    }
    return response;
  }

  /* Allows consumers of the Survey Context to: update Sighting by ID */
  async function updateSightingByID(findingID, newSightingObject) {
    if (sightingsArray.length === 0) {
      console.log("There are currently 0 sightings");
      return;
    }

    console.log(
      `Attempting to update SightingID ${findingID} (type: ${typeof findingID}) with object ${newSightingObject}`
    );

    /* Loop sightings */
    for (var i = 0; i < sightingsArray.length; i++) {
      if (typeof sightingsArray[i] === "undefined") {
        console.log(
          "This sighting has been permanently deleted and is unable to be updated."
        );
        return;
      }
      /* If the sighting ID matches the ID finding, attempt to update */
      if (sightingsArray[i].sightingID === parseInt(findingID)) {
        console.log(`Object found, attempting to update ...`);
        var arrCopy = [...sightingsArray];
        arrCopy[i] = newSightingObject;
        setSightingsArray(arrCopy);

        console.log("Object updated.");
        return;
      }
    }
    console.log(`Error: SightingID ${findingID} not found.`);
  }

  /* Allows consumers of the Survey Context to: delete Sighting by ID */
  function deleteSightingByID(findingID) {
    if (sightingsArray.length === 0) {
      console.log("There are currently 0 sightings");
      return;
    }

    console.log(
      `Searching for SightingID ${findingID} (type: ${typeof findingID})`
    );

    /* Loop sightings */
    for (var i = 0; i < sightingsArray.length; i++) {
      if (typeof sightingsArray[i] === "undefined") {
        console.log(
          "This sighting has been permanently deleted and is unable to be deleted again."
        );
        return;
      }
      /* If the sighting ID matches the ID finding, print to console */
      //would the index always be equal to the sigthing id? No
      if (sightingsArray[i]?.sightingID === parseInt(findingID)) {
        console.log(`Object found, deleting ...`);
        var arrCopy = [...sightingsArray];
        arrCopy.splice(i, 1);
        setSightingsArray(arrCopy);
        console.log("Object deleted.");
        return;
      }
    }
    console.log(`Error: SightingID ${findingID} not found.`);
  }

  async function deleteSightingByNames(findingKey) {
    if (sightingsArray.length === 0) {
      console.log("There are currently 0 sightings");
      return;
    }

    console.log(
      `Searching for SightingID ${findingKey} (type: ${typeof findingKey})`
    );

    /* Loop sightings */
    for (var i = sightingsArray.length - 1; i >= 0; i--) {
      if (typeof sightingsArray[i] === "undefined") {
        console.log(
          "This sighting has been permanently deleted and is unable to be deleted again."
        );
        return;
      }
      /* If the sighting ID matches the ID finding, print to console */
      //would the index always be equal to the sigthing id? No

      const keyObj = {
        commonfamily: sightingsArray[i]?.commonfamily,
        scientificfamily: sightingsArray[i]?.scientificfamily,
        genericname: sightingsArray[i]?.genericname,
        scientificname: sightingsArray[i]?.scientificname,
        commonsubfamily: sightingsArray[i]?.commonsubfamily,
        scientificsubfamily: sightingsArray[i]?.scientificsubfamily,
      };
      const keyString = JSON.stringify(keyObj);

      if (keyString === findingKey) {
        console.log(`Object found, deleting ...`);
        var arrCopy = [...sightingsArray];
        arrCopy.splice(i, 1);
        setSightingsArray(arrCopy);
        console.log("Object deleted.");
        return;
      }
    }
    console.log(`Error: Sighting of ${findingKey} not found.`);
  }

  /* Allows consumers of the Survey Context to: get Breadcrumb by ID */
  async function getBreadcrumbByID(findingID) {
    if (breadcrumbArray.length === 0) {
      console.log("There are currently 0 breadcrumbs");
      return;
    }
    console.log(
      `Searching for BreadcrumbID ${findingID} (type: ${typeof findingID})`
    );

    /* Loop breadcrumbs */
    for (var i = 0; i < breadcrumbArray.length; i++) {
      if (typeof breadcrumbArray[i] === "undefined") {
        console.log(
          "This breadcrumb has been permanently deleted and is unable to be retrieved."
        );
        return;
      }
      /* If the breadcrumb ID matches the ID finding, print to console */
      if (breadcrumbArray[i].breadcrumbID === parseInt(findingID)) {
        console.log(`Found object.`);
        console.log(`(surveyObj.breadcrumbArray[${i}]): ` + breadcrumbArray[i]);
        console.log(`Object string: ` + JSON.stringify(breadcrumbArray[i]));
        return;
      }
    }
    console.log(`Error: BreadcrumbID ${findingID} not found.`);
  }

  /* Allows consumers of the Survey Context to: update Breadcrumb by ID */
  async function updateBreadcrumbByID(findingID, newBreadcrumbObject) {
    if (breadcrumbArray.length === 0) {
      console.log("There are currently 0 breadcrumbs");
      return;
    }

    console.log(
      `Attempting to update BreadcrumbID ${findingID} (type: ${typeof findingID}) with object ${newBreadcrumbObject}`
    );

    /* Loop breadcrumbs */
    for (var i = 0; i < breadcrumbArray.length; i++) {
      if (typeof breadcrumbArray[i] === "undefined") {
        console.log(
          "This breadcrumb has been permanently deleted and is unable to be updated."
        );
        return;
      }
      /* If the breadcrumb ID matches the ID finding, attempt to update */
      if (breadcrumbArray[i].sightingID === parseInt(findingID)) {
        console.log(`Object found, attempting to update ...`);
        var arrCopy = [...breadcrumbArray];
        arrCopy[i] = newBreadcrumbObject;
        setBreadcrumbArray(arrCopy);

        console.log("Object updated.");
        return;
      }
    }
    console.log(`Error: BreadcrumbID ${findingID} not found.`);
  }

  /* Allows consumers of the Survey Context to: delete Breadcrumb by ID */
  async function deleteBreadcrumbByID(findingID) {
    if (breadcrumbArray.length === 0) {
      console.log("There are currently 0 breadcrumbs");
      return;
    }

    console.log(
      `Searching for BreadcrumbID ${findingID} (type: ${typeof findingID})`
    );

    /* Loop breadcrumb */
    for (var i = 0; i < breadcrumbArray.length; i++) {
      if (typeof breadcrumbArray[i] === "undefined") {
        console.log(
          "This breadcrumb has been permanently deleted and is unable to be deleted again."
        );
        return;
      }
      /* If the breadcrumb ID matches the ID finding, print to console */
      //would the index always be equal to the breadcrumb id? No
      if (breadcrumbArray[i]?.breadcrumbID === parseInt(findingID)) {
        console.log(`Object found, deleting ...`);
        var arrCopy = [...breadcrumbArray];
        arrCopy.splice(i, 1);
        setBreadcrumbArray(arrCopy);
        console.log("Object deleted.");
        return;
      }
    }
    console.log(`Error: BreadcrumbID ${findingID} not found.`);
  }

  /* Adds a new default survey to the IDXDB */
  async function addSurveyFunction(newSurveyName, initialSurveyData) {
    //get location first
    navigator.geolocation.getCurrentPosition(handleSuccess, handleError);

    await get(newSurveyName).then(
      async function (value) {
        //if (typeof value === "undefined") {
          console.log(`The survey name ${newSurveyName} is unique to IDXDB.`);

          /* Set name of the current survey so we can retrieve it later */
          set("CurrentSurveyName", newSurveyName);
          setCurrentSurveyName(newSurveyName);

          // then updates the OpenWeatherapi only once
          const openWeatherApiData = await OpenWeather();

          //makes a survey object using the user input values and the default values in the context
          const newSurveyObj = {
            currentDate: initialSurveyData.currentDate,
            generalData: initialSurveyData.generalData,
            surveyorInfo: initialSurveyData.surveyorInfo,
            userWeatherData: initialSurveyData.userWeatherData,
            breadcrumbArray: [],
            sightingsArray: [],
            apiWeatherData: openWeatherApiData,
            timer: 0,
            startTime: new Date().toLocaleString(),
          };

          //sets it in the indexDB
          set(newSurveyName, newSurveyObj)
            .then(async () => {
              //on success, it updates the current surveyObject in the context by calling getPersistedSurvey
              getPersistedSurvey();

              console.log("Successfully updated IDXDB.");
            })
            .catch((err) => console.log("Failed updating IDXDB, error:" + err));

          await set("surveyActive", true).then((res) => {
            setSurveyActive(true);
          });

          await set("surveyPaused", false).then((res) => {
            setSurveyPaused(false);
          });

          /* Set pollard state to defaults for numeric and alpha. Note: this decision is made by the user on the Create Survey page */
          if (initialSurveyData.generalData.surveyType === "Pollard") {
            if (initialSurveyData.generalData.sectionType === "Numeric") {
              await set("currentPollardSection", "1").then((res) => {
                setCurrentPollardSection("1");
              });
            } else {
              await set("currentPollardSection", "A").then((res) => {
                setCurrentPollardSection("A");
              });
            }
          }
        //} else {
          console.log(
            `The survey name ${newSurveyName} is not unique to IDXDB. Please choose a new Survey Name.`
          );
        //}
      },
      function (error) {
        console.log("Error: " + error);
      }
    );
  }

  /* Edits the current survey in the IDXDB */

  // Currently, we are not editing the endUserWeatherData here
  async function editSurveyFunction(editedSurveyData) {
    console.log("Attempting to Update persisted survey from IDXDB ...");

    setCurrentDate(editedSurveyData.currentDate);
    setGeneralData(editedSurveyData.generalData);
    setSurveyorInfo(editedSurveyData.surveyorInfo);
    setUserWeatherData(editedSurveyData.userWeatherData);
    await getPersistedSurvey();
  }

  /* The getPersistedSurvey retrieves the most recent survey from the IDXDB */
  /* Example: the user is doing a survey but they accidently refresh the page. This would cause React to lose the Survey Object. The Survey Object is stored in React as a useState Object but also in IDXDB as a value. Using a useEffect hook on each page that uses the surveyContext, the UBR can persist survey data between page reloads */
  async function getPersistedSurvey() {
    const response = { ok: true, error: "", data: null };
    console.log("Attempting to retrieve persisted survey from IDXDB ...");

    try {
      const retName = await get("CurrentSurveyName");
      if (retName) {
        setCurrentSurveyName(retName);
        const surveyInfo = await get(retName);
        const surveyClone = structuredClone(surveyInfo);
        setSurveyObject(surveyClone);
        setCurrentDate(surveyInfo.currentDate);
        setGeneralData(surveyInfo.generalData);
        setSurveyorInfo(surveyInfo.surveyorInfo);
        setSightingsArray(surveyInfo.sightingsArray);
        setBreadcrumbArray(surveyInfo.breadcrumbArray);
        setApiWeatherData(surveyInfo.apiWeatherData);
        setUserWeatherData(surveyInfo.userWeatherData);
        setEndUserWeatherData(surveyInfo.endUserWeatherData);
        setSurveyState(surveyInfo.generalData.surveyState);
        setStartTime(surveyInfo.startTime);
        setTimer(surveyInfo.timer);
        setIsPollard(surveyInfo.generalData.surveyType === "Pollard");
        setPollardSectionQuantity(surveyInfo.generalData.numSections);
        setPollardNumOrAlpha(surveyInfo.generalData.sectionType);

        if (surveyInfo.generalData.surveyType === "Pollard") {
          await get("currentPollardSection").then((res) => {
            setCurrentPollardSection(res);
          });
        } else {
          setCurrentPollardSection("");
        }

        await get("surveyActive").then((res) => {
          setSurveyActive(res);
        });

        await get("surveyPaused").then((res) => {
          setSurveyPaused(res);
        });

        response.data = surveyInfo;
      }
    } catch (error) {
      response.ok = false;
      response.error = error.message;

      console.log(error.message);

      console.log(
        "No Surveys in IDXDB to load, user must create a new survey."
      );
    }
    return response;
  }

  async function clearIDXBD() {
    await set("surveyActive", false).then((res) => {
      setSurveyActive(false);
    });
    await clear();
  }

  // /* The deleteSurveyFunction deletes a survey from the IDXDB */
  // async function deleteSurveyFunction(surveyNameKey) {
  //   console.log("Deleting survey " + surveyNameKey);
  //   del(surveyNameKey).then((val) => console.log(val));
  // }

  /* ------------------------------------ */
  /* ------------------------------------ */
  /* ------------------------------------ */
  /* ------------------------------------ */
  /* ------------------------------------ */
  /* ------------------------------------ */

  /* Create object "value" that contains all objects, variables and functions available to consumers of the Survey Context */
  const value = {
    surveyObject, // Object - Entire survey (useState)
    surveyObj, // Object - Entire survey (POJO)
    surveyActive, // Boolean variable - Represents active survey state
    surveyPaused, // Boolean variable - Represents pause state
    timer, // Number variable - Represents the elapsed time of the survey in seconds
    isPollard, // Boolean variable - Represents if survey is Pollard
    currentPollardSection, // String - represents current section of pollard survey
    searchBar, // Boolean variable - Represents visibility of search bar
    generalData, // Object - Contains all general data for this survey (survey name, survey type, ...)
    sightingsArray, // Array of Objects - Contains all sightings for this survey
    breadcrumbArray, // Array of Objects - Contains all breadcrumbs for this survey
    toggleSurveyActive, // Function - Toggles the surveyActive variable
    toggleSurveyPause, // Function - Toggles the surveyPaused variable
    toggleSearchBar, // Function - Toggles the searchBar variable
    setTimer, // Function - set number of seconds of timer
    setCurrentPollardSection, // Function - Sets state of pollard (A,b,c,etc.)
    addSurveyorInformation, // Function - Adds surveyor information
    addGeneralData, // Function - Adds general survey data
    setSurveyDate, // Function - Sets survey date
    setSurveyState, // Function - Sets survey state
    changePollardSection, // Function - Changes pollard state/section
    surveyState, // Function - Gets survey state
    appendSightings, // Function - Appends sightings to the sightingsArray
    addUserWeatherData, // Function - Adds user weather data to userWeatherData
    addEndUserWeatherData, // Function - Adds user weather data to endUserWeatherData
    addApiWeatherData, // Function - Adds API weather data to apiWeatherData
    getSightingByID, // Function - Gets Sighting by ID
    deleteSightingByID, // Function - Deletes Sighting by ID
    updateSightingByID, // Function - Updates Sighting by ID
    getBreadcrumbByID, // Function - Gets Sighting by ID
    deleteBreadcrumbByID, // Function - Deletes Sighting by ID
    updateBreadcrumbByID, // Function - Updates Sighting by ID
    addSurveyFunction, // Function - Creates a new survey in the IDXDB
    editSurveyFunction, // Function - Edits the current survey in the IDXDB
    getPersistedSurvey, // Function - Gets a persisted survey from the IDXDB
    deleteSightingByNames, //Funtion - Deletes the last item with a similar name as the name on the card
    // deleteSurveyFunction, // Function - Deletes a survey from the IDXDB
    clearIDXBD, // Function - Clears all surveys from the IDXDB //TODO
    sendSurveyToDatabase, // Function - Sends a survey to the AWS DynamoDB
    pollardSectionQuantity, // Variable representing how many sections the user wants in their Pollard survey
    pollardNumOrAlpha,
    location, // Variable representing whether the Pollard survey uses numeric ordering or alphabetic ordering for the section dropdown during active survey
    setPollardSectionQuantity,
    setPollardNumOrAlpha
  };

  return (
    <>
      {
        <SurveyContext.Provider value={value}>
          {children}
        </SurveyContext.Provider>
      }
    </>
  );
};

export { Survey, SurveyContext };
