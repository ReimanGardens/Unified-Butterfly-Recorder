import React, { useContext, useState, useEffect } from "react";
import { ListContext } from "contexts/listContext";
import Card from 'react-bootstrap/Card';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import { SurveyContext } from "contexts/surveyContext/surveyContext";
import { CreateCards } from "../ActiveSurvey/createCards.js";
import { Button, Form, InputGroup, Tab, Tabs } from "react-bootstrap";




const ListDashboard = () =>
{
    const { managedButterflyList, getSortedListByState } = useContext(ListContext);
    const [ Search, setSearch ] = useState("");
    const [ displayedList, setDisplayedList ] = useState([]);

    const Survey_Context = useContext(SurveyContext);
    const List_Context = useContext(ListContext);

    
    useEffect(() => {
        setDisplayedList(getSortedListByState(""));
    },[managedButterflyList]);

    const inNavBars = {
        marginTop: "55px",
        top: "70",
        backgroundColor: "#B9DBDA",
        height:"90vh",
    };

    //use ListContext's filtering functionality to get list entries by state
    function filterButterflyList()
    {
        setDisplayedList(getSortedListByState(Search));
    };

    return(
        <div className="d-flex flex-column" style = {inNavBars}>
            <div className="d-flex flex-column align-items-center px-3 pt-1" >
                <p className="text-center">Get butterflies by US state code or by country code. Leave empty for all butterflies</p>
                <InputGroup className="mb-3 w-75">
                    <Form.Control type="text" placeholder="Enter state or country code" onChange={e => setSearch(e.target.value)} />
                    <Button variant="secondary" onClick={() => filterButterflyList()}>
                        Filter
                    </Button>
                </InputGroup>
            </div>
            <Tabs
                defaultActiveKey="byState"
                id="uncontrolled-tab-example"
                className="mb-3"
                justify
            >
                <Tab eventKey="byState" title="By State/Country" >
                    <CreateCards 
                        Survey_Context={Survey_Context}
                        List_Context={List_Context}
                        butterflyList3D={displayedList}
                        height={"65vh"}
                        favorite={false}
                        listDashboardView={true}
                    />
                </Tab>
                <Tab eventKey="favorites" title="Favorites">
                    <CreateCards 
                        Survey_Context={Survey_Context}
                        List_Context={List_Context}
                        butterflyList3D={displayedList}
                        height={"65vh"}
                        favorite={true}
                        listDashboardView={true}
                    />
                </Tab>
            </Tabs>
        </div>
    );

};

export default ListDashboard;
