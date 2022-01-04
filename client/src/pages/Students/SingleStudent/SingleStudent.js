import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";

import classes from "./SingleStudent.module.css";

const SingleStudent = (props) => {
  const { studentId } = useParams();
  console.log(studentId);

  const [studentData, setStudentData] = useState({
    firstname: "",
    lastname: "",
    email: "",
    phoneNumber: "",
    memberId: "",
    city: "",
  });

  useEffect(() => {
    fetch("http://localhost:3001/applierList/" + studentId, {
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
        setStudentData((studentInfo) => ({
          ...studentInfo,
          firstname: resData.student.firstname,
          lastname: resData.student.lastname,
          email: resData.student.email,
          phoneNumber: resData.student.phoneNumber,
          memberId: resData.student.memberId,
          city: resData.student.city,
        }));
      })
      .catch((err) => {
        console.log(err);
      });
  }, [props.loginStatus.token, studentId]);

  console.log(studentData);

  return (
    <section>
      <div className={classes.studentDiv}>
        <h3>
          {studentData.firstname} {studentData.lastname}
        </h3>
        <h4>
          {studentData.email} {studentData.phoneNumber}{" "}
          {studentData.city}
        </h4>
      </div>
    </section>
  );
};

export default SingleStudent;
