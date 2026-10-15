import React, {useEffect, useState, useContext} from 'react'

import {Button, Image, Spinner} from 'react-bootstrap'
import {FaPlus, FaListAlt, FaRegTrashAlt} from 'react-icons/fa';
import {MdViewList} from 'react-icons/md';
import {BiSortDown, BiSortUp} from 'react-icons/bi';
import {useNavigate} from "react-router-dom";
import {SurveyContext} from "contexts/surveyContext/surveyContext";
import {AccountContext} from "contexts/Auth/Account";
import config from "config";
import MapComponent from "../components/Map/StaticMap";
import {Pagination} from 'react-bootstrap';
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";


export default function Home() {
    const {currentUsername, surveyActive} = useContext(AccountContext);
    const navigate = useNavigate()
    const [view, setView] = useState(true);
    const [sort, setSort] = useState(true);
    const [totalPages, setTotalPages] = useState(1);
    const [currentPage, setCurrentPage] = useState(1);
    const [paginationNumToShow, setPaginationNumToShow] = useState(1);

    const [previousSurveyList, setPreviousSurveyList] = useState(null)


    useEffect(() => {
        const fetchData = async () => {
            await fetch(`${config.surveyApiUrl}?user=${currentUsername}`, {
                method: "GET",
            })
                .then(res => res.json())
                .then(res => {
                    setPreviousSurveyList(res.sort((a, b) => new Date(b.date) - new Date(a.date)));
                    let temp = Math.ceil((res.length || 0) / 5);
                    setTotalPages(temp);
                    setPaginationNumToShow(temp > 3 ? 3 : temp)
                })
                .catch(error => {
                    setPreviousSurveyList([]);
                    console.log('error', error);
                });
        }
        fetchData();
    }, [])

    function onToggleView() {
        setView(prevState => !prevState)
    }

    function onToggleSort() {
        setSort(prevState => {
            return !prevState
        })
        setPreviousSurveyList(prevState => {
            return prevState.reverse()
        })
    }

    function addPagination() {
        return (
            <div className="mx-auto" style={{display: "flex", justifyContent: "center", marginBottom: "0px", padding: "0px"}}>
                <Pagination className="p-2 pagination" style={{display: "flex", justifyContent: "center", marginBottom: "0px", padding: "0px", }}hidden={!view}>
                    <Pagination.Prev
                        onClick={() => {
                            setCurrentPage(prevState => prevState - 1)
                            window.scrollTo({top: 0, behavior: 'instant'})
                        }}
                        disabled={currentPage === 1}
                    />
                    {Array.from({ length: paginationNumToShow }, (_, i) => (
                        <Pagination.Item
                            key={i}
                            active={i + 1 === currentPage}
                            onClick={() => {
                                setCurrentPage(i + 1)
                                window.scrollTo({top: 0, behavior: 'instant'})
                            }}
                        >
                            {i + 1}
                        </Pagination.Item>
                    ))}
                    {totalPages > 3 &&
                    <>
                      <Pagination.Ellipsis />
                      <Pagination.Item
                          key={totalPages}
                          active={totalPages === currentPage}
                          onClick={() => {
                              setCurrentPage(totalPages)
                              window.scrollTo({top: 0, behavior: 'instant'})
                          }}
                      >
                          {totalPages}
                      </Pagination.Item>
                    </>
                    }
                    <Pagination.Next
                        onClick={() => setCurrentPage(prevState => prevState + 1)}
                        disabled={currentPage === totalPages}
                    />
                </Pagination>
            </div>
        );
    }


    const navigateToCreateSurvey = () => {
      if (surveyActive) {
          navigate('/auth/activeSurveyButterflies');
      } else {
          navigate('/auth/createSurvey', {state: {active: false, surveyObject: {}}});
      }
    };


    return (
        <div style={{backgroundColor: "#B9DBDA", padding: "110px 0 65px 0", minHeight: "100vh"}}>
            <div className="d-flex flex-row justify-content-between" style={{backgroundColor: "#B9DBDA", position: "fixed", top: "60px", left: 0, right: 0, margin: "auto"}}>
                <div className='p-2' onClick={onToggleView}>
                    {view ? <MdViewList size={33}/> : <FaListAlt size={33}/>}
                </div>
                <div>
                    {addPagination()}
                </div>
                <div className='p-2' onClick={onToggleSort}>
                    {sort ? <BiSortDown size={33}/> : <BiSortUp size={33}/>}
                </div>
            </div>

            {
                previousSurveyList ?
                    <>
                      {previousSurveyList.length > 0 ? 
                        <div className="d-flex flex-column gap-4">
                            {
                                previousSurveyList
                                    .slice(
                                        (currentPage - 1) * 5,
                                        view ? currentPage * 5 : previousSurveyList.length
                                    )
                                    .map((item, index) => {
                                        return <SurveyCard key={index} view={view} surveyInfo={item}
                                                           num={(currentPage - 1) * 5 + index}/>;
                                    })
                            }
                        </div>
                        :
                        <div
                          style={{
                            display: "flex",
                            height: "75vh",
                            alignItems: "center",
                          }}
                        >
                          <div
                            style={{
                              width: "95%",
                              backgroundColor: "white",
                              borderRadius: "15px",
                              padding: "15px",
                              margin: "auto",
                            }}
                          >
                            <p className="text-center mb-0">Welcome to the Unified Butterfly Recorder!</p> <br />{" "}
                            <p className="text-center mb-0">
                              Click{" "}
                              <Button
                                className="fw-bold"
                                onClick={navigateToCreateSurvey}
                                style={{
                                  backgroundColor: "#FD5A89",
                                  border: "none",
                                  color: "#000000",
                                  borderRadius: "15px",
                                }}
                              >
                                Survey <FaPlus size={20} />
                              </Button>{" "}
                              to get started.
                            </p>
                          </div>
                        </div>
                      }
                    </>
                    :
                    <div className='d-flex justify-content-center py-5'>
                        <Spinner animation="border" variant="secondary"/>
                    </div>
            }

            <CreateSurveyButton/>
        </div>
    )
}

