import React, { useState, useEffect, useCallback, useRef, useContext } from 'react';
import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";
import Card from "react-bootstrap/Card";
import { FaStar } from "react-icons/fa";
import { BiUpArrow, BiDownArrow } from "react-icons/bi";
import "../../css/activeSurvey.css";
import {SurveyContext} from "../../contexts/surveyContext/surveyContext";
import {useNavigate} from "react-router-dom";


export const InnerCard = ({createSighting, butterflyInfo, surveyPaused, List_Context, surveyObject, listDashboardView}) => {
    const SurveyObj = useContext(SurveyContext);
    const [surveyType, setSurveyType] = useState(SurveyObj.generalData.surveyType)
    var coolDown = 3000;

    useEffect(() => {
        setSurveyType(SurveyObj.generalData.surveyType);
        if (surveyType === "Incidental") {
            coolDown = 0;
        }
    }, [SurveyObj]);


    const [starColor, setStarColor] = useState("grey");

    const [uiCount, setUiCount] = useState(0)

    const timerRef = useRef(null);

    const navigate = useNavigate();
    if (surveyType === "Incidental") {
        coolDown = 0;
    }


    const onIncrement = useCallback(() => {
        if(surveyType === "Incidental"){
            createSighting(1).then(navigate("/auth/surveyDetails", {
                state: {surveyObject: surveyObject, defaultTabKey: "sightings", currentSurveyView: true},
            }));
        }
        else{
            setUiCount(prevState => {
                clearTimeout(timerRef.current);
                timerRef.current = setTimeout(() => {
                    createSighting(prevState + 1)
                    setUiCount(0)
                }, coolDown);
                return prevState + 1;
            })
        }
    }, [surveyType]);

    const onDecrement = useCallback(() => {
      setUiCount(prevState => {
        if(prevState === 0){
          return 0
        }
        clearTimeout(timerRef.current);
        timerRef.current = setTimeout(() => {
          if(prevState - 1 > 0){
            createSighting(prevState - 1)
          }
          setUiCount(0)
        }, coolDown);
        return prevState - 1;
      })
    }, []);

    const handleStarColorChange = (e) => {
      if(starColor === "grey"){
        List_Context.addToFavorites(e);
      }
      else{
        List_Context.removeFromFavorites(e);
      }
      butterflyInfo?.favorite === "true" ? setStarColor("gold") : setStarColor("grey");
    };

  
    return (
        <Card className="text-center" style={{backgroundColor:`${surveyPaused ? "#B9DBDA":""}`, height: "100%"}}>
          <Card.Body>
            <Row>
              <Col xs={2}>
                {/* Solution without absolute positioning */}
                <Card.Text
                  onClick={() => handleStarColorChange(butterflyInfo?.id)}
                  style={{ color: starColor }}
                >
                  <FaStar size={20} color={butterflyInfo?.favorite === "true" ? "gold" : "grey"} />
                </Card.Text>
              </Col>
              <Col
                xs={8}
                onClick={() => {
                  if(!listDashboardView && !surveyPaused){
                    onIncrement()
                  }
                }}
                className="d-flex justify-content-center"
              >
                <div className="circle" style={{background:  List_Context.getColorFromSubFamily(butterflyInfo?.scientificfamily, butterflyInfo?.scientificsubfamily)}}></div>
              </Col>
              <Col xs={2} className={listDashboardView ? "d-none":""}>
                {/* Solution with absolute positioning */}
                <Card.Text
                  className="m-0"
                  onClick={() => {
                    if(!surveyPaused){
                      onIncrement()
                    }
                  }}
                  style={{ position: "absolute", top: 0, right: 5 }}
                >
                  <BiUpArrow size={18} color={"black"} />
                </Card.Text>
                <Card.Text
                  className="m-0"
                  style={{ fontSize: 18, position: "absolute", top: 20, right: 8 }}
                >
                  {uiCount}
                </Card.Text>
                <Card.Text
                  className="m-0"
                  onClick={() => {
                    if(!surveyPaused){
                      onDecrement()
                    }
                  }}
                  style={{ position: "absolute", top: 40, right: 5 }}
                >
                  <BiDownArrow size={18} color={"black"} />
                </Card.Text>
              </Col>
            </Row>
            <Row 
              style={{ height: "75%"}}
              onClick={() => {
                if(!listDashboardView && !surveyPaused){
                  onIncrement()
                }
              }}
            >
              <Card.Title style={{ fontSize: 17, paddingTop: '5px', paddingLeft: '0px', paddingRight: '0px', marginBottom: '0px'}}>
                {butterflyInfo?.genericname}
              </Card.Title>
              <Card.Subtitle style={{ fontSize: 15, paddingLeft: '0px', paddingRight: '0px' }}>
                {butterflyInfo?.scientificname}
              </Card.Subtitle>
            </Row>
          </Card.Body>
        </Card>
      )    
}
