import React from "react";
import Button from "../Button/Button";
import ButtonLink from "../ButtonLink/ButtonLink";
import classes from "./Student.module.css";

const Student = (props) => {
  let isMember = props.isMember;
  let isOwner = props.loginStatus.userRole === "owner";

  let link = "/students/" + props.id;

  const studentApplyHandler = (e, decision) => {
    console.log(decision + " " + props.id);
    e.preventDefault();
    fetch("http://localhost:3001/replyToApplier", {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + props.loginStatus.token,
      },
      body: JSON.stringify({
        decision: decision,
        id: props.id,
      }),
    })
      .then((res) => {
        if (res.status === 422) {
          throw new Error("Validation failed.");
        }
        if (res.status !== 200 && res.status !== 201) {
          console.log("Error!");
          throw new Error("Reply to applier failed!");
        }
        return res.json();
      })
      .then((resData) => {
        console.log(resData);
      })
      .catch((err) => console.log(err));
  };

  const changeStatusHandler = (e, curStatus) => {
    e.preventDefault();
    fetch("http://localhost:3001/changePaymentStatus", {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + props.loginStatus.token,
      },
      body: JSON.stringify({
        id: props.id,
        curStatus: curStatus,
      }),
    })
      .then((res) => {
        if (res.status === 422) {
          throw new Error("Validation failed.");
        }
        if (res.status !== 200 && res.status !== 201) {
          console.log("Error!");
          throw new Error("Creating a branch failed!");
        }
        return res.json();
      })
      .then((resData) => {
        console.log(resData);
      })
      .catch((err) => console.log(err));
  };

  return (
    <article className={classes.singleStudent}>
      <div>
        <header>
          <h2>{` ${props.firstname} ${props.lastname}`}</h2>
          <p>{`${props.phoneNumber}, ${props.email}`}</p>
          {!isMember && (
            <React.Fragment>
              <Button onClick={(e) => studentApplyHandler(e, "accept")}>
                Accept
              </Button>
              <Button onClick={(e) => studentApplyHandler(e, "reject")}>
                Reject
              </Button>
            </React.Fragment>
          )}
          {isOwner && (
            <div className={classes.studentActions}>
              <ButtonLink link={link}>Details</ButtonLink>
            </div>
          )}
          {props.paymentStatus === "unpaid" && isOwner && (
            <div className={classes.CourseActions}>
              <Button
                onClick={(e) => changeStatusHandler(e, props.paymentStatus)}
              >
                Change Status To Paid
              </Button>
            </div>
          )}
          {props.paymentStatus === "paid" && isOwner && (
            <div className={classes.CourseActions}>
              <Button
                onClick={(e) => changeStatusHandler(e, props.paymentStatus)}
              >
                Change Status To Unpaid
              </Button>
            </div>
          )}
        </header>
      </div>
    </article>
  );
};

export default Student;
