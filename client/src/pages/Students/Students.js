import { useEffect, useState } from "react";
import Student from "../../components/Student/Student";
import classes from "./Students.module.css";

const Students = (props) => {
  const [appliers, setAppliers] = useState([]);
  const [students, setStudents] = useState([]);

  useEffect(() => {
    fetch("http://localhost:3001/applierList", {
      headers: {
        Authorization: "Bearer " + props.loginStatus.token,
      },
    })
      .then((res) => {
        if (res.status !== 200) {
          throw new Error("Failed to fetch students list.");
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
        setStudents(
          resData.students.map((student) => {
            return {
              ...student,
            };
          })
        );
      })
      .catch((err) => console.log(err));
  }, [props.loginStatus.token]);

  return (
    <div>
      <div className={classes.studentsDiv}>
        <h2>Students List</h2>
        {students.length === 0 && <p>No students applied.</p>}
        {students.length > 0 &&
          students.map((student) => (
            <Student
              loginStatus={props.loginStatus}
              key={student._id}
              id={student._id}
              firstname={student.firstname}
              lastname={student.lastname}
              email={student.email}
              phoneNumber={student.phoneNumber}
              isMember={student.memberId}
            />
          ))}
      </div>
      <div className={classes.studentsDiv}>
        <h2>Appliers List</h2>
        {appliers.length === 0 && <p>No students applied.</p>}
        {appliers.length > 0 &&
          appliers.map((student) => (
            <Student
              loginStatus={props.loginStatus}
              key={student._id}
              id={student._id}
              firstname={student.firstname}
              lastname={student.lastname}
              email={student.email}
              phoneNumber={student.phoneNumber}
            />
          ))}
      </div>
    </div>
  );
};

export default Students;
