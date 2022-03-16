import React from "react";
import classes from "./Vehicle.module.css";
import ButtonLink from "../ButtonLink/ButtonLink";

const Vehicle = (props) => {
  let isOwner = props.loginStatus.userRole === "owner";

  let link = "/fleet/" + props.id;

  return (
    <tr>
      <td>{`${props.model}`}</td>
      <td>{props.brand}</td>
      <td>{props.year}</td>
      <td>{props.registrationPlate}</td>
      <td>{props.categories.map((category) => {
        return (
          <p key={category._id} className={classes.category}>{category.type}</p>
        )
      })}</td>
      <td>
      {isOwner && (
            <div className={classes.vehicleActions}>
              <ButtonLink link={link}>Details</ButtonLink>
            </div>
          )}
      </td>
    </tr>
  );
};

export default Vehicle;
