import React, { useState, useEffect, useRef, useCallback } from "react";
import { Form, FormControl } from "react-bootstrap";

const debounceDelay = 500

export default function ActiveSurveySearchBar({Survey_Context, List_Context, setAllButterflyListFiltered3D}) {
  const [searchTerm, setSearchTerm] = useState("");
  const timerRef = useRef(null);

  const handleSearch = useCallback((event) => {
    const { value } = event.target;

      setSearchTerm(() => {
        clearTimeout(timerRef.current);
        timerRef.current = setTimeout(() => {
          if(value === ""){
              setAllButterflyListFiltered3D([])
          }
          else{
              const filteredList = onSearch(value);
              setAllButterflyListFiltered3D(List_Context.getSortedList(filteredList))
          }
        }, debounceDelay);
        return value;
      })
    
  }, []);

  useEffect(() => {
    if(!Survey_Context.searchBar){
        setSearchTerm("")
        setAllButterflyListFiltered3D([])
    }
  }, [Survey_Context.searchBar])

  const onSearch = (value) => {
    return List_Context.managedButterflyList.filter(item => {
        return (
            item.genericname.toLowerCase().includes(value.toLowerCase()) ||
            item.scientificname.toLowerCase().includes(value.toLowerCase())
        )
    })
  }

  return (
    <Form>
      <FormControl
        hidden={!Survey_Context.searchBar}
        type="text"
        placeholder="Search all list"
        value={searchTerm}
        onChange={handleSearch}
      />
    </Form>
  );
}
