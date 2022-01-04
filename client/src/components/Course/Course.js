import React from "react";
import classes from "./Course.module.css";
import Button from "../Button/Button";
import ButtonLink from "../ButtonLink/ButtonLink";

const Course = (props) => {
  const dateDay = props.dayOfStart.split("T")[0];
  const isOwner = props.loginStatus.userRole === "owner" ? true : false;
  const isStudent = props.loginStatus.userRole === "student" ? true : false;

  console.log(props.id);
  const joinToCourseHandler = (e) => {
    e.preventDefault();
    fetch("http://localhost:3001/joinToCourse", {
      method: "PATCH",
      headers: {
        Authorization: "Bearer " + props.loginStatus.token,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        attendedCourseId: props.id,
        name: props.name,
        price: props.price
      })
    });
  };
  let link = "/courses/" + props.id;

  return (
    <article className={classes.singleCourse}>
      <div>
        <header>
          <h2>{` ${props.name}, ${props.price}zł ${dateDay}`}</h2>
          <h3>{`Theory Classes: ${props.theoryClasses}; Practical Classes: ${props.practicalClasses}`}</h3>
          {
            <div>
              {props.categories.map((category) => {
                return <p key={category._id} className={classes.category}>{category.type} </p>;
              })}
            </div>
          }
          {isOwner && (
            <div className={classes.CourseActions}>
              <ButtonLink link={link}>Details</ButtonLink>
            </div>
          )}
          {isStudent && (
            <div className={classes.CourseActions}>
              <Button onClick={joinToCourseHandler}>Join</Button>
            </div>
          )}
        </header>
      </div>
    </article>
  );
};

export default Course;
