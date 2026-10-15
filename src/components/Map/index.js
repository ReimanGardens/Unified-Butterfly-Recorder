import React, { useState, useRef } from "react";
import config from "config";
import {
  GoogleMap,
  InfoWindow,
  LoadScript,
  MarkerF,
} from "@react-google-maps/api";
import { TbButterfly } from "react-icons/tb";
import "./map.css";
import StopWatch from "../Timer/StopWatch";
const MapComponent = () => {
  const childRef = useRef(null);

  const handleClick = () => {
    childRef.current.childFunction1();
  };

  /* REMOVE */
  const initialMarkers = [
    {
      position: {
        lat: 42.02842,
        lng: -93.65096,
      },
      label: { color: "black", text: "P1" },
      draggable: true,
    },
  ];

  /* Map states */
  const [activeInfoWindow, setActiveInfoWindow] = useState("");
  const [markers, setMarkers] = useState(initialMarkers);

  /* Map container style */
  const containerStyle = {
    width: "100%",
    height: "400px",
  };

  /* Center initial map on ISU Campus */
  const center = {
    lat: 42.028,
    lng: -93.65,
  };

  /* If map is clicked, console log location of click */
  const mapClicked = (event) => {
    console.log(event.latLng.lat(), event.latLng.lng());
  };

  /* If marker is clicked, console log location of click */
  const markerClicked = (marker, index) => {
    setActiveInfoWindow(index);
    console.log(marker, index);
  };

  /* If marker is dragged, console log location of drag */
  const markerDragEnd = (event, index) => {
    console.log(event.latLng.lat());
    console.log(event.latLng.lng());
  };

  function convertToF(tempInKelvin) {
    console.log("temp k: " + tempInKelvin);
    var tempInF = (tempInKelvin - 273.15) * 1.8 + 32;
    return tempInF;
  }

  const fetchData = async () => {
    var cooverLatitude = 42.0286;
    var cooverLongitude = -93.6509;

    await fetch(
      `https://api.openweathermap.org/data/2.5/weather?lat=${cooverLatitude}&lon=${cooverLongitude}&appid=${config.openWeatherApiKey}`
    )
      .then((res) => res.json())
      .then((result) => {
        console.log(convertToF(result.main.temp));
      });
  };

  function addMarker() {
    console.log("Adding marker " + String(markers.length));
    handleClick();
    /* Get current position */
    const options = {
      enableHighAccuracy: true,
      timeout: 5000,
      maximumAge: 0,
    };

    function success(pos) {
      const crd = pos.coords;

      var currentLatitude = crd.latitude;
      var currentLongitude = crd.longitude;

      console.log("Current lati: " + currentLatitude);
      console.log("Current long: " + currentLongitude);

      fetchData(currentLatitude, currentLongitude);

      /* Assuming success callback, set markers array with new location */
      setMarkers((current) => [
        ...current,
        {
          position: {
            lat: currentLatitude,
            lng: currentLongitude,
          },
          label: { color: "orange", text: String(markers.length) },
          draggable: true,
        },
      ]);
    }

    function error(err) {
      console.warn(`ERROR(${err.code}): ${err.message}`);
    }

    navigator.geolocation.getCurrentPosition(success, error, options);
  }

  return (
    <>
      <p>Timer placeholder</p>
      <StopWatch ref={childRef} />
      <div style={{ textAlign: "center", marginBottom: "25px", zIndex: 200 }}>
        <TbButterfly
          className="butterflyButton"
          size={60}
          onClick={() => addMarker()}
        />
      </div>
      <div style={{ margin: "5px" }}>
        <LoadScript googleMapsApiKey={config.googleMapsApiKey}>
          <GoogleMap
            mapContainerStyle={containerStyle}
            center={center}
            zoom={15}
            onClick={mapClicked}
          >
            {markers.map((marker, index) => (
              <MarkerF
                key={index}
                position={marker.position}
                label={marker.label}
                draggable={marker.draggable}
                onDragEnd={(event) => markerDragEnd(event, index)}
                onClick={(event) => markerClicked(marker, index)}
              >
                {activeInfoWindow === index && (
                  <InfoWindow position={marker.position}>
                    <b>
                      {marker.position.lat}, {marker.position.lng}
                    </b>
                  </InfoWindow>
                )}
              </MarkerF>
            ))}
          </GoogleMap>
        </LoadScript>
      </div>
    </>
  );
};

export default MapComponent;
