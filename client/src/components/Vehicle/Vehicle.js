import React from "react";
import classes from "./Vehicle.module.css";

const Vehicle = (props) => {
  return (
    <article className={classes.singleVehicle}>
      <div>
        <header>
          <h2>
            {` ${props.brand} ${props.model}, ${props.year} ${props.registrationPlate}`}
          </h2>
          {
            <div>
             
                {props.categories.map(category => {
                  return <p className={classes.category}>{category.type} </p>
                })}
        
            </div>
          }
        </header>
      </div>
    </article>
  );
};

export default Vehicle;
