import { useCallback, useEffect, useState } from "react";
import Student from "../../components/Student/Student";
import classes from "./Students.module.css";
import Loader from "../../components/Loader/Loader";
import ReactPaginate from "react-paginate";

const Students = (props) => {
  const [appliers, setAppliers] = useState([]);
  const [students, setStudents] = useState([]);
  const [isChanged, setIsChanged] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

  const updateStudents = (e, resData) => {
    e.preventDefault();
    setIsChanged(true);
  };

  const changeCurrentPage = ({ selected }) => {
    setPageNumber(selected);
  };

  const [pageNumber, setPageNumber] = useState(0);
  const studentsPerPage = 3;
  const pagesVisited = pageNumber * studentsPerPage;

  const pageCountStudents = Math.ceil(students.length / studentsPerPage);
  const pageCountAppliers = Math.ceil(appliers.length / studentsPerPage);

  const showStudents = students
    .slice(pagesVisited, pagesVisited + studentsPerPage)
    .map((student) => {
      return (
        <Student
          isLoaded={isLoaded}
          onDecision={updateStudents}
          loginStatus={props.loginStatus}
          key={student._id}
          id={student._id}
          firstname={student.firstname}
          lastname={student.lastname}
          email={student.email}
          phoneNumber={student.phoneNumber}
          isMember={student.memberId}
        />
      );
    });

  const showAppliers = appliers
    .slice(pagesVisited, pagesVisited + studentsPerPage)
    .map((student) => {
      return (
        <Student
          isLoaded={isLoaded}
          onDecision={updateStudents}
          loginStatus={props.loginStatus}
          key={student._id}
          id={student._id}
          firstname={student.firstname}
          lastname={student.lastname}
          email={student.email}
          phoneNumber={student.phoneNumber}
        />
      );
    });

  const loadStudents = useCallback(async () => {
    if (props.loginStatus.userRole === "owner") {
      try {
        const res = await fetch("http://localhost:3001/applierList", {
          headers: {
            Authorization: "Bearer " + props.loginStatus.token,
          },
        });
        if (res.status !== 200) {
          throw new Error("Failed to fetch students list.");
        }
        const resData = await res.json();

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
        setIsChanged(false);
      } catch (err) {
        console.log(err);
      }
    }
    if (props.loginStatus.userRole === "instructor") {
      try {
        const res = await fetch(
          "http://localhost:3001/studentListOfInstructor",
          {
            headers: {
              Authorization: "Bearer " + props.loginStatus.token,
            },
          }
        );
        if (res.status !== 200) {
          throw new Error("Failed to fetch students list.");
        }
        const resData = await res.json();
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
        setIsChanged(false);
      } catch (err) {
        console.log(err);
      }
    }
  }, [props.loginStatus.token, props.loginStatus.userRole]);

  useEffect(
    () => loadStudents().finally((x) => setIsLoaded(true)),
    [loadStudents, isChanged, props.loginStatus.isAuth, setIsLoaded]
  );

  return isLoaded ? (
    <div>
      <div className={classes.studentsDiv}>
        <h2>Students List</h2>
        {students.length === 0 && <p>No students.</p>}
        {students.length > 0 && showStudents}
      </div>
      <ReactPaginate
            previousLabel={"Previous"}
            nextLabel={"Next"}
            pageCount={pageCountStudents}
            onPageChange={changeCurrentPage}
            containerClassName={classes.pagination}
            previousLinkClassName={classes.previousBtn}
            nextLinkClassName={classes.nextBtn}
            disabledClassName={classes.paginationDisabled}
            activeClassName={classes.activePagination}
          />
      <div className={classes.studentsDiv}>
        <h2>Appliers List</h2>
        {appliers.length === 0 && <p>No students applied.</p>}
        {appliers.length > 0 && showAppliers}
        <ReactPaginate
            previousLabel={"Previous"}
            nextLabel={"Next"}
            pageCount={pageCountAppliers}
            onPageChange={changeCurrentPage}
            containerClassName={classes.pagination}
            previousLinkClassName={classes.previousBtn}
            nextLinkClassName={classes.nextBtn}
            disabledClassName={classes.paginationDisabled}
            activeClassName={classes.activePagination}
          />
      </div>
    </div>
  ) : (
    <div className={classes.centered}>
      <Loader />
    </div>
  );
};

export default Students;
