import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import Button from "../../../components/Button/Button";
import Input from "../../../components/Input/Input";

import classes from "./SingleInstructor.module.css";

const SingleInstructor = (props) => {
  const isStudent = props.loginStatus.userRole === "student";
  const isOwner = props.loginStatus.userRole === "owner";
  const { instructorId } = useParams();
  console.log(instructorId);

  const [instructorData, setInstructorData] = useState({
    firstname: "",
    lastname: "",
    email: "",
    phoneNumber: "",
    memberId: "",
    assignedVehicle: "",
    city: "",
    categories: [],
    comments: [],
  });

  const [assignedInstructorId, setAssignedInstructorId] = useState();
  const [newComment, setNewComment] = useState("");
  useEffect(() => {
    if (props.loginStatus.userRole === "owner") {
      fetch("http://localhost:3001/instructorList/" + instructorId, {
        headers: {
          Authorization: "Bearer " + props.loginStatus.token,
        },
      })
        .then((res) => {
          if (res.status !== 200) {
            throw new Error("Failed to fetch status");
          }
          return res.json();
        })
        .then((resData) => {
          console.log(resData);
          setInstructorData((instructorInfo) => ({
            ...instructorInfo,
            firstname: resData.instructor.firstname,
            lastname: resData.instructor.lastname,
            email: resData.instructor.email,
            phoneNumber: resData.instructor.phoneNumber,
            memberId: resData.instructor.memberId,
            city: resData.instructor.city,
            categories: resData.instructor.categories.map((category) => {
              return {
                ...category,
              };
            }),
            comments: resData.comments.map((comment) => {
              return {
                ...comment,
              };
            }),
          }));
        })
        .catch((err) => {
          console.log(err);
        });
    }
    if (props.loginStatus.userRole === "student") {
      fetch("http://localhost:3001/instructorListForStudent/" + instructorId, {
        headers: {
          Authorization: "Bearer " + props.loginStatus.token,
        },
      })
        .then((res) => {
          if (res.status !== 200) {
            throw new Error("Failed to fetch status");
          }
          return res.json();
        })
        .then((resData) => {
          console.log(resData);
          setAssignedInstructorId(resData.assignedInstructorId);
          setInstructorData((instructorInfo) => ({
            ...instructorInfo,
            firstname: resData.instructor.firstname,
            lastname: resData.instructor.lastname,
            phoneNumber: resData.instructor.phoneNumber,
            memberId: resData.instructor.memberId,
            comments: resData.comments.map((comment) => {
              return {
                ...comment,
              };
            }),
          }));
        })
        .catch((err) => {
          console.log(err);
        });
    }
  }, [props.loginStatus.token, instructorId, props.loginStatus.userRole]);

  const addCommentHandler = (e) => {
    e.preventDefault();
    fetch("http://localhost:3001/postNewComment", {
      method: "POST",
      headers: {
        Authorization: "Bearer " + props.loginStatus.token,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        text: newComment,
        instructorId: instructorId,
      }),
    })
      .then((res) => {
        if (res.status === 422) {
          throw new Error("Validation failed.");
        }
        if (res.status !== 200 && res.status !== 201) {
          console.log("Error!");
          throw new Error("Creating a comment failed!");
        }
        return res.json();
      })
      .then((resData) => {
        const commentAdded = { content: newComment };
        setInstructorData({
          ...instructorData,
          comments: [...instructorData.comments, commentAdded],
        });
        setNewComment("");
        console.log(resData);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  console.log(instructorData);

  return (
    <section>
      <div className={classes.instructorDiv}>
        <h3>
          {instructorData.firstname} {instructorData.lastname}{" "}
          {instructorData.phoneNumber}
        </h3>
        {isOwner ? (
          <React.Fragment>
            <h4>
              {instructorData.email} {instructorData.city}
            </h4>
            <h5>
              Categories:
              {instructorData.categories.length === 0 ? (
                <div>
                  <p>Instructor has zero categories.</p>
                </div>
              ) : (
                <div>
                  {instructorData.categories.map((category) => (
                    <p key={category._id} className={classes.category}>
                      {category.type}{" "}
                    </p>
                  ))}
                </div>
              )}
            </h5>
          </React.Fragment>
        ) : (
          <></>
        )}
        <div className={classes.commentsSection}>
          <h4>Comments Section</h4>
          {isStudent && +assignedInstructorId === +instructorId && (
            <div className={classes.addCommentContainer}>
              <form onSubmit={addCommentHandler}>
                <Input
                  value={newComment}
                  id="newComment"
                  label="Comment Below"
                  type="text"
                  control="input"
                  onChange={(e) => {
                    setNewComment(e.target.value);
                  }}
                />
                <Button type="submit">Add New Comment</Button>
              </form>
            </div>
          )}
          <div className={classes.commentsList}>
            {instructorData.comments.length === 0 ? (
              <p>No comments yet.</p>
            ) : (
              instructorData.comments.map((comment, key) => {
                return (
                  <div key={key} className={classes.singleComment}>
                    <p className={classes.commentDate}>
                      {comment.createdAt
                        ? comment.createdAt.slice(0, 16).replace("T", " ")
                        : new Date().toJSON().slice(0, 16).replace("T", " ")}
                    </p>
                    {comment.content}
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default SingleInstructor;
