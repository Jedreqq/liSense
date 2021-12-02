import { useEffect, useState } from "react";
import Instructor from "../../components/Instructor/Instructor";
import classes from './Instructors.module.css';

const Instructors = (props) => {
  const [appliers, setAppliers] = useState([]);
  const [instructors, setInstructors] = useState([]);

  useEffect(() => {
    fetch("http://localhost:3001/instructorList", {
      headers: {
        Authorization: "Bearer " + props.loginStatus.token,
      },
    })
      .then((res) => {
        if (res.status !== 200) {
          throw new Error("Failed to fetch instructors list.");
        }
        return res.json();
      })
      .then((resData) => {
        setAppliers(
          resData.appliers.map((applier) => {
            return {
              ...applier,
            };
          })
        );
        setInstructors(
          resData.instructors.map((instructor) => {
            return {
              ...instructor,
            };
          })
        );
      })
      .catch((err) => console.log(err));
  }, [props.loginStatus.token]);

  return (
    <div>
    <div className={classes.instructorsDiv}>
      <h2>Students List</h2>
      {instructors.length === 0 && <p>No instructors in branch.</p>}
      {instructors.length > 0 &&
        instructors.map((instructor) => (
          <Instructor
          loginStatus={props.loginStatus}
          key={instructor._id}
          id={instructor._id}
            firstname={instructor.firstname}
            lastname={instructor.lastname}
            email={instructor.email}
            phoneNumber={instructor.phoneNumber}
            isMember={instructor.memberId}
          />
        ))}
    </div>
    <div className={classes.instructorsDiv}>
      <h2>Appliers List</h2>
      {appliers.length === 0 && <p>No instructors applied.</p>}
      {appliers.length > 0 &&
        appliers.map((instructor) => (
          <Instructor
            loginStatus={props.loginStatus}
            key={instructor._id}
            id={instructor._id}
            firstname={instructor.firstname}
            lastname={instructor.lastname}
            email={instructor.email}
            phoneNumber={instructor.phoneNumber}
          />
        ))}
    </div>
  </div>
  )

};
export default Instructors;
