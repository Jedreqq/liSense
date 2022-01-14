import React, { useState, useEffect, useCallback } from "react";
import { useParams } from "react-router-dom";
import Loader from "../../../components/Loader/Loader";

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
    paymentStatus: "",
  });

  const [availableInstructors, setAvailableInstructors] = useState([]);
  const [isLoaded, setIsLoaded] = useState(false);

  const loadSingleStudent = useCallback(async () => {
    try {
      const res = await fetch(
        "http://localhost:3001/applierList/" + studentId,
        {
          headers: {
            Authorization: "Bearer " + props.loginStatus.token,
          },
        }
      );
      if (res.status !== 200) {
        throw new Error("Failed to fetch status");
      }
      const resData = await res.json();
      setStudentData((studentInfo) => ({
        ...studentInfo,
        firstname: resData.student.firstname,
        lastname: resData.student.lastname,
        email: resData.student.email,
        phoneNumber: resData.student.phoneNumber,
        memberId: resData.student.memberId,
        city: resData.student.city,
        attendedCourse: resData.attendedCourse
          ? resData.attendedCourse.name
          : "",
        paymentStatus: resData.student.payments
          ? resData.student.payments.map((payment) => {
              return payment.status;
            })
          : "",
      }));

      setAvailableInstructors(
        resData.instructors
          ? resData.instructors.map((instructor) => {
              return {
                ...instructor,
              };
            })
          : ""
      );
    } catch (err) {
      console.log(err);
    }
  }, [props.loginStatus.token, studentId]);

  useEffect(
    () => loadSingleStudent().finally((x) => setIsLoaded(true)),
    [loadSingleStudent, setIsLoaded, props.loginStatus.token, studentId]
  );

  const setAssignedInstructorHandler = async (e) => {
    try {
      setStudentData({ ...studentData, assignedInstructor: e.target.value });
      const res = await fetch(
        "http://localhost:3001/assignInstructorToStudent",
        {
          method: "PATCH",
          headers: {
            Authorization: "Bearer " + props.loginStatus.token,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            assignedInstructor: e.target.value,
            curStudent: studentId,
          }),
        }
      );
      if (res.status !== 200) {
        throw new Error("Failed to assign instructor.");
      }
      const resData = await res.json();
      console.log(resData);
    } catch (err) {
      console.log(err);
    }
  };

  console.log(studentData);

  return isLoaded ? (
    <section>
      <div className={classes.studentDiv}>
        <h3>
          {studentData.firstname} {studentData.lastname}
        </h3>
        <h4>
          {studentData.email} {studentData.phoneNumber} {studentData.city}
        </h4>
        {studentData.paymentStatus[0] !== "paid" && (
          <React.Fragment>
            <p>
              Attended Course:
              {studentData.attendedCourse}
            </p>
            <p>Student has to pay for the course first.</p>
          </React.Fragment>
        )}
        {!!studentData.memberId &&
          studentData.attendedCourse &&
          studentData.paymentStatus[0] === "paid" && (
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
  ) : (
    <div className={classes.centered}>
      {" "}
      <Loader />{" "}
    </div>
  );
};

export default SingleStudent;
