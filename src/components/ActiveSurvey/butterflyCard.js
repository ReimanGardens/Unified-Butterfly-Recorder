import React, { useState } from 'react';
import { InnerCard } from './innerCard';
import { StringTimer } from "components/Timer/ParseSecondsTimer";
import _debounce from 'lodash/debounce';


export const ButterflyCard = ({Survey_Context, butterflyInfo, List_Context, onAppendSighting, listDashboardView}) => {
    const [refresh, setRefresh] = useState(true);

    const createSighting = async (count) => {
        var sightingsMap = new Map();
        sightingsMap.set("surveyID", 1);

        if (butterflyInfo?.genericname) {
            sightingsMap.set("genericname", butterflyInfo?.genericname);
        }
        sightingsMap.set("scientificname", butterflyInfo?.scientificname);
        sightingsMap.set("commonsubfamily", butterflyInfo?.commonsubfamily);
        sightingsMap.set("scientificsubfamily", butterflyInfo?.scientificsubfamily);
        sightingsMap.set("commonfamily", butterflyInfo?.commonfamily);
        sightingsMap.set("scientificfamily", butterflyInfo?.scientificfamily);
        sightingsMap.set("number", count);
        // sightingsMap.set("time", StringTimer(Survey_Context.timer)); //We are using time of day instead
        if (Survey_Context.isPollard) {
            sightingsMap.set("section", Survey_Context.currentPollardSection);
        }
        sightingsMap.set("xCoord", Survey_Context.location.latitude);
        sightingsMap.set("yCoord", Survey_Context.location.longitude);
        await onAppendSighting(Object.fromEntries(sightingsMap))
            .then(() => {
            setRefresh((prevState) => !prevState);
        })
    };
    
    return (
        <InnerCard
            createSighting={createSighting}
            butterflyInfo={butterflyInfo}
            refreshing={refresh}
            surveyPaused={Survey_Context.surveyPaused}
            List_Context={List_Context}
            Survey_Context={Survey_Context}
            listDashboardView={listDashboardView}
        />
    );
}
