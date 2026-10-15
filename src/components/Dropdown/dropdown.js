import * as React from 'react';

export const DropdownKeyValue = ({callback, options, initialValue, dWidth, disabled}) => {
  const handleChange = (e) => {
    callback(e.target.value)
  };

  return (
    <select disabled={disabled} onChange={handleChange} style={{ width:dWidth }} value={initialValue}>
      {options.map(function(data, key){  return (
        <option key={key} value={data.value}>{data.key}</option> )
      })}
    </select>
  )
}

export const DropdownValue = ({callback, options, initialValue, dWidth, disabled}) => {
  const handleChange = (e) => {
    callback(e.target.value)
  };
  
  return (
    <>
        <select disabled={disabled} onChange={handleChange} style={{ width:dWidth, height:"30px", color: 'white', backgroundColor:'#24948b', borderColor:'white' }} value={initialValue}>
            {options.map(function(data){  return (
                <option key={data} value={data}>{data}</option> )
            })}
        </select>
    </>
  )
}

