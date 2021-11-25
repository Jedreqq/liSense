import React from "react";
import classes from "./Input.module.css";

const Input = (props) => {
  return (
    <div className={classes.input}>
      {props.type === "checkbox" && props.control === "input" && (
        <input type={props.type} id={props.id} onChange={props.onChange} />
      )}

      {props.label && <label htmlFor={props.id}>{props.label}</label>}
      {props.type !== "checkbox" && props.control === "input" && (
        <input type={props.type} id={props.id} onChange={props.onChange}/>
      )}
    </div>
  );
};

export default Input;
