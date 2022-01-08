import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";

import classes from "./SingleStudent.module.css";

const SingleStudent = (props) => {
  const { studentId } = useParams();
  console.log(studentId);
  let isMember = !!props.isMember;

  const [studentData, setStudentData] = useState({
    firstname: "",
    lastname: "",
    email: "",
    phoneNumber: "",
    memberId: "",
    city: "",
    attendedCourse: "",
    assignedInstructor: "",
  });

  const [availableInstructors, setAvailableInstructors] = useState([]);

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
          attendedCourse: resData.attendedCourse ? resData.attendedCourse.name : ''
        }));
        
        setAvailableInstructors(
          resData.instructors ? 
          resData.instructors.map((instructor) => {
            return {
              ...instructor,
            };
          }) : ''
        )
      })
      .catch((err) => {
        console.log(err);
      });
  }, [props.loginStatus.token, studentId]);

  const setAssignedInstructorHandler = (e) => {
    setStudentData({ ...studentData, assignedInstructor: e.target.value });

    fetch("http://localhost:3001/assignInstructorToStudent", {
      method: "PATCH",
      headers: {
        Authorization: "Bearer " + props.loginStatus.token,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        assignedInstructor: e.target.value,
        curStudent: studentId,
      }),
    })
      .then((res) => {
        if (res.status !== 200) {
          throw new Error("Failed to assign instructor.");
        }
        return res.json();
      })
      .then((resData) => {
        console.log(resData);
      });
  };

  console.log(studentData);

  return (
    <section>
      <div className={classes.studentDiv}>
        <h3>
          {studentData.firstname} {studentData.lastname}
        </h3>
        <h4>
          {studentData.email} {studentData.phoneNumber} {studentData.city}
        </h4>
        {!!studentData.memberId && studentData.attendedCourse && (
          <React.Fragment>
            <p>
              Attended Course:
              {studentData.attendedCourse}
            </p>
            <p>
              Assigned Instructor in Course:
              <br />
              <select
                value={studentData.assignedInstructor}
                name="instructor"
                id="instructor"
                label="Assign Instructor"
                onChange={setAssignedInstructorHandler}
              >
                {availableInstructors.map((instructor) => {
                  return (
                    <option key={instructor._id} value={instructor._id}>
                      {instructor.firstname + " " + instructor.lastname}
                    </option>
                  );
                })}
              </select>
            </p>
          </React.Fragment>
        )}
      </div>
    </section>
  );
};

export default SingleStudent;
