import React, {useState, createContext} from "react";

const UserPreferencesContext = createContext();

const UserPreferences = (props) => {
    const [DefaultSurveyName, setDefaultSurveyName] = useState(localStorage.getItem("userSetDefaultSurveyName") ?? "");
    const [DefaultSurveyorName, setDefaultSurveyorName] = useState(localStorage.getItem("userSetDefaultSurveyorName") ?? "");
    const [DefaultSurveyType, setDefaultSurveyType] = useState(localStorage.getItem("userSetDefaultSurveyType") ?? "");
    const [DefaultTransectDivisionFormat, setDefaultTransectDivisionFormat] = useState(localStorage.getItem("userSetDefaultTransectDivisionFormat") ?? "");
    const [DefaultLocation, setDefaultLocation] = useState(localStorage.getItem("userSetDefaultLocation") ?? "");
    const [DefaultTemp, setDefaultTemp] = useState(localStorage.getItem("userSetDefaultTemp") ?? "");
    const [DefaultPollardSectionType, setDefaultPollardSectionType] = useState(localStorage.getItem("userSetDefaultPollardSectionType") ?? "Alpha");
    const [DefaultPollardSectionNum, setDefaultPollardSectionNum] = useState(localStorage.getItem("userSetDefaultPollardSectionNum") ?? 3);
    const [DefaultHabitats, setDefaultHabitats] = useState(localStorage.getItem("userSetDefaultHabitats") ? JSON.parse(localStorage.getItem("userSetDefaultHabitats")) : JSON.parse("{}"));
    const [DefaultWindSpeedType, setDefaultWindSpeedType] = useState(localStorage.getItem("userSetDefaultWindSpeedType") ?? "Numeric");
    const [DefaultCloudCoverType, setDefaultCloudCoverType] = useState(localStorage.getItem("userSetDefaultCloudCoverType") ?? "Numeric");
    const [DefaultTransectDistanceMeasurement, setDefaultTransectDistanceMeasurement] = useState(localStorage.getItem("userSetDefaultTransectDistanceMeasurement") ?? "");
    const [DefaultViewingRadius, setDefaultViewingRadius] = useState(localStorage.getItem("userSetDefaultViewingRadius") ?? "");



    const setDefSurveyName = (name) => {
        setDefaultSurveyName(name);
        localStorage.setItem("userSetDefaultSurveyName", name);
    };

    const setDefSurveyorName = (name) => {
        setDefaultSurveyorName(name);
        localStorage.setItem("userSetDefaultSurveyorName", name);
    };

    const setDefSurveyType = (type) => {
        setDefaultSurveyType(type);
        localStorage.setItem("userSetDefaultSurveyType", type);
    };

    const setDefTransectDivisionFormat = (format) => {
        setDefaultTransectDivisionFormat(format);
        localStorage.setItem("userSetDefaultTransectDivisionFormat", format);
    };

    const setDefLocation = (loc) => {
        setDefaultLocation(loc);
        localStorage.setItem("userSetDefaultLocation", loc);
    };

    const setDefTemp = (temp) => {
        setDefaultTemp(temp);
        localStorage.setItem("userSetDefaultTemp", temp);
    };

    const setDefPollardSectionType = (type) => {
        setDefaultPollardSectionType(type);
        localStorage.setItem("userSetDefaultPollardSectionType", type);
    };

    const setDefPollardSectionNum = (num) => {
        setDefaultPollardSectionNum(num);
        localStorage.setItem("userSetDefaultPollardSectionNum", num);
    };

    const setDefHabitats = (habitat) => {
        setDefaultHabitats(habitat);
        localStorage.setItem("userSetDefaultHabitats", JSON.stringify(habitat));
    };

    const setDefWindSpeedType = (type) => {
        setDefaultWindSpeedType(type);
        localStorage.setItem("userSetDefaultWindSpeedType", type);
    };

    const setDefCloudCoverType = (type) => {
        setDefaultCloudCoverType(type);
        localStorage.setItem("userSetDefaultCloudCoverType", type);
    };

    const setDefTransectDistanceMeasurement = (value) => {
        setDefaultTransectDistanceMeasurement(value);
        localStorage.setItem("userSetDefaultTransectDistanceMeasurement", value);
    };

    const setDefViewingRadius = (value) => {
        setDefaultViewingRadius(value);
        localStorage.setItem("userSetDefaultViewingRadius", value);
    };

    const value = {
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
    };

    return (
        <>
            {(
                <UserPreferencesContext.Provider value={value}>
                    {props.children}
                </UserPreferencesContext.Provider>
            )}
        </>
    );
};

export { UserPreferences, UserPreferencesContext };