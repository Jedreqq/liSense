import React from "react";
import classes from "./Button.module.css";

const Button = (props) => {
  return (
    <button
      className={classes.btn}
      onClick={props.onClick}
      disabled={props.disabled}
      type={props.type}
    >
      {props.loading ? "Loading..." : props.children}
    </button>
  );
};

export default Button;
