import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import Student from "../../../components/Student/Student";

import classes from "./SingleCourse.module.css";

const SingleCourse = (props) => {
  const { courseId } = useParams();

  const [isChanged, setIsChanged] = useState(false);

  const [courseData, setCourseData] = useState({
    name: "",
    price: "",
    dayOfStart: "",
    theoryClasses: "",
    practicalClasses: "",
    categories: [],
    studentList: [],
    instructorList: [],
  });

  console.log(courseData.studentList);

  useEffect(() => {
    fetch("http://localhost:3001/courses/" + courseId, {
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
        setCourseData((courseInfo) => ({
          ...courseInfo,
          name: resData.course.name,
          price: resData.course.price,
          dayOfStart: resData.course.dayOfStart,
          theoryClasses: resData.course.theoryClasses,
          practicalClasses: resData.course.practicalClasses,
          categories: resData.course.categories,
          studentList: resData.students.map((student) => {
            return {
              ...student,
            };
          }),
        }));
        setIsChanged(false);
      })
      .catch((err) => {
        console.log(err);
      });
  }, [props.loginStatus.token, courseId, isChanged]);

  courseData.studentList.map((student) =>
    student.payments.map((payment) => console.log(payment.status))
  );

  const updateSingleCourse = (e, resData) => {
    e.preventDefault();
    setIsChanged(prevState => !prevState);
  }
  console.log(courseData);

  return (
    <section>
      {courseData.name} {courseData.price}
      THERE WILL BE SOME DATA (TO EDIT AND TO SEE)
      THERE WILL BE A LINK TO A CALENDAR
      <div className={classes.usersDiv}>
        <h2>Students in Course</h2>
        {courseData.studentList.length === 0 && (
          <p>No students in the course.</p>
        )}
        {courseData.studentList.length > 0 &&
          courseData.studentList.map((student) =>
            student.payments.map(
              (payment) =>
                payment.status === "paid" && (
                  <Student
                    onDecision={updateSingleCourse}
                    paymentStatus={payment.status}
                    loginStatus={props.loginStatus}
                    key={student._id}
                    id={student._id}
                    firstname={student.firstname}
                    lastname={student.lastname}
                    email={student.email}
                    phoneNumber={student.phoneNumber}
                    isMember={student.memberId}
                  />
                )
            )
          )}
        <p>And those that not paid yet:</p>
        {courseData.studentList.length > 0 &&
          courseData.studentList.map((student) =>
            student.payments.map(
              (payment) =>
                payment.status === "unpaid" && (
                  <Student
                    onDecision={updateSingleCourse}
                    paymentStatus={payment.status}
                    loginStatus={props.loginStatus}
                    key={student._id}
                    id={student._id}
                    firstname={student.firstname}
                    lastname={student.lastname}
                    email={student.email}
                    phoneNumber={student.phoneNumber}
                    isMember={student.memberId}
                  />
                )
            )
          )}
      </div>
    </section>
  );
};

export default SingleCourse;
