import React from "react";
import AppColumn from "../components/AppColumn";
import { Image, Button } from "react-bootstrap";
import butterflyImage from "../images/loginButterFly.png";
import ProfileTable from "../components/Profile/profileTable.js";
import { NavLink } from "react-router-dom";
import "../css/userProfilePage.css";

const UserProfile = () => {
  return (
    <>
      <AppColumn>
        <div className="overall" style={{ width: "100%", textAlign: "center" }}>
          <h1>Name</h1>
          <h6>Username</h6>
          <br />
          <Image style={{ width: "30%" }} src={butterflyImage} />
          <br />
          <br />
          <NavLink to="./edit">
            <Button
              style={{
                backgroundColor: "#D0D0D0",
                color: "#000000",
                width: "35%",
                fontSize: "130%",
                border: "none",
                boxShadow:
                  "0 12px 16px 0 rgba(0,0,0,0.24),0 17px 50px 0 rgba(0,0,0,0.19)",
              }}
            >
              Edit
            </Button>
          </NavLink>
          <br />
          <br />
          <br />
          <Button
            style={{
              backgroundColor: "#24948B",
              color: "#FFFFFF",
              width: "60%",
              fontSize: "130%",
              border: "none",
            }}
            onClick={() => console.log("Review Surveys Clicked")}
          >
            Review Surveys
          </Button>
          <br />
          <br />
          <ProfileTable />
        </div>
      </AppColumn>
    </>
  );
};

export default UserProfile;
