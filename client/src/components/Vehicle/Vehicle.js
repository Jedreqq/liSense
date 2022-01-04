import React from "react";
import classes from "./Vehicle.module.css";
import ButtonLink from "../ButtonLink/ButtonLink";

const Vehicle = (props) => {
  let isOwner = props.loginStatus.userRole === "owner";

  let link = "/fleet/" + props.id;

  return (
    <article className={classes.singleVehicle}>
      <div>
        <header>
          <h2>
            {` ${props.brand} ${props.model}, ${props.year} ${props.registrationPlate}`}
          </h2>
          {
            <div>
              {props.categories.map((category) => {
                return (
                  <p key={category._id} className={classes.category}>
                    {category.type}{" "}
                  </p>
                );
              })}
            </div>
          }
          {isOwner && (
            <div className={classes.vehicleActions}>
              <ButtonLink link={link}>Details</ButtonLink>
            </div>
          )}
        </header>
      </div>
    </article>
  );
};

export default Vehicle;
