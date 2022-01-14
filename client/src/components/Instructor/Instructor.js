import React from "react";
import Button from "../Button/Button";
import ButtonLink from "../ButtonLink/ButtonLink";
import classes from "./Instructor.module.css";

const Instructor = (props) => {
  let isStudent = props.loginStatus.userRole === "student";
  let isMember = props.isMember;
  let isOwner = props.loginStatus.userRole === "owner";
  let isPaid = props.paymentStatus === 'paid';
  const vehicle = props.curVehicle;
  console.log(vehicle)

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
        props.onDecision(e, resData);
      })
      .catch((err) => console.log(err));
  };

  const sendRequestToInstructorHandler = (e) => {
    console.log("Send request.");
    e.preventDefault();
    fetch("http://localhost:3001/sendRequestToInstructor", {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + props.loginStatus.token,
      },
      body: JSON.stringify({
        requestedInstructorId: props.id,
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
        props.onDecision(e, resData);
      })
      .catch((err) => console.log(err));
  };

  let link = "/instructors/" + props.id;

  let mailboxLink = "/mailbox/write/" + props.id;
  // let chat = `/chat/${props.id}_${props.loginStatus.userId}`
  // if(+props.id > +props.loginStatus.userId) {
  //   chat = `/chat/${props.loginStatus.userId}_${props.id}`
  // }

  return (
    <article className={classes.singleInstructor}>
      <div>
        <header>
          <h2>{` ${props.firstname} ${props.lastname}
          (${props.curVehicle ? `${props.curVehicle.brand} ${props.curVehicle.model}` : 'Currently unassigned.'}`})</h2>
          {isStudent && isPaid && (
            <Button onClick={sendRequestToInstructorHandler}>
              Send Request
            </Button>
          )}
          {isStudent && !isPaid && <p>You need to pay for the course first!</p>}
          {!isMember && (
            <React.Fragment>
              <div>
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
              </div>

              <React.Fragment>
                <Button onClick={(e) => instructorApplyHandler(e, "accept")}>
                  Accept
                </Button>
                <Button onClick={(e) => instructorApplyHandler(e, "reject")}>
                  Reject
                </Button>
              </React.Fragment>
            </React.Fragment>
          )}
          {(isOwner || isStudent) && (
            <div className={classes.instructorActions}>
              <ButtonLink link={link}>Details</ButtonLink>
              <ButtonLink link={mailboxLink}>Send Message</ButtonLink>
            </div>
            
          )}
        </header>
      </div>
    </article>
  );
};

export default Instructor;
