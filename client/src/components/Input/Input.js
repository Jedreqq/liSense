import React from "react";
import classes from "./Input.module.css";

const Input = (props) => {
  return (
    <div className={classes.input}>
      {props.label && <label htmlFor={props.id}>{props.label}</label>}
      {props.control === "input" && <input type={props.type} id={props.id}/>}
    </div>
  );
};

export default Input;