const CreateSurveyButton = () => {
    const {
        surveyActive,
    } = useContext(SurveyContext);
    const navigate = useNavigate();
    const navigateToCreateSurvey = () => {
        if (surveyActive) {
            navigate('/auth/activeSurveyButterflies');
        } else {
            navigate('/auth/createSurvey', {state: {active: false, surveyObject: {}}});
        }
    };
    return (
        <Button className="fw-bold" onClick={navigateToCreateSurvey} style={{
            position: "fixed",
            backgroundColor: "#FD5A89",
            border: "none",
            color: "#000000",
            borderRadius: "15px",
            bottom: "80px",
            right: "10px"
        }}>
            Survey <FaPlus size={20}/>
        </Button>
    )
};

function SurveyCard({view, surveyInfo}) {
    const navigate = useNavigate()
    const [showDeleteModal, setShowDeleteModal] = useState(false);

    const deleteUserSurvey = () => {
      console.log("Deleting user survey...");

      var myHeaders = new Headers();
      myHeaders.append("Content-Type", "text/plain");
      myHeaders.append("Access-Control-Allow-Origin", "*");

      var raw = {
        surveyUserName: surveyInfo.user,
        surveyDate: surveyInfo.date,
      };

      const rawToString = JSON.stringify(raw);

      var requestOptions = {
        method: "DELETE",
        headers: myHeaders,
        body: rawToString,
        redirect: "follow",
      };

      fetch(
        config.surveyApiUrl,
        requestOptions
      )
        .then((response) => response.text())
        .then((result) => window.location.reload())
        .catch((error) => console.log("error", error));
    };

    return (
        <div
            className="d-flex justify-content-center"
            style={{backgroundColor: "#B9DBDA", width: "100%"}}
        >
            <div
                className="d-flex flex-column justify-content-center col-12 col-md-4"
                style={{backgroundColor: "white"}}
            >
                <div
                    onClick={() =>
                        navigate('/auth/surveyDetails', {state: {surveyObject: surveyInfo?.survey, defaultTabKey: "overview"}})
                    }
                    className="d-flex flex-row px-3 py-2"
                >
                    <div className="d-flex flex-column flex-grow-1">
                        <div className="d-flex flex-row gap-2 align-items-center">
                            <p className="mb-0 fst-italic ">{surveyInfo?.user}</p>
                        </div>
                        <p className="fs-2 fw-bold">{surveyInfo?.survey?.generalData?.surveyName}</p>
                    </div>
                    <div className="d-flex flex-column text-end flex-grow-1">
                        <p className="mb-2 fw-bold">{(new Date(surveyInfo?.date)).toLocaleString()}</p>
                        <p className="mb-0">Duration: <span
                            className="fw-bold">{surveyInfo?.survey?.surveyDuration}</span></p>
                    </div>
                </div>
                {
                    view && <MapComponent surveyObject={surveyInfo?.survey} fluid/>
                }
                <Button variant="dark" style={{borderRadius:0}} onClick={() => setShowDeleteModal(true)} >
                  <FaRegTrashAlt size="25" color="red" />
                </Button>
            </div>
            <Dialog
                open={showDeleteModal}
                onClose={() => setShowDeleteModal(false)}
                aria-labelledby="responsive-dialog-title"
              >
                <DialogTitle id="responsive-dialog-title">
                  Confirm Delete
                </DialogTitle>
                <DialogContent>
                  <DialogContentText>
                    Are you sure you want to delete?
                  </DialogContentText>
                </DialogContent>
                <DialogActions>
                  <Button width='50%' style={{ backgroundColor: '#24948b', border: '#24948b'}} onClick={() => setShowDeleteModal(false)} autoFocus>
                    Cancel
                  </Button>
                  <Button style={{backgroundColor: '#fd5a89', border: '#fd5a89'}} onClick={deleteUserSurvey} autoFocus>
                    Delete
                  </Button>
                </DialogActions>
              </Dialog>
        </div>
    )
}
