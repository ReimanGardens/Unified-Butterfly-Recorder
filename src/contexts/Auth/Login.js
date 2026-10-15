import { useContext, useState } from "react";
import { AccountContext } from "./Account";
import { Form, Image, Button } from "react-bootstrap";
import butterflyImage from "images/loginButterFly.png";
import { useNavigate } from "react-router-dom";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import Link from "@mui/material/Link";

import "css/loginPage.css";

export default function Login({ toggleFunction }) {
  const [open, setOpen] = useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const { authenticate } = useContext(AccountContext);
  const navigate = useNavigate();

  const onSubmit = (e) => {
    e.preventDefault();

    if (validateForm()) {
      authenticate(username, password)
        .then(() => {
          navigate("/auth/home");
        })
        .catch((err) => {
          console.log(err);
          handleClickOpen(err);
        });
    }
  };

  const validateForm = () => {
    if (username.length > 0 && password.length > 0) {
      return true;
    } else {
      handleClickOpen();
      return false;
    }
  };

  return (
    <div
      className="d-flex flex-column justify-content-center align-items-center vh-100 vw-100 px-5"
      style={{ backgroundColor: "#B9DBDA" }}
    >
      <Image src={butterflyImage} />
      <p
        className="mb-2"
        style={{ color: "#FD5A89", fontSize: "50px", fontWeight: "bolder" }}
      >
        UBR
      </p>
      <Form onSubmit={onSubmit} className="formControl">
        <Form.Group className="mb-3" controlId="formEmail">
          <Form.Label className="mb-0">Email</Form.Label>
          <Form.Control
            type="email"
            placeholder=""
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
        </Form.Group>
        <Form.Group className="mb-3" controlId="formPassword">
          <Form.Label className="mb-0">Password</Form.Label>
          <Form.Control
            type="password"
            placeholder=""
            value={password}
            onChange={(e) => setPassword(e.target.value)}
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
            Login
          </Button>
        </div>
      </Form>
      <a href="#" className="mt-3" onClick={toggleFunction} style={{ color: "#000000", textDecoration: "none" }}>
        Sign-up
      </a>



      <Link
          className="mt-3"
          href="/forgotPassword"
        underline="none"
        style={{ color: "#000000" }}
      >
        Forgot Password
      </Link>
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">{"Login Failure"}</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Please verify that you have entered a correct username and password
            combination.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} autoFocus>
            Okay
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
