import React, { useContext, useEffect } from "react";
import { FaBars } from "react-icons/fa";
import { TbButterfly } from "react-icons/tb";
import { Container, Navbar, Nav } from "react-bootstrap";
import { AiOutlineHome } from "react-icons/ai";
import {
  BsPlusCircle,
  BsClipboard,
  BsSearch,
  BsFillPauseFill,
  BsFillPlayFill,
  BsStopFill,
} from "react-icons/bs";
import { FiSettings } from "react-icons/fi";
import { SurveyContext } from "contexts/surveyContext/surveyContext";
import AlphaNumericDropdown from "./AlphaDrop";
import NumericDropdown from "./NumericDrop";
import { MdCancel, MdOutlineCancel } from "react-icons/md";
import { NavLink, useNavigate } from "react-router-dom";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import { Button } from 'react-bootstrap';

export const TopNavbar = ({ toggle }) => {
  const navigate = useNavigate();
  const {
    surveyPaused,
    surveyActive,
    getPersistedSurvey,
    toggleSurveyPause,
    toggleSearchBar,
    isPollard,
    pollardSectionQuantity,
    pollardNumOrAlpha,
    clearIDXBD,
  } = useContext(SurveyContext);

  useEffect(() => {
    getPersistedSurvey();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleCancel = async () => {
    handleClose();
    await clearIDXBD().then(() => {
      navigate("/auth/home");
    });
  };

  const [open, setOpen] = React.useState(false);
      
  const handleClose = () => {
      setOpen(false);
  };

  const handleOpen = () => {
    setOpen(true);
  };

  return (
    <Navbar fixed="top" style={{ backgroundColor: "#24948B" }}>
      <Container>
        <Nav className="justify-content-between w-100">
          <Nav.Link href="/auth/home">
            <TbButterfly size={30} color={"white"} />
          </Nav.Link>
          {surveyActive && (
            <>
              {isPollard && (
                <>
                  {pollardNumOrAlpha === "Alpha" ? (
                    <>
                      <AlphaNumericDropdown n={pollardSectionQuantity} />
                    </>
                  ) : (
                    <>
                      <NumericDropdown n={pollardSectionQuantity} />
                    </>
                  )}
                </>
              )}
              <BsSearch
                size={35}
                color={"white"}
                onClick={toggleSearchBar}
                style={{ paddingTop: "5px" }}
              />
              {!surveyPaused ? (
                <BsFillPauseFill
                  size={40}
                  color={"white"}
                  onClick={toggleSurveyPause}
                />
              ) : (
                <BsFillPlayFill
                  size={40}
                  color={"white"}
                  onClick={toggleSurveyPause}
                />
              )}
              <MdOutlineCancel
                size={40}
                color={'#fd5a89'}
                onClick={handleOpen}
              />
              <Dialog
                open={open}
                onClose={handleClose}
                aria-labelledby="responsive-dialog-title"
              >
                <DialogTitle id="responsive-dialog-title">
                  {"Cancel Survey?"}
                </DialogTitle>
                <DialogContent>
                  <DialogContentText>
                    You may continue your current survey or delete all progress
                  </DialogContentText>
                </DialogContent>
                <DialogActions>
                  <Button width='50%' style={{ backgroundColor: '#24948b', border: '#24948b'}} onClick={handleClose} autoFocus>
                    No, Continue Survey
                  </Button>
                  <Button style={{backgroundColor: '#fd5a89', border: '#fd5a89'}} onClick={handleCancel} autoFocus>
                    Yes, Cancel
                  </Button>
                </DialogActions>
              </Dialog>
            </>
          )}
        </Nav>
      </Container>
    </Navbar>
  );
};

export function BottomNavBar() {
  const { surveyActive } = useContext(SurveyContext);

  return (
    <Navbar fixed="bottom" style={{ backgroundColor: "#24948B" }}>
      <Container>
        <Nav className="justify-content-between align-items-center w-100">
          {/* //when ever we go home we cancel the survey for now */}
          <Nav.Link href="/auth/home">
            <AiOutlineHome size={30} color={"white"} />
          </Nav.Link>
          <NavLink
            className="mb-0"
            to={
              surveyActive
                ? "/auth/activeSurveyButterflies"
                : "/auth/createSurvey"
            }
            state={{ active: false, surveyObject: {} }}
          >
            <BsPlusCircle size={30} color={"white"} />
          </NavLink>
          <Nav.Link to={"/auth/loadedlists"} href="/auth/loadedlists">
            <BsClipboard size={30} color={"white"} />
          </Nav.Link>
          <Nav.Link href="/auth/settings">
            <FiSettings size={30} color={"white"} />
          </Nav.Link>
        </Nav>
      </Container>
    </Navbar>
  );
}
