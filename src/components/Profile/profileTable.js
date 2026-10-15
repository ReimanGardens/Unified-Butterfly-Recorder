import * as React from "react";
import UserPool from "../../UserPool";
import "./profileTable.css";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableRow from "@mui/material/TableRow";
import TableHead from "@mui/material/TableHead";
import Paper from "@mui/material/Paper";

const user = UserPool.getCurrentUser();

const data = {
  username: "user.username",
  email: "user.email@iastate.edu",
  defaultLocation: "Reiman Gardens, Ames, IA",
  memberSince: "02-02-2023",
  surveysCompleted: "3",
  butterfliesSpotted: "12",
  speciesMostSighted: "Monarch",
  lastSurveyDate: "02-03-2023",
};

export default function profileTable() {
  return (
    <>
      <TableContainer component={Paper}>
        <Table aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell align="center">
                <h4>
                  <b>User</b>
                </h4>
              </TableCell>
              <TableCell align="center">
                <h4>
                  <b>Survey</b>
                </h4>
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            <TableRow>
              <TableCell>
                <p>
                  <u>Username</u>
                </p>
                <h6>{data.username}</h6>
              </TableCell>
              <TableCell align="right">
                <p>
                  <u># Surveys Completed</u>
                </p>
                <h6>{data.surveysCompleted}</h6>
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell>
                <p>
                  <u>Email Address</u>
                </p>
                <h6>{data.email}</h6>
              </TableCell>
              <TableCell align="right">
                <p>
                  <u>Total Butterflies Sighted</u>
                </p>
                <h6>{data.butterfliesSpotted}</h6>
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell>
                <p>
                  <u>Member Since</u>
                </p>
                <h6>{data.memberSince}</h6>
              </TableCell>
              <TableCell align="right">
                <p>
                  <u>Species Most Sighted</u>
                </p>
                <h6>{data.speciesMostSighted}</h6>
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell>
                <p>
                  <u>Last Survey Date</u>
                </p>
                <h6>{data.lastSurveyDate}</h6>
              </TableCell>
              <TableCell align="right">
                <p>
                  <u>Default Location</u>
                </p>
                <h6>{data.defaultLocation}</h6>
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </TableContainer>
    </>
  );
}
