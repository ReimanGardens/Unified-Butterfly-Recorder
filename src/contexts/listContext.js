import React, { useState, createContext, useEffect, useContext } from "react";
import { set, get } from "idb-keyval";
import config from "config";
import { SurveyContext } from "./surveyContext/surveyContext";
const ListContext = createContext();

const Lists = (props) => {
  const [managedButterflyList, setManagedButterflyList] = useState([]);
  const [sortedManagedButterflyList, setSortedManagedButterflyList] = useState([]);
  const [sortedListByState, setSortedListByState] = useState([]);
  const Survey_Context = useContext(SurveyContext);

  
  // Note: the empty deps array [] means
  // this useEffect will run once on every page load
  // similar to componentDidMount()
  useEffect(() => {
    // console.log("ListContext useEffect called!");
    var requestOptions = {
      method: "GET",
      redirect: "follow",
    };

    const fetchManagedList = () => {
      fetch(
        config.listApiUrl,
        requestOptions
      )
        .then((res) => res.json())
        .then(
          (result) => {
            setManagedButterflyList(result);
            setSortedManagedButterflyList(getSortedList(result))

            set("ManagedList", result)
              .then(() =>
                console.log("Successfully added Managed List to IDXDB.")
              )
              .catch((err) => console.log("Failed", err));
          },
          // Note: it's important to handle errors here
          // instead of a catch() block so that we don't swallow
          // exceptions from actual bugs in components.
          (error) => {
            console.log(error);
          }
        );
    };

    //check to see if the database key 'ManagedList' exists. If it does not, run through the process of making it and fetching it.
    get("ManagedList").then((val) => {
      if (!val || val.length == 0) {
        console.log("ManagedList does not exist! Fetching data.");
        fetchManagedList();
      } else {
        console.log("ManagedList exists already! Not fetching data.");
      }
      setManagedButterflyList(val);
        setSortedManagedButterflyList(getSortedList(val));  
        //add favorites to managed list if they do not exist
        if(val[0]["favorite"] == undefined)
        {
          console.log("Updating masterlist to include favorites...");
          addFavoritesTagToList(val);
        }
        console.log("refresh over!");
    });



  }, []);

  function deriveFavoritesFromList(val)
  {
    console.log("Here!" +  val.length);
    var fl = [];
    for (var i = 0; i < val.length; i++) {
      //console.log("A");
      //console.log(mbl[i]);
      if(val[i].favorite == "true"){
        //console.log(val[i]);
        fl.push(val[i]);
      }   
    }
    console.log("Favs found: " + fl.length)
    return fl;
  }

  function addToFavorites(id) {
    var mbl = managedButterflyList;
    console.log("Index of " + id + " is " + getIndexById(id, mbl) + "is" + JSON.stringify(getButterflyById(id, mbl)));
    mbl[getIndexById(id, mbl)]["favorite"] = "true";
    setManagedButterflyList(mbl);
    setSortedManagedButterflyList(getSortedList(mbl));
    setSortedListByState(getSortedListByState(Survey_Context.surveyState));
    set("ManagedList", mbl);
    set("sortedListByState", sortedListByState);
  }

  function removeFromFavorites(id) {
    var mbl = managedButterflyList;
    console.log("Index of " + id + " is " + getIndexById(id, mbl) + "is" + JSON.stringify(getButterflyById(id, mbl)));
    mbl[getIndexById(id, mbl)]["favorite"] = "false";
    setManagedButterflyList(mbl);
    setSortedManagedButterflyList(getSortedList(mbl));
    setSortedListByState(getSortedListByState(Survey_Context.surveyState));
    set("ManagedList", mbl);
    set("sortedListByState", sortedListByState);
  }

  //add the favorites tag to the managed list, which it does not naturally have
  function addFavoritesTagToList(mbl)
  {
    console.log("updating managed list to contain favorites...");
    var listLength = mbl.length;
    for (var i = 0; i < listLength; i++) {
      //console.log(mbl[i]);
      if( mbl[i]["favorite"] == null)
        mbl[i]["favorite"] = "false";
       // console.log(mbl[i]);
    }
    setManagedButterflyList(mbl);
    set("ManagedList", mbl);
  }


  function getListByState(inputState) {
    if(inputState == "")
    {
      return managedButterflyList;
    }
    console.log("Searching for butterflies for " + inputState + "...");
    var arrayOfButterfliesFromInputState = [];
    var listLength = managedButterflyList.length;

    for (var i = 0; i < listLength; i++) {
      if (managedButterflyList[i].state.includes(inputState, 0)) {
        arrayOfButterfliesFromInputState.push(managedButterflyList[i]);
      }
    }

    // console.log(
    //   `Found ${arrayOfButterfliesFromInputState.length} butterflies for ${inputState}.`
    // );
    return arrayOfButterfliesFromInputState;
  }

  function getButterflyById(id, bl) {
    if(id == "" || id == null || id == undefined)
    {
      return null;
    }
    var listLength = bl.length;

    for (var i = 0; i < listLength; i++) {
      if (bl[i].id == id) {
        return bl[i];
      }
    }
    return null;
  }

  function getIndexById(id, bl) {
    if(id == "")
    {
      return -1;
    }
    var listLength = bl.length;

    for (var i = 0; i < listLength; i++) {
      if (bl[i].id == id) {
        return i;
      }
    }
    return -1;
  }


  //This function derives a color from a family and subfamily string. The subfamily string can be left empty if you just want
  //to get the overarching color for the whole family.
  function getColorFromSubFamily(family, subfamily)
  {
    var rf = 0;
    var gf = 0;
    var bf = 0;
    //get r component from every third letter starting at 0
    for(var i = 0; i < family.length; i += 3)
    {
      rf += family.charCodeAt(i) * 2;
    }
    rf = rf % 255;
    //get g component from every third letter starting at 1
    for(i = 1; i < family.length; i += 3)
    {
      gf += family.charCodeAt(i) + 20;
    }
    gf = gf % 255;
    //get b component from every third letter starting at 2
    for(i = 2; i < family.length; i += 3)
    {
      bf += family.charCodeAt(i);
    }
    bf = bf % 255;
    const familyColor = "rgb(" + rf + ", "+ gf  + ", " + bf + ")";
    //get subfamily color
    var rsf = 0;
    var gsf = 0;
    var bsf = 0;
    //get r component from every third letter starting at 0
    for(i = 0; i < subfamily.length; i += 3)
    {
      rsf += subfamily.charCodeAt(i);
    }
    rsf = rsf % 255;
    //get g component from every third letter starting at 1
    for(i = 1; i < subfamily.length; i += 3)
    {
      gsf += subfamily.charCodeAt(i);
    }
    gsf = gsf % 255;
    //get b component from every third letter starting at 2
    for(i = 2; i < subfamily.length; i += 3)
    {
      bsf += subfamily.charCodeAt(i);
    }
    bsf = bsf % 255;

    // We use this min function to asure we aren't getting negative rgb values
    rsf = Math.min(rsf, rf);
    gsf = Math.min(gsf, gf);
    bsf = Math.min(bsf, bf);

    //apply subfamily color as minor shift to family color
    // Changed from 5 to three to have more of a shift
    rsf = rf - (rsf / 3);
    gsf = gf - (gsf / 3);
    bsf = bf - (bsf / 3);
    Math.min(rsf, 255);
    Math.min(gsf, 255);
    Math.min(bsf, 255);
    const subFamilyColor = "rgb(" + rsf + ", "+ gsf  + ", " + bsf + ")";
    return subFamilyColor;
  }

  // Use the color function above and convert it to hex in the form 0xABC123
  function getColorFromSubFamilyHex(family, subfamily) {
    const color = getColorFromSubFamily(family, subfamily);

    const r = parseInt(color.substring(4, color.indexOf(",", 4)));
    const g = parseInt(color.substring(color.indexOf(",", 4) + 2, color.lastIndexOf(",")));
    const b = parseInt(color.substring(color.lastIndexOf(",") + 2, color.indexOf(")")));
  
    const hexColor = "0x" + r.toString(16).padStart(2, "0") + g.toString(16).padStart(2, "0") + b.toString(16).padStart(2, "0");

    return hexColor;
  }

  /*
  * Group By function from stackoverflow
  * Adapted by Tim and ChatGPT to sort alphabetically and put unknown first
  * */
  function groupBy(array, f) {
    const groups = new Map();
    
    array.forEach(function (o) {
      const group = f(o);
      const key = JSON.stringify(group); // You can still use JSON.stringify if necessary
    
      if (groups.has(key)) {
        groups.get(key).push(o);
      } else {
        groups.set(key, [o]);
      }
    });
    
    return [...groups].sort(function (a, b) {
      if (a[0].indexOf('Unknown') !== -1 && b[0].indexOf('Unknown') === -1) {
        return -1;
      }
      if (a[0].indexOf('Unknown') === -1 && b[0].indexOf('Unknown') !== -1) {
        return 1;
      }
      return a[0].localeCompare(b[0]);
    }).map(function (group) {
      return group[1].sort(function (a, b) {
        if (a.genericname === 'Unknown' && b.genericname !== 'Unknown') {
          return -1;
        }
        if (a.genericname !== 'Unknown' && b.genericname === 'Unknown') {
          return 1;
        }
        return a.genericname.localeCompare(b.genericname);
      });
    });
  }

  /*
   * Sorts butterfly list by ScientificFamily and ScientificSubfamily
   *
   * Returns 3D array of butterfly objects
   * 
   * Using an updated version from ChatGPT, I was able to reduce the JSON.stringify calls and improve performance with Map
   * */
  function getSortedList(list) {
    const result = groupBy(list, function (item) {
      return [item.scientificfamily];
    });
  
    for (let i = 0; i < result.length; i++) {
      result[i] = groupBy(result[i], function (item) {
        return [item.scientificsubfamily];
      });
    }
    return result;
  }

  function getSortedListByState(inputState) {
    var stateList = getListByState(inputState);
    var result = getSortedList(stateList);

    // console.log(result.length)
    return result;
  }

  async function persistSortedListByState(inputState){
    const sortedList = getSortedListByState(inputState)
    await set("sortedListByState", sortedList)
    setSortedListByState(sortedList)
  }


  useEffect(() => {
    get("sortedListByState")
    .then(res => {
      setSortedListByState(res)
    })
  }, [])

  /* Create object "value" that contains all objects, variables and functions available to consumers of the ListContext */
  const value = {
    managedButterflyList, // Object - Entire Managed Butterfly List
    sortedManagedButterflyList, // Object - Entire Managed Butterfly List but sorted
    getListByState, // Function - Retrieves butterflies from an input state
    getSortedList, //Function - returns the managed butterfly list sorted by family and subfamily into 3D array of butterfly objects.
    getSortedListByState,
    getColorFromSubFamily,
    getIndexById,
    addToFavorites,
    removeFromFavorites,
    sortedListByState,
    getColorFromSubFamilyHex,
    persistSortedListByState,
    getButterflyById,
  };


  return (
    <>
      {
        <ListContext.Provider value={value}>
          {props.children}
        </ListContext.Provider>
      }
    </>
  );
};

export { Lists, ListContext };
