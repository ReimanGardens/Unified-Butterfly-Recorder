import React, { useContext, useEffect, useState, useMemo } from "react";
import { ListContext } from "contexts/listContext";
import { SurveyContext } from "contexts/surveyContext/surveyContext";
import { FinishButton } from "./finishButton";
import { ReviewButton } from "./reviewButton";
import { CreateCards } from "./createCards";
import ActiveSurveySearchBar from "./ActiveSurveySearchBar";
import { Tab, Tabs} from 'react-bootstrap'

export default function ActiveSurvey() {
  const Survey_Context = useContext(SurveyContext);
  const List_Context = useContext(ListContext);
  const [allButterflyListFiltered3D, setAllButterflyListFiltered3D] = useState(List_Context.sortedManagedButterflyList)
  const [butterflyList3D, setButterflyList3D] = useState(List_Context.sortedListByState);

  /* Persistent storage for survey object */
  useEffect(() => {
    Survey_Context.getPersistedSurvey()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    setButterflyList3D(List_Context.sortedListByState);
  }, [List_Context.sortedListByState]);

  
  return (
    <div
      style={{
        backgroundColor: "#B9DBDA",
        paddingTop: "62px",
        paddingBottom: "62px",
        paddingRight: "0px",
        height: "95vh",
      }}
    >
      <ActiveSurveySearchBar  
        Survey_Context={Survey_Context}
        List_Context={List_Context}
        setAllButterflyListFiltered3D={setAllButterflyListFiltered3D}
      />
      {<Tabs
        defaultActiveKey="byState"
        id="uncontrolled-tab-example"
        className="mb-3"
        justify
      >
        <Tab eventKey="byState" title="By State" >
          {Survey_Context.searchBar ? 
          <CreateCards 
              Survey_Context={Survey_Context}
              List_Context={List_Context}
              butterflyList3D={allButterflyListFiltered3D}
              height={"75vh"}
              favorite={false}
              listDashboardView={false}
          />
          :
          <CreateCards 
              Survey_Context={Survey_Context}
              List_Context={List_Context}
              butterflyList3D={butterflyList3D}
              height={"80vh"}
              favorite={false}
              listDashboardView={false}
          />
          }
        </Tab>
        <Tab eventKey="favorites" title="Favorites">
          {Survey_Context.searchBar ? 
          <CreateCards 
              Survey_Context={Survey_Context}
              List_Context={List_Context}
              butterflyList3D={List_Context.sortedManagedButterflyList}
              height={"75vh"}
              favorite={true}
              listDashboardView={false}
          />
          :
          <CreateCards 
              Survey_Context={Survey_Context}
              List_Context={List_Context}
              butterflyList3D={List_Context.sortedManagedButterflyList}
              height={"80vh"}
              favorite={true}
              listDashboardView={false}
          />
          }
        </Tab>
      </Tabs>}
      <ReviewButton surveyObject={Survey_Context.surveyObject} />
      <FinishButton Survey_Context={Survey_Context} />
    </div>
  );
}
