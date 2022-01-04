import React from "react";
import Button from "../Button/Button";
import ButtonLink from "../ButtonLink/ButtonLink";
import classes from "./Instructor.module.css";

const Instructor = (props) => {
  let isMember = props.isMember;
  let isOwner = (props.loginStatus.userRole = "owner");

  const instructorApplyHandler = (e, decision) => {
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
          throw new Error("Creating a branch failed!");
        }
        return res.json();
      })
      .then((resData) => {
        console.log(resData);
      })
      .catch((err) => console.log(err));
  };

  let link = "/instructors/" + props.id;

  return (
    <article className={classes.singleInstructor}>
      <div>
        <header>
          <h2>{` ${props.firstname} ${props.lastname}`}</h2>
          <p>{`${props.phoneNumber}, ${props.email}`}</p>
          <div>
            {props.categories.map((category) => {
              return (
                <p key={category._id} className={classes.category}>
                  {category.type}{" "}
                </p>
              );
            })}
          </div>
          {!isMember && (
            <React.Fragment>
              <Button onClick={(e) => instructorApplyHandler(e, "accept")}>
                Accept
              </Button>
              <Button onClick={(e) => instructorApplyHandler(e, "reject")}>
                Reject
              </Button>
            </React.Fragment>
          )}
          {isOwner && (
            <div className={classes.instructorActions}>
              <ButtonLink link={link}>Details</ButtonLink>
            </div>
          )}
        </header>
      </div>
    </article>
  );
};

export default Instructor;
