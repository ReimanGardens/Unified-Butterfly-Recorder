import * as React from 'react';
import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";
import { Container } from "react-bootstrap";
import { ButterflyCard } from './butterflyCard';

export const CreateCards = ({Survey_Context, List_Context, butterflyList3D, height, favorite, listDashboardView}) => {
    async function onAppendSighting(sightingObj){
        await Survey_Context.appendSightings(sightingObj)
    }

    if(butterflyList3D == null)
    {
        return(
            <div>
                No butterflies selected!
            </div>
        )
    }

    return(
        <div style={{height: height, overflowY:"auto"}}>
        {butterflyList3D.map((family, index) => (
            <div key={index}>
            {/* Maybe these divider colors can come from the family and subfamily, like icons */}
            <Container fluid>
                <Row style={{ background: List_Context.getColorFromSubFamily(family[0][0].scientificfamily, ""), color: "white" }}>
                    <Col xs={3}>
                        <b>Family:</b>
                    </Col>
                    <Col xs={5}>{family[0][0].commonfamily}</Col>
                    <Col xs={4}>{family[0][0].scientificfamily}</Col>
                </Row>
            </Container>
            {family.map((subfamily, index) => (
                <div key={index}>
                <Container fluid>
                    <Row style={{ background: List_Context.getColorFromSubFamily(family[0][0].scientificfamily, subfamily[0].scientificsubfamily), color: "white" }}>
                        <Col xs={3}>
                            <b>Subfamily:</b>
                        </Col>
                        <Col xs={5}>{subfamily[0].commonsubfamily}</Col>
                        <Col xs={4}>{subfamily[0].scientificsubfamily}</Col>
                    </Row>
                    <Row xs={2} md={3} xxl={4} className="g-1" spacing={1}>
                    {/* Eventually we'll want to pass icon (types?) and icon colors
                        Should we  pass in a reference to a css class for the icon? */}
                    {subfamily.map((butterfly, index) => {
                        if(!favorite || butterfly.favorite === "true")
                        {
                            return (
                                <Col key={index}>
                                    <ButterflyCard
                                        Survey_Context={Survey_Context}
                                        butterflyInfo={butterfly}
                                        // We may want to use this ID when doing surveyContext calls
                                        id={butterfly.id}
                                        List_Context={List_Context}
                                        onAppendSighting={onAppendSighting}
                                        listDashboardView={listDashboardView}
                                    />
                                </Col>
                            );
                        }
                    })}
                    </Row>
                </Container>
                </div>
            ))}
            </div>
        ))}
    </div>
    );
}