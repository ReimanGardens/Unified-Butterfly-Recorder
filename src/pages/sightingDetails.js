import React, { useContext, useEffect, useState } from "react";
import NumSeen from "../components/SightingDetails/numSeen";
import { DropdownValue } from "components/Dropdown/dropdown";
import { Button, Form, Image, InputGroup } from "react-bootstrap";
import { useNavigate, useLocation } from "react-router-dom";
import { SurveyContext } from "contexts/surveyContext/surveyContext";
import ButterflyPic from 'images/loginButterFly.png'
import { swalIsLoading } from "components/Uitilities";
import { swalSuccess } from "components/Uitilities";
import { ListContext } from "contexts/listContext";
import { Autocomplete, TextField } from "@mui/material";


const SightingDetails = () => {
    const {
        getPersistedSurvey,
        updateSightingByID
    } = useContext(SurveyContext);
    const List_Context = useContext(ListContext);
    const managedButterflyList = List_Context.managedButterflyList;
    const location = useLocation();
    const {surveyObject, sightingInfo, currentSurveyView} = location.state
    const [numSeen, setNumSeen] = React.useState(sightingInfo.number);
    const [section, setSection] = React.useState(sightingInfo.section);
    const [timeSeen, setTimeSeen] = React.useState(sightingInfo.time);
    const [comments, setComments] = React.useState(sightingInfo.comment);
    const [picture, setPicture] = React.useState(sightingInfo.picture);
    const [sections, setSections] = React.useState(
        surveyObject.generalData.sectionType === "Numeric" ? 
        Array.from({ length: surveyObject.generalData.numSections}, (_, i) => i + 1)
        :
        Array.from({ length: surveyObject.generalData.numSections}, (_, i) => String.fromCharCode(65 + i))
    );

    const [newButterflySpecies, setNewButterflySpecies] = useState(sightingInfo)

    const butterflyImage = ButterflyPic

    const navigate = useNavigate()

    let i = 0;

    useEffect(() => {
        getPersistedSurvey();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    function onSubmit() {
        swalIsLoading()
        let cloneObj = structuredClone(sightingInfo)
        cloneObj.number = numSeen
        cloneObj.section = section
        cloneObj.comment = comments
        cloneObj.genericname = newButterflySpecies.genericname
        cloneObj.commonfamily = newButterflySpecies.commonfamily
        cloneObj.commonsubfamily = newButterflySpecies.commonsubfamily
        cloneObj.scientificname = newButterflySpecies.scientificname
        cloneObj.picture = picture

        updateSightingByID(sightingInfo.sightingID, cloneObj)
        .then(() => {
            swalSuccess()
            navigate("/auth/surveyDetails", {state: {surveyObject: surveyObject, defaultTabKey:"sightings", currentSurveyView: currentSurveyView}})
        })
    }

    return (
        <>
            <div className="d-flex flex-column px-4" style={{paddingTop:"80px", paddingBottom:"80px"}}>
                <Button
                    variant="secondary"
                    className="mb-5"
                    onClick={() => {
                        navigate("/auth/surveyDetails", {state: {surveyObject: surveyObject, defaultTabKey:"sightings", currentSurveyView: currentSurveyView}})
                    }}
                >
                    Back
                </Button>

                <div className="d-flex flex-row align-items-center justify-content-between py-1 px-3 mb-4 text-center" style={{backgroundColor: "#B9DBDA", borderRadius:"10px"}} >
                    <Image src={butterflyImage} style={{width:"15%", aspectRatio: "1 / 1"}}/>
                    <div>
                        <p className="mb-0" style={{fontSize: "4vw", fontWeight:"bold"}}>{sightingInfo?.genericname}</p>
                        <p className="mb-0" style={{fontSize: "3vw"}}>{sightingInfo?.commonfamily}</p>
                        <hr className="my-1" />
                        <p className="mb-0" style={{fontSize: "3vw"}}>{sightingInfo?.commonsubfamily}</p>
                        <p className="mb-0" style={{fontSize: "4vw", fontWeight:"bold"}}>{sightingInfo?.scientificname}</p>
                    </div>
                    <p className="mb-0" style={{fontSize: "5vw", fontWeight:"bold"}}>{sightingInfo?.number}</p>
                </div>

                <Autocomplete
                    className="mb-4"
                    disabled={!currentSurveyView}
                    onChange={(event, newValue) => {
                        if(newValue){
                            setNewButterflySpecies(newValue)
                        }
                        else{
                            setNewButterflySpecies(sightingInfo)
                        }
                    }}
                    disablePortal
                    id="combo-box-demo"
                    options={managedButterflyList}
                    getOptionLabel={(option) => `(id:${option.id}) ${option.genericname}` }
                    renderOption={(props, option) => (
                        <div {...props} className="d-flex flex-column text-center my-3" style={{backgroundColor: "#B9DBDA"}}  >
                            <p className="mb-0" style={{fontSize: "4vw", fontWeight:"bold"}}>{option?.genericname}</p>
                            <p className="mb-0" style={{fontSize: "3vw"}}>{option?.commonfamily}</p>
                            <hr className="my-1" />
                            <p className="mb-0" style={{fontSize: "3vw"}}>{option?.commonsubfamily}</p>
                            <p className="mb-0" style={{fontSize: "4vw", fontWeight:"bold"}}>{option?.scientificname}</p>
                        </div>
                    )}
                    renderInput={(params) => <TextField {...params} label={newButterflySpecies.genericname} />}
                />

                <div className="mb-4">
                    <NumSeen value={numSeen} callback={(change) => setNumSeen(change)} disabled={!currentSurveyView} />
                </div>

                <Form.Group className="mb-4" controlId="exampleForm.ControlInput1">
                    <Form.Label>Time Seen:</Form.Label>
                    <Form.Control type="text" disabled value={timeSeen} onChange={(e) => setTimeSeen(e.target.value)} />
                </Form.Group>

                {surveyObject?.generalData?.surveyType === "Pollard" &&
                <Form.Group className="mb-4">
                    <Form.Label>Section:</Form.Label>
                    <DropdownValue disabled={!currentSurveyView} callback={(val) => setSection(val)} options={sections} initialValue={section} dWidth="100%" />
                </Form.Group>}

                <Form.Group className="mb-4" controlId="exampleForm.ControlInput1">
                    <Form.Label>Comments:</Form.Label>
                    <Form.Control as="textarea" rows={3} value={comments} onChange={(e) => setComments(e.target.value)} disabled={!currentSurveyView} />
                </Form.Group>

                <Form.Group className="mb-4" controlId="exampleForm.ControlInput1">
                    <input type="checkbox" checked={picture} onChange={(e) => setPicture(!picture)} disabled={!currentSurveyView} />
                    <Form.Label style={{paddingLeft:"5px"}}>Picture?</Form.Label>
                </Form.Group>

                {currentSurveyView && <div className="submit">
                    <Button 
                        style={{backgroundColor:"#D0D0D0", color:"#000000", width:"60%", fontSize:"130%", border:"none", boxShadow:"0 12px 16px 0 rgba(0,0,0,0.24),0 17px 50px 0 rgba(0,0,0,0.19)"}} 
                        onClick={() => onSubmit()}
                        >Submit Changes
                    </Button>
                </div>}
            </div>
        </>
    )
}

export default SightingDetails;