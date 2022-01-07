import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";

import classes from "./SingleInstructor.module.css";

const SingleInstructor = (props) => {
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
  });

  useEffect(() => {
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
        }));
      })
      .catch((err) => {
        console.log(err);
      });
  }, [props.loginStatus.token, instructorId]);

  console.log(instructorData);

  return (
    <section>
      <div className={classes.instructorDiv}>
        <h3>
          {instructorData.firstname} {instructorData.lastname}
        </h3>
        <h4>
          {instructorData.email} {instructorData.phoneNumber}{" "}
          {instructorData.city}
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
      </div>
    </section>
  );
};

export default SingleInstructor;
