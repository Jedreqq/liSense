import { useEffect, useState } from "react";

const Students = (props) => {
  const [students, setStudents] = useState([]);

  useEffect(() => {
    fetch("http://localhost:3001/studentList", {
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
        console.log(resData.students);
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
      {students.length === 0 && <p>No students applied.</p>}
      {students.length > 0}
    </div>
  );
};

export default Students;
