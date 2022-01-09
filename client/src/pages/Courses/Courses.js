import { useEffect, useState } from "react";
import CreateCourse from "./CreateCourse";
import classes from "./Courses.module.css";
import Course from "../../components/Course/Course";
import ButtonLink from "../../components/ButtonLink/ButtonLink";

const Courses = (props) => {
  const [attendedCourseId, setAttendedCourseId] = useState();
  const [courses, setCourses] = useState({
    courses: [],
  });

  const [isAdded, setIsAdded] = useState(false);

  useEffect(() => {
    if (props.loginStatus.userRole === "owner") {
      fetch("http://localhost:3001/courseList", {
        headers: {
          Authorization: "Bearer " + props.loginStatus.token,
        },
      })
        .then((res) => {
          if (res.status !== 200) {
            throw new Error("Failed to fetch courses.");
          }
          return res.json();
        })
        .then((resData) => {
          console.log(resData.courses);
          setCourses((coursesInfo) => ({
            ...coursesInfo,
            courses: resData.courses.map((course) => {
              return {
                ...course,
              };
            }),
          }));
        })
        .catch((err) => {
          console.log(err);
        });
        setIsAdded(false);
    }

    if (props.loginStatus.userRole === "student") {
      fetch("http://localhost:3001/memberCourses", {
        headers: {
          Authorization: "Bearer " + props.loginStatus.token,
        },
      })
        .then((res) => {
          if (res.status !== 200) {
            throw new Error("Failed to fetch courses.");
          }
          return res.json();
        })
        .then((resData) => {
          console.log(resData.courses);
          setCourses((coursesInfo) => ({
            ...coursesInfo,
            courses: resData.courses.map((course) => {
              return {
                ...course,
              };
            }),
          }));
          setAttendedCourseId(resData.attendedCourseId);
        })
        .catch((err) => {
          console.log(err);
        });
    }
  }, [props.loginStatus.token, props.loginStatus.userRole, isAdded]);

  const [showCreateCourseCart, setShowCreateCourseCart] = useState(false);

  const showCreateCourseCartHandler = (e) => {
    e.preventDefault();
    setShowCreateCourseCart((prevState) => !prevState);
  };

  const updateCourses = (e, resData) => {
    e.preventDefault();
    setIsAdded(true);
  }

  let buttonContent = "Show Course Creator";

  if (showCreateCourseCart) {
    buttonContent = "Hide Course Creator";
  }

  return (
    <div>
      {props.loginStatus.userRole === "student" && !!attendedCourseId && (
        <div>
          You already attend the {" "}
          <ButtonLink link="/studentDash">course</ButtonLink>.
        </div>
      )}
      {!!!attendedCourseId && (
        <div className={classes.coursesDiv}>
          <button onClick={showCreateCourseCartHandler}>{buttonContent}</button>
          {showCreateCourseCart && (
            <CreateCourse
            onCreateCourse={updateCourses}
              loginStatus={props.loginStatus}
              activeBranch={props.activeBranch}
            />
          )}
          <h2>Courses in branch</h2>
          {courses.courses.length === 0 && <p>No courses in branch.</p>}
          {courses.courses.length > 0 &&
            courses.courses.map((course) => (
              <Course
              activeBranch={props.activeBranch}
                loginStatus={props.loginStatus}
                key={course._id}
                id={course._id}
                name={course.name}
                price={course.price}
                dayOfStart={course.dayOfStart}
                theoryClasses={course.theoryClasses}
                practicalClasses={course.practicalClasses}
                categories={course.categories}
              />
            ))}
        </div>
      )}
    </div>
  );
};

export default Courses;
