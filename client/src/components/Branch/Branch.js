import React from "react";
import classes from "./Branch.module.css";

const Branch = (props) => {
  let isOwner = props.loginStatus.userRole === 'owner' ? true : false;

  return (
    <article className={classes.singleBranch}>
      <div>
        <header>
          <h2>
            {` ${props.name}, ${props.address}, ${props.postalCode} ${props.city}`}
          </h2>
          <p>{props.phoneNumber}</p>
        </header>
      </div>
      {isOwner && (
        <button onClick={(e) => props.onActiveBranchChange(e, props.id)}>
          Set as Active
        </button>
      )}
    </article>
  );
};

export default Branch;
