import React, { useEffect, useState } from "react";
import Button from "../Button/Button";
import classes from "./Branch.module.css";

const Branch = (props) => {
  let isOwner = props.loginStatus.userRole === "owner" ? true : false;
  let isStudentOrInstructor =
    props.loginStatus.userRole === "student" ||
    props.loginStatus.userRole === "instructor"
      ? true
      : false;

  const applyToBranchHandler = (e) => {
    e.preventDefault();
    fetch("http://localhost:3001/applyToBranch", {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + props.loginStatus.token,
      },
      body: JSON.stringify({
        branchRequestId: props.id,
      }),
    })
      .then((res) => {
        if (res.status === 422) {
          throw new Error("Validation failed.");
        }
        if (res.status !== 200 && res.status !== 201) {
          console.log("Error!");
          throw new Error("Apply to branch failed!");
        }
        return res.json();
      })
      .then((resData) => {
        console.log(resData);
        props.onBranchRequestIdChange(e, props.id);
      })
      .catch((err) => console.log(err));
  };

  return (
<tr className={
       ( props.loginStatus.userRole === "owner" &&
        (+props.id === +props.activeBranch
          ? classes.singleBranchActive
          : classes.singleBranch)) || ((props.loginStatus.userRole === "instructor" || props.loginStatus.userRole === 'student') && (+props.id === +props.BranchRequestId ? classes.singleBranchActive : classes.singleBranch))
      }>
      <td>{`${props.name}`}</td>
      <td>{props.address}</td>
      <td>{props.city}</td>
      <td>{props.phoneNumber}</td>
      <td>
      {isOwner && +props.id !== +props.activeBranch && (
        <Button onClick={(e) => props.onActiveBranchChange(e, props.id)}>
          Set as Active
        </Button>
      )}
      {isOwner && +props.id === +props.activeBranch && (
        <Button disabled>Active Branch</Button>
        )}

      {isStudentOrInstructor && +props.id !== +props.BranchRequestId && (
        <Button onClick={applyToBranchHandler}>Apply to School</Button>
        )}
      {isStudentOrInstructor && +props.id === +props.BranchRequestId && (
        <Button disabled>Currently applied</Button>
        )}
      </td>

    </tr>
    // <article
    //   className={
      //    ( props.loginStatus.userRole === "owner" &&
      //     (+props.id === +props.activeBranch
      //       ? classes.singleBranchActive
      //       : classes.singleBranch)) || ((props.loginStatus.userRole === "instructor" || props.loginStatus.userRole === 'student') && (+props.id === +props.BranchRequestId ? classes.singleBranchActive : classes.singleBranch))
      //   }
      // >
      //   <div>
    //     <header>
    //       <h2>
    //         {` ${props.name}, ${props.address}, ${props.postalCode} ${props.city}`}
    //       </h2>
    //       <p>{props.phoneNumber}</p>
    //     </header>
    //   </div>
    //   {isOwner && +props.id !== +props.activeBranch && (
    //     <Button onClick={(e) => props.onActiveBranchChange(e, props.id)}>
    //       Set as Active
    //     </Button>
    //   )}
    //   {isOwner && +props.id === +props.activeBranch && (
    //     <Button disabled>Active Branch</Button>
    //   )}

    //   {isStudentOrInstructor && +props.id !== +props.BranchRequestId && (
    //     <Button onClick={applyToBranchHandler}>Apply to School</Button>
    //   )}
    //   {isStudentOrInstructor && +props.id === +props.BranchRequestId && (
    //     <Button disabled>Currently applied</Button>
    //   )}
    // </article>
  );
};

export default Branch;
