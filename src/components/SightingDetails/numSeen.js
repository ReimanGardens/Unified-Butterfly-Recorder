import React, { useEffect, useState } from "react";
import { Form, InputGroup } from "react-bootstrap";
import { FaPlusCircle, FaMinusCircle } from "react-icons/fa";

const NumSeen = ({value, callback, disabled}) => {

    const [seen, setSeen] = useState(value)

    useEffect(() => {
        callback(seen)
    }, [seen])

    return (
        <>
            <InputGroup>
                <InputGroup.Text>Number Seen:</InputGroup.Text>
                <Form.Control disabled={disabled} type="number" value={seen} onChange={(e) => {
                    if(e.target.value.length === 0){
                        setSeen(0)
                    }
                    else{
                        setSeen(parseInt(e.target.value))
                    }
                }}/>
            </InputGroup>
            {!disabled && <div className="d-flex flex-row justify-content-center gap-5 mt-2">
                <FaPlusCircle style={{paddingLeft:"10px"}} size={40} onClick={() => setSeen(prevState => prevState + 1)}/>
                <FaMinusCircle style={{paddingLeft:"10px"}} size={40} onClick={() => {
                    if(seen !== 0) setSeen(prevState => prevState - 1)
                }}/>
            </div>}
        </>
    )
}

export default NumSeen;