import React, { useState } from "react";
import { CognitoUser } from "amazon-cognito-identity-js";
import UserPool from "../../UserPool";
import butterflyImage from "images/loginButterFly.png";
import { Form, Image, Button } from "react-bootstrap";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import Link from "@mui/material/Link";

export default function ForgotPass() {
  const [stage, setStage] = useState(1); // 1 = email stage, 2 = code stage
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [openError, setOpenError] = useState(false);
  const [openOTPAlert, setOpenOTPAlert] = useState(false);

  const [errorMsg, setErrorMsg] = useState();

  /* Toggles error event dialog box. Note: this box cannot be closed by escape or clicking outside the box. */
  const toggleErrorDialog = () => {
    setOpenError(!openError);
  };

  /* Toggles OTC event dialog box. Note: this box cannot be closed by escape or clicking outside the box. */
  const toggleOTPDialog = () => {
    setOpenOTPAlert(!openOTPAlert);
  };

  /* Gets the current user */
  const getUser = () => {
    return new CognitoUser({
      Username: email.toLowerCase(),
      Pool: UserPool,
    });
  };

  /* Sends OTP to users email address */
  const sendCode = (event) => {
    event.preventDefault();

    getUser().forgotPassword({
      onSuccess: (data) => {
        // console.log("onSuccess:", data);
      },
      onFailure: (err) => {
        setErrorMsg("That user does not exist.");
        toggleErrorDialog();
      },
      inputVerificationCode: (data) => {
        // console.log("Input code:", data);
        toggleOTPDialog();
        setStage(2);
      },
    });
  };

  /* If the OTP is correct and a new password entered by the user, this function sets their new password */
  const resetPassword = (event) => {
    event.preventDefault();

    if (password !== confirmPassword) {
      setErrorMsg("Passwords do not match.");
      toggleErrorDialog();
      return;
    }

    getUser().confirmPassword(code, password, {
      onSuccess: (data) => {
        // console.log("onSuccess:", data);
        setStage(3);
      },
      onFailure: (err) => {
        setErrorMsg(err.message);
        toggleErrorDialog();
      },
    });
  };

  /* Password+confirm password input fields are disabled by default. Once the user has entered in a OTC/OTC, enable the password+confirm password input fields */
  const togglePasswordEnter = (otpVal) => {
    setCode(otpVal);
    document.getElementById("pw1").removeAttribute("disabled");
    document.getElementById("pw2").removeAttribute("disabled");
  };

  return (
    // Top section, including butterfly Image, page title, and background
    <div
      className="d-flex flex-column justify-content-center align-items-center vh-100 vw-100 px-5"
      style={{ backgroundColor: "#B9DBDA", textAlign: "center" }}
    >
      <Image
        id="butterflyImage"
        src={butterflyImage}
        style={{ width: "75%" }}
      />

      <p
        className="mb-2"
        style={{
          color: "#FD5A89",
          fontSize: "30px",
          fontWeight: "bold",
        }}
      >
        Forgot password
      </p>
      {/* Stage 1 */}
      {stage === 1 && (
        <form onSubmit={sendCode}>
          <label htmlFor="email">Email:</label>
          <input
            value={email}
            required
            id="email"
            style={{ marginLeft: "10px" }}
            onChange={(event) => setEmail(event.target.value)}
          />
          <br />
          <Button
            type="submit"
            style={{
              backgroundColor: "#FD5A89",
              marginTop: "20px",
              border: "none",
              color: "#000000",
              fontWeight: "bold",
            }}
          >
            Reset My Password
          </Button>
        </form>
      )}

      {/* Stage 2 */}
      {stage === 2 && (
        <form onSubmit={resetPassword}>
          <Form.Group className="mb-3" controlId="formOTC">
            <Form.Label className="mb-0">One-time Code</Form.Label>
            <Form.Control
              type="code"
              required
              value={code}
              onChange={(event) => togglePasswordEnter(event.target.value)}
            />
          </Form.Group>
          <Form.Group className="mb-3 d-flex flex-column">
            <Form.Label className="mb-0">New Password</Form.Label>
            <Form.Control
              id="pw1"
              type="password"
              required
              disabled
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label className="mb-0">Confirm Password</Form.Label>
            <Form.Control
              id="pw2"
              type="password"
              required
              disabled
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
          </Form.Group>
          <Button type="submit">Change password</Button>
        </form>
      )}

      {/* Stage 3 */}
      {stage === 3 && (
        <>
          <p> Please log in with new credentials</p>
          <Link href="/">Login</Link>
        </>
      )}

      {/* Login + Sign-up area */}
      {stage !== 3 && (
        <div
          style={{
            marginTop: "20px",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-around",
            flexDirection: "column",
            minHeight: "75px",
          }}
        >
          <Link href="/" underline="none" style={{ color: "#000000" }}>
            Login
          </Link>
          <Link href="/" underline="none" style={{ color: "#000000" }}>
            Sign-up
          </Link>
        </div>
      )}

      {/* Define error dialog. NOTE: This can be moved into its own file if we want */}
      <Dialog
        disableEscapeKeyDown
        open={openError}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">{"Oops ..."}</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            {errorMsg}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={toggleErrorDialog} autoFocus>
            Okay
          </Button>
        </DialogActions>
      </Dialog>

      {/* Define "One-time code alert" dialog. NOTE: This can be moved into its own file if we want */}
      <Dialog
        disableEscapeKeyDown
        open={openOTPAlert}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">{"Success"}</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Please check your email for a one-time code.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={toggleOTPDialog} autoFocus>
            Okay
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
