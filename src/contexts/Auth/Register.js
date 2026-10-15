import { CognitoUser, CognitoUserAttribute } from "amazon-cognito-identity-js";
import { useState } from "react";
import UserPool from "../../UserPool";

import { Form, Image, Button } from "react-bootstrap";
import butterflyImage from "images/loginButterFly.png";

import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import Link from "@mui/material/Link";

function Register({ toggleFunction }) {
  const [open, setOpen] = useState(false);

  const handleClickOpen = (msg) => {
    setDialogText(msg);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const [username, setUsername] = useState("");
  const [dialogText, setDialogText] = useState("");
  const [dialogTitle, setDialogTitle] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [OTP, setOTP] = useState("");
  const [stage, setStage] = useState(1);

  const onSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      const attributeList = [];
      attributeList.push(
        new CognitoUserAttribute({
          Name: "email",
          Value: email,
        })
      );
      UserPool.signUp(username, password, attributeList, null, (err, data) => {
        if (err) {
          handleClickOpen(err.message);
        } else {
          // console.log(data);
          setDialogTitle("Success!");
          handleClickOpen("Please check your email for a one time code.");
          setStage(2);
        }
      });
    }
  };

  const validateForm = () => {
    if (
      email.length > 0 &&
      username.length > 0 &&
      password.length > 0 &&
      confirmPassword.length > 0
    ) {
      if (password === confirmPassword) {
        return true;
      } else {
        handleClickOpen("Passwords do not match.");
        return false;
      }
    } else {
      handleClickOpen(
        "Please ensure all fields are completed. Note: passwords must be minimum 6 characters length, contain atleast 1 number, 1 uppercase letter and 1 lowercase letter."
      );
      return false;
    }
  };

  const verifyAccount = (e) => {
    e.preventDefault();
    const user = new CognitoUser({
      Username: username,
      Pool: UserPool,
    });
    user.confirmRegistration(OTP, true, (err, data) => {
      if (err) {
        handleClickOpen(`Couldn't verify account: ${err.message}`);
      } else {
        handleClickOpen(`Account verified successfully.`);
        setStage(3);
      }
    });
  };

  return (
    <div>
      {/* Show this section in all stages */}
      <div
        className="d-flex flex-column justify-content-center align-items-center vh-100 vw-100 px-4"
        style={{ backgroundColor: "#B9DBDA" }}
      >
        <Image src={butterflyImage} />
        <p
          className="mb-2"
          style={{ color: "#FD5A89", fontSize: "50px", fontWeight: "bolder" }}
        >
          Register
        </p>

        {/* Stage 1 - User enters [Username, Email, Password, ConfirmPassword] */}
        {stage === 1 && (
          <>
            <Form onSubmit={onSubmit} className="formControl">
              <Form.Group className="mb-3" controlId="formUsername">
                <Form.Label className="mb-0">Username</Form.Label>
                <Form.Control
                  type="text"
                  placeholder=""
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                />
              </Form.Group>

              <Form.Group className="mb-3" controlId="formEmail">
                <Form.Label className="mb-0">Email</Form.Label>
                <Form.Control
                  type="email"
                  placeholder=""
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </Form.Group>

              <Form.Group
                className="mb-3 d-flex flex-column"
                controlId="formPassword"
              >
                <Form.Label className="mb-0">Password</Form.Label>
                <Form.Control
                  type="password"
                  placeholder=""
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </Form.Group>

              <p style={{ color: "black", fontSize: "10px", marginTop: "-12px", marginBottom: "0px", padding: "0px", fontWeight: "600"}}>
                Your password must be at least 6 characters in length and include at least one lowercase, uppercase, and a number.
              </p>

              <Form.Group className="mb-3" controlId="formConfirmPassword">
                <Form.Label className="mb-0">Confirm Password</Form.Label>
                <Form.Control
                  type="password"
                  placeholder=""
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                />
              </Form.Group>
              <div className="d-flex justify-content-center">
                <Button
                  type="submit"
                  className="px-4"
                  style={{
                    backgroundColor: "#FD5A89",
                    border: "none",
                    color: "#000000",
                    fontWeight: "bold",
                  }}
                >
                  Sign up
                </Button>
              </div>
            </Form>
            <p
              className="mt-3 text-center"
              onClick={toggleFunction}
              style={{ color: "#000000" }}
            >
              Login?
            </p>
          </>
        )}

        {/* Stage 2 */}
        {stage === 2 && (
          <>
            <p>Please check your email for the one time code.</p>
            <Form onSubmit={verifyAccount} className="">
              <Form.Group className="mb-3" controlId="formOTC">
                <Form.Control
                  type="text"
                  placeholder="Enter OTC:"
                  value={OTP}
                  onChange={(e) => setOTP(e.target.value)}
                />
              </Form.Group>
              <div className="d-flex justify-content-center">
                <Button
                  type="submit"
                  className="px-4"
                  style={{
                    backgroundColor: "#FD5A89",
                    border: "none",
                    color: "#000000",
                    fontWeight: "bold",
                  }}
                >
                  Verify
                </Button>
              </div>
            </Form>
          </>
        )}

        {/* Stage 3 */}
        {stage === 3 && (
          <>
            <p>Success.</p>
            {/* <br /> */}
            <p> Please login with new credentials.</p>
            <Link href="/">Login</Link>
          </>
        )}

        <Dialog
          open={open}
          onClose={handleClose}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
        >
          <DialogTitle id="alert-dialog-title">
            {dialogTitle !== "" ? <>{dialogTitle}</> : "Registration Failure"}
          </DialogTitle>
          <DialogContent>
            <DialogContentText id="alert-dialog-description">
              {dialogText}
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose} autoFocus>
              Okay
            </Button>
          </DialogActions>
        </Dialog>
      </div>
    </div>
  );
}

export default Register;
