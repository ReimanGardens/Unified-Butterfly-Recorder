import React, { useContext, useEffect, useState } from 'react'
import {Button, Col, Container, Image, Row, Tab, Form} from 'react-bootstrap'
import surveyDetailsImage from "images/surveyDetailsImage.svg"
import { SurveyContext } from 'contexts/surveyContext/surveyContext';
import ParseTimer from "components/Timer/ParseSecondsTimer";
import { StringTimer } from 'components/Timer/ParseSecondsTimer';
import { FaEdit } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import MapComponent from "../components/Map/StaticMap";
import { convertToFarenheit } from 'components/Uitilities';

export default function SurveyOverviewPage({surveyObject, currentSurveyView}) {
  const navigate = useNavigate()
  const { timer, surveyActive} = useContext(SurveyContext);
  const [ surveyData, setSurveyData ] = useState(surveyObject)

  function onEditSurveyDetils(){
    navigate('/auth/createSurvey', {state: {active: true, surveyObject: surveyData}});
  }

  return (
    <div>
        <div className="d-flex flex-row justify-content-center align-items-center mb-3 ">
            <p className="fs-4 mb-0 flex-grow-1" >{surveyData?.generalData?.surveyName}</p>
            {surveyActive && currentSurveyView && <FaEdit size={25} onClick={() => onEditSurveyDetils()} />}
        </div>
        <MapComponent surveyObject={surveyObject}/>
        <Container className=''>
            <Row className="" style={{borderBottom:"1px solid #000000"}}>
            <Col style={{borderRight:"1px solid #000000"}}>
                <p className="mb-2 text-muted" style={{fontSize:"10px"}}>Number of Surveyors</p>
                <p className="mb-2">{surveyData?.generalData?.numberOfSurveyors}</p>
            </Col>
            
            <Col>
                <p className="mb-2 text-muted" style={{fontSize:"10px"}}>Names of Surveyors</p>
                <p className="mb-2">{surveyData?.generalData?.namesOfSurveyors}</p>
            </Col>
            </Row>
            <Row className="" style={{borderBottom:"1px solid #000000"}}>
            <Col style={{borderRight:"1px solid #000000"}}>
                <p className="mb-2 text-muted" style={{fontSize:"10px"}}>Locations Name</p>
                <p className="mb-2">{surveyData?.generalData?.surveyState}</p>
            </Col>
            
            <Col>
                <p className="mb-2 text-muted" style={{fontSize:"10px"}}>Total Survey Time (H:M:S)</p>
                {surveyActive && currentSurveyView ?
                    <ParseTimer time={timer} />
                    :
                    StringTimer(surveyData.timer)
                }
            </Col>
            </Row>
            <Row className="" style={{borderBottom:"1px solid #000000"}}>
            <Col style={{borderRight:"1px solid #000000"}}>
                <p className="mb-2 text-muted" style={{fontSize:"10px"}}>Habitat Type</p>
                <p className="mb-2">{surveyData?.generalData?.habitatType}</p>
            </Col>
            
            <Col>
                <p className="mb-2 text-muted" style={{fontSize:"10px"}}>Habitat Condition</p>
                <p className="mb-2">{surveyData?.generalData?.habitatCondition}</p>
            </Col>
            </Row>
            <Row className="" style={{borderBottom:"1px solid #000000"}}>
            <Col style={{borderRight:"1px solid #000000"}}>
                <p className="mb-2 text-muted" style={{fontSize:"10px"}}>Cloud Cover</p>
                <p className="mb-2">{surveyData?.apiWeatherData?.cloudCover}</p>
            </Col>
            
            <Col>
                <p className="mb-2 text-muted" style={{fontSize:"10px"}}>Wind Speed (mph)</p>
                <p className="mb-2">{surveyData?.apiWeatherData?.windSpeed}</p>
            </Col>
            </Row>
            <Row className="" style={{borderBottom:"1px solid #000000"}}>
            <Col style={{borderRight:"1px solid #000000"}}>
                <p className="mb-2 text-muted" style={{fontSize:"10px"}}>Temperature (F)</p>
                <p className="mb-2">{convertToFarenheit(surveyData?.apiWeatherData?.mainTemp)}</p>
            </Col>
            
            <Col>
                <p className="mb-2 text-muted" style={{fontSize:"10px"}}>Viewing Radius (meters)</p>
                <p className="mb-2">{surveyData?.generalData?.viewingRadius}</p>
            </Col>
            </Row>
            <Row className="">
            <Col style={{borderRight:"1px solid #000000"}}>
                <p className="mb-2 text-muted" style={{fontSize:"10px"}}>Level of Engagement (1 is low)</p>
                <p className="mb-2">{surveyData?.generalData?.engagementLevel}</p>
            </Col>

            <Col>
                <p className="mb-2 text-muted" style={{fontSize:"10px"}}>Comments</p>
                <p className="mb-2">{surveyData?.generalData?.comments}</p>
            </Col>
            </Row>
        </Container>
    </div>
  )
}

