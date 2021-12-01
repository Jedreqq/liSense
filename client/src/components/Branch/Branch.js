import React from "react";
import classes from "./Branch.module.css";

const Branch = (props) => {
  let isOwner = props.loginStatus.userRole === "owner" ? true : false;
  let isStudentOrInstructor =
    props.loginStatus.userRole === ("student" || "instructor") ? true : false;

  const applyToBranchHandler = (e) => {
    e.preventDefault();
    fetch("http://localhost:3001/applyToBranch", {
      method: "POST",
      headers: {
        Authorization: "Bearer " + props.loginStatus.token,
      },
    });
  };

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
      {isStudentOrInstructor && (
        <button onClick={applyToBranchHandler}>Apply to School</button>
      )}
    </article>
  );
};

export default Branch;
