import React from "react";

export default function Timer(props) {
  return (
    <div className="timer">
      <span className="digits hours">
        {("0" + Math.floor(props.time / 3600)).slice(-2)}:
      </span>
      <span className="digits minutes">
        {("0" + Math.floor(props.time / 60)).slice(-2)}:
      </span>
      <span className="digits seconds">
        {("0" + (props.time % 60)).slice(-2)}
      </span>

    </div>
  );
}

export function StringTimer(seconds) {
  return ("0" + Math.floor(seconds / 3600)).slice(-2) + ":" + 
  ("0" + Math.floor(seconds / 60)).slice(-2) + ":" +
  ("0" + (seconds % 60)).slice(-2)
}





