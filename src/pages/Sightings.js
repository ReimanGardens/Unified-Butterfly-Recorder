import React, { useContext, useState, useEffect } from "react";
import {Button, Image, Spinner} from 'react-bootstrap'
import { useNavigate } from "react-router-dom";
import {FaAngleRight, FaArrowLeft, FaCheck} from 'react-icons/fa';
// import ButterflyPic from 'images/loginButterFly.png'
import { SurveyContext } from 'contexts/surveyContext/surveyContext';
import "../css/activeSurvey.css";
import { ListContext } from "contexts/listContext";
import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";

export default function Home({surveyObject, currentSurveyView}) {
    const {surveyActive} = useContext(SurveyContext);

    return (
        <div style={{paddingBottom:"70px"}}>
            <div className="d-flex flex-column gap-2" style={{paddingTop: "4vw"}}>
                {
                    surveyObject.sightingsArray.map((item, index) => {
                        return <SightingCards 
                            key={index} 
                            sightingInfo={item} 
                            surveyObject={surveyObject} 
                            surveyActive={surveyActive}
                            currentSurveyView={currentSurveyView}
                        />
                    })
                }
            </div>
        </div>
    )
}

function SightingCards({sightingInfo, surveyObject, surveyActive, currentSurveyView}) {
    const navigate = useNavigate();
    // const butterflyImage = ButterflyPic
    const {getColorFromSubFamily} = useContext(ListContext);

    const ClickingCard = () => {
        navigate('/auth/sightings-detail', { state: {
            sightingInfo: sightingInfo, 
            surveyObject: surveyObject,
            currentSurveyView: currentSurveyView
        }});
    };

    return (
        <div style={{padding:"5px 10px"}}>
            <Row className="d-flex flex-row align-items-center justify-content-between py-1 px-3" style={{backgroundColor: "#B9DBDA", borderRadius:"10px"}} onClick={ClickingCard}  >
                {/* <Image src={butterflyImage} style={{width:"15%", aspectRatio: "1 / 1"}}/> */}
                <Col xs={2} className="circle" style={{width: "13%", marginLeft: '0px', marginRight: "0px", background: getColorFromSubFamily(sightingInfo?.scientificfamily, sightingInfo?.scientificsubfamily)}}></Col>
                <Col xs={8}>
                    <p className="mb-0" style={{fontSize: "4vw", fontWeight:"bold"}}>{sightingInfo?.genericname}</p>
                    <p className="mb-0" style={{fontSize: "3vw"}}>{sightingInfo?.commonfamily}</p>
                    <hr className="my-1" />
                    <p className="mb-0" style={{fontSize: "3vw"}}>{sightingInfo?.commonsubfamily}</p>
                    <p className="mb-0" style={{fontSize: "4vw", fontWeight:"bold"}}>{sightingInfo?.scientificname}</p>
                </Col>

                <Col xs={1}>
                    <p className="mb-0" style={{fontSize: "5vw", fontWeight:"bold"}}>{sightingInfo?.number}</p>
                </Col>
                <Col xs={1}>
                    <div>
                        {surveyActive && <FaAngleRight size={20} style={{paddingBottom: "4px"}}/>}
                    </div>
                </Col>
            </Row>
        </div>
    )
}
