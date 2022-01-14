import { useCallback, useEffect, useState } from "react";
import CreateCourse from "./CreateCourse";
import classes from "./Courses.module.css";
import Course from "../../components/Course/Course";
import ButtonLink from "../../components/ButtonLink/ButtonLink";
import Loader from "../../components/Loader/Loader";

const Courses = (props) => {
  const [attendedCourseId, setAttendedCourseId] = useState();
  const [courses, setCourses] = useState({
    courses: [],
  });

  const [isAdded, setIsAdded] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

  const loadCourses = useCallback(async () => {
    if (props.loginStatus.userRole === "owner") {
      try {

        const res = await fetch("http://localhost:3001/courseList", {
          headers: {
            Authorization: "Bearer " + props.loginStatus.token,
          },
        })
        if (res.status !== 200) {
          throw new Error("Failed to fetch courses.");
        }
        
        const resData = await res.json();
        setCourses((coursesInfo) => ({
          ...coursesInfo,
          courses: resData.courses.map((course) => {
            return {
              ...course,
            };
          }),
        }));
        setIsAdded(false);
      } catch (err) {
        console.log(err);
      }
    }

    if (props.loginStatus.userRole === "student") {
      try {
      const res = await fetch("http://localhost:3001/memberCourses", {
        headers: {
          Authorization: "Bearer " + props.loginStatus.token,
        },
      })
          if (res.status !== 200) {
            throw new Error("Failed to fetch courses.");
          }
          const resData = await res.json();
          setCourses((coursesInfo) => ({
            ...coursesInfo,
            courses: resData.courses.map((course) => {
              return {
                ...course,
              };
            }),
          }));
          setAttendedCourseId(resData.attendedCourseId);
          setIsAdded(false);
        } catch(err) {
          console.log(err);
        }
    }
  }
  , [props.loginStatus.token, props.loginStatus.userRole])

  useEffect(() => loadCourses().finally(x => setIsLoaded(true))
    , [props.loginStatus.token, props.loginStatus.userRole, isAdded, loadCourses, setIsLoaded]);

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

  return isLoaded ?
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
    </div> : <div className={classes.centered}> <Loader/> </div> 
};

export default Courses;
