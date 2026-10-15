import React, { useEffect, useRef, useState, useContext } from "react";
import "../../css/StaticMap.css";
import { ListContext } from "contexts/listContext";
import config from "config";

const MapComponent = ({ surveyObject }) => {
  const apiKey = config.googleMapsApiKey;
  const zoom = "auto";

  const [markers, setMarkers] = useState([]);
  const [breadcrumbs, setBreadcrumbs] = useState([]);
  const [mapUrl, setMapUrl] = useState("");
  const containerRef = useRef(null);
  const { getColorFromSubFamilyHex } = useContext(ListContext);

  useEffect(() => {
    //Loops through the sightings array and adds a marker to the markers variable
    let tempMarkers = [];
    let tempBreadCrumbs = [];

    for (let i = 0; i < surveyObject?.sightingsArray.length; i++) {
      tempMarkers.push({
        lat: surveyObject?.sightingsArray[i]?.xCoord,
        lng: surveyObject?.sightingsArray[i]?.yCoord,
        color: getColorFromSubFamilyHex(
          surveyObject?.sightingsArray[i]?.scientificfamily,
          surveyObject?.sightingsArray[i]?.scientificsubfamily
        ),
      });
    }
    for (let i = 0; i < surveyObject?.breadcrumbArray.length; i++) {
      tempBreadCrumbs.push({
        lat: surveyObject?.breadcrumbArray[i]?.latitude,
        lng: surveyObject?.breadcrumbArray[i]?.longitude,
      });
    }

    setMarkers(tempMarkers);
    setBreadcrumbs(tempBreadCrumbs);
  }, [surveyObject]);


  useEffect(() => {
    if (containerRef.current) {
      const { clientWidth, clientHeight } = containerRef.current;
      const width = clientWidth !== 0 ? clientWidth : 382; // set default width to 382 if clientWidth is 0
      const height = clientHeight !== 0 ? clientHeight : 240; // set default height to 240 if clientHeight is 0
      const size = `${width}x${height}`;

      //These 4 lines are for calculating the center so I don't need to make another
      //call to the Google Api to get the center
      const latitudes = [...markers, ...breadcrumbs].map(
        (location) => location.lat
      );
      const longitudes = [...markers, ...breadcrumbs].map(
        (location) => location.lng
      );
      const centerLat = (Math.min(...latitudes) + Math.max(...latitudes)) / 2;
      const centerLng = (Math.min(...longitudes) + Math.max(...longitudes)) / 2;

      const markersPin = markers
        .map(
          (location, index) =>
            `markers=size:tiny%7Ccolor:${location.color}%7C${location.lat},${location.lng}`
        )
        .join("&");

      const breadcrumbsPath = breadcrumbs
        .map((coord) => `${coord.lat},${coord.lng}`)
        .join("|");

      const mapUrl = `https://maps.googleapis.com/maps/api/staticmap?center=${centerLat},${centerLng}&zoom=${zoom}&size=${size}&${markersPin}&path=color:0x24948B|weight:3|${breadcrumbsPath}&key=${apiKey}`;

      setMapUrl(mapUrl);
    }
  }, [markers, breadcrumbs]);

  return (
    <div ref={containerRef} style={{ width: "100%", height: "240px" }}>
      {mapUrl && <img src={mapUrl} alt="Map" width={"100%"} />}
    </div>
  );
};

export default MapComponent;
