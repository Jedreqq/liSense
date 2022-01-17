import { useCallback, useEffect, useState } from "react";
import ButtonLink from "../../components/ButtonLink/ButtonLink";
import Instructor from "../../components/Instructor/Instructor";
import Loader from "../../components/Loader/Loader";
import classes from "./Instructors.module.css";

const Instructors = (props) => {
  const [appliers, setAppliers] = useState([]);
  const [instructors, setInstructors] = useState([]);
  const [isLoaded, setIsLoaded] = useState(false);
  let isMember = !!props.memberId;

  const [paymentStatus, setPaymentStatus] = useState(undefined);
  const [assignedInstructorId, setAssignedInstructorId] = useState(undefined)
  const [instructorRequestId, setInstructorRequestId] = useState(undefined);
  const [isChanged, setIsChanged] = useState(false);

  const loadInstructors = useCallback(async () => {
    if (isMember) {
      try {
        const res = await fetch(
          "http://localhost:3001/instructorListForStudent",
          {
            headers: {
              Authorization: "Bearer " + props.loginStatus.token,
            },
          }
        );
        if (res.status !== 200) {
          throw new Error("Failed to fetch instructors list.");
        }
        const resData = await res.json();

        setInstructors(
          resData.instructors.map((instructor) => {
            return {
              ...instructor,
            };
          })
        );
        setPaymentStatus(resData.userPaymentStatus[0]);
        setAssignedInstructorId(resData.userAssignedInstructorId);
        setInstructorRequestId(resData.instructorRequestId);
        setIsChanged(false);
      } catch (err) {
        console.log(err);
      }
    }
    if (!isMember) {
      try {
        const res = await fetch("http://localhost:3001/instructorList", {
          headers: {
            Authorization: "Bearer " + props.loginStatus.token,
          },
        });
        if (res.status !== 200) {
          throw new Error("Failed to fetch instructors list.");
        }
        const resData = await res.json();

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
        setIsChanged(false);
      } catch (err) {
        console.log(err);
      }
    }
  }, [isMember, props.loginStatus.token]);

  useEffect(
    () => loadInstructors().finally((x) => setIsLoaded(true)),
    [props.loginStatus.token, isChanged, setIsLoaded, loadInstructors]
  );

  const updateInstructors = (e, resData) => {
    e.preventDefault();
    setIsChanged(true);
  };

  const onRequestedInstructorIdChange = (e, id) => {
    e.preventDefault();
    setInstructorRequestId(id);
  }

  let instructorLink = '/instructors/' + assignedInstructorId

  return isLoaded ? (
    <div>
      {isMember && !!assignedInstructorId && <h2>You are already assigned to the <ButtonLink link={instructorLink}>Instructor</ButtonLink> </h2>}
      {isMember && !assignedInstructorId && (
        <div className={classes.instructorsDiv}>
          <h2>Instructors List</h2>
          {instructors.length === 0 && <p>No instructors in branch.</p>}
          {instructors.length > 0 &&
            instructors.map((instructor) => (
              <Instructor
              onRequestedInstructorIdChange={onRequestedInstructorIdChange}
                instructorRequestId={instructorRequestId}
                paymentStatus={paymentStatus}
                curVehicle={instructor.vehicle}
                loginStatus={props.loginStatus}
                key={instructor._id}
                id={instructor._id}
                firstname={instructor.firstname}
                lastname={instructor.lastname}
                email={instructor.email}
                phoneNumber={instructor.phoneNumber}
                isMember={instructor.memberId}
                categories={instructor.categories}
              />
            ))}
        </div>
      )}
      {!isMember && (
        <div>
          <div className={classes.instructorsDiv}>
            <h2>Instructors List</h2>
            {instructors.length === 0 && <p>No instructors in branch.</p>}
            {instructors.length > 0 &&
              instructors.map((instructor) => (
                <Instructor
                  onDecision={updateInstructors}
                  curVehicle={instructor.vehicle}
                  loginStatus={props.loginStatus}
                  key={instructor._id}
                  id={instructor._id}
                  firstname={instructor.firstname}
                  lastname={instructor.lastname}
                  email={instructor.email}
                  phoneNumber={instructor.phoneNumber}
                  isMember={instructor.memberId}
                  categories={instructor.categories}
                />
              ))}
          </div>
          <div className={classes.instructorsDiv}>
            <h2>Appliers List</h2>
            {appliers.length === 0 && <p>No instructors applied.</p>}
            {appliers.length > 0 &&
              appliers.map((instructor) => (
                <Instructor
                  onDecision={updateInstructors}
                  loginStatus={props.loginStatus}
                  key={instructor._id}
                  id={instructor._id}
                  firstname={instructor.firstname}
                  lastname={instructor.lastname}
                  email={instructor.email}
                  phoneNumber={instructor.phoneNumber}
                  categories={instructor.categories}
                />
              ))}
          </div>
        </div>
      )}
    </div>
  ) : (
    <div className={classes.centered}>
      <Loader />
    </div>
  );
};
export default Instructors;
