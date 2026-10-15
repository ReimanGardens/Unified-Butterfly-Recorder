import React from "react";
import AppColumn from "../components/AppColumn";
import { Image, Button } from "react-bootstrap";
import butterflyImage from "../images/loginButterFly.png";
import profilePic from "../images/defaultProfilePicture.jpg";
import { DropdownKeyValue } from "../components/Dropdown/dropdown.js";
import { NavLink } from "react-router-dom";
import "../css/editUserProfile.css";

const EditUserProfile = () => {
  const [picture, setPicture] = React.useState("");
  const [name, setName] = React.useState("Current Name");
  const callback = (e) => {
    switch (e) {
      case "loginButterfly":
        setPicture(butterflyImage);
        break;
      case "defaultProfilePic":
        setPicture(profilePic);
        break;
      case " ":
        setPicture("");
        break;
      default:
        break;
    }
  };

  var butterflies = [
    { key: "-No Item Selected-", value: " " },
    { key: "Butterfly", value: "loginButterfly" },
    { key: "User", value: "defaultProfilePic" },
  ];

  return (
    <>
      <AppColumn>
        <div className="overall" style={{ width: "100%", textAlign: "center" }}>
          <div className="editName">
            <form>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
              <br />
            </form>
          </div>
          <br />
          <div className="avatar">
            <div className="text">
              <p>
                Current
                <br />
                Avatar
              </p>
            </div>
            <div className="element">
              <Image style={{ width: "45%" }} src={butterflyImage} />
            </div>
          </div>
          <br />
          <div className="new-avatar">
            <div className="new-text">
              <p>
                New
                <br />
                Avatar
              </p>
            </div>
            <div className="element" style={{ paddingLeft: "15%" }}>
              <DropdownKeyValue
                callback={callback}
                options={butterflies}
                initialValue={"picture"}
                dWidth="100%"
              />
            </div>
          </div>
          <Image style={{ width: "45%", padding: "30px" }} src={picture} />
          <NavLink to="/auth/profile">
            <Button
              style={{
                backgroundColor: "#D0D0D0",
                color: "#000000",
                width: "60%",
                fontSize: "130%",
                border: "none",
                boxShadow:
                  "0 12px 16px 0 rgba(0,0,0,0.24),0 17px 50px 0 rgba(0,0,0,0.19)",
              }}
              onClick={() => console.log("Submit Clicked")}
            >
              Submit Changes
            </Button>
          </NavLink>
        </div>
      </AppColumn>
    </>
  );
};

export default EditUserProfile;
