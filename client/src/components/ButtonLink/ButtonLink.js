import React from "react";
import { Link } from "react-router-dom";

import classes from "./ButtonLink.module.css";

const ButtonLink = (props) => {
  return <Link className={classes.btn} to={`${props.link}`}>{props.children}</Link>;
};

export default ButtonLink;
