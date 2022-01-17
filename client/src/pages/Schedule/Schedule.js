import React, { useCallback, useEffect, useState } from "react";

import {
  Calendar,
  dateFnsLocalizer,
  momentLocalizer,
} from "react-big-calendar";
import format from "date-fns/format";
import parse from "date-fns/parse";
import startOfWeek from "date-fns/startOfWeek";
import getDay from "date-fns/getDay";
import getHours from "date-fns/getHours";
import "react-big-calendar/lib/css/react-big-calendar.css";
import DatePicker from "react-datepicker";
import Input from "../../components/Input/Input";
import Button from "../../components/Button/Button";
import "react-datepicker/dist/react-datepicker.css";
import EventComponent from "./EventComponent";
import { styled, Box } from "@mui/system";
import ModalUnstyled from "@mui/base/ModalUnstyled";
import moment from "moment";

import classes from "./Schedule.module.css";

const StyledModal = styled(ModalUnstyled)`
  position: fixed;
  z-index: 1300;
  right: 0;
  bottom: 0;
  top: 0;
  left: 0;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const Backdrop = styled("div")`
  z-index: -1;
  position: fixed;
  right: 0;
  bottom: 0;
  top: 0;
  left: 0;
  background-color: rgba(0, 0, 0, 0.5);
  -webkit-tap-highlight-color: transparent;
`;

const style = {
  width: 400,
  bgcolor: "white",
  border: "2px solid #000",
  p: 2,
  px: 4,
  pb: 3,
};

const eventOptions = [
  "",
  "Practical Class",
  "Theory Class (Course)",
  "Individual (Instructor)",
  "Branch (Instructor)",
  "Internal Exam",
].map((cur, index) => {
  return (
    <option key={cur} value={cur}>
      {cur}
    </option>
  );
});

const localizer = momentLocalizer(moment);

const Schedule = (props) => {
  const [isOpened, setIsOpened] = useState(false);

  const [newEvent, setNewEvent] = useState({
    title: "",
    start: "",
    end: "",
    user: "",
  });
  //if owner to get courses list dla branch
  //if owner i wybiore available course to fetch szukanie studentow w tym kursie do listy
  const [selectedCourse, setSelectedCourse] = useState(undefined);
  const [availableCourses, setAvailableCourses] = useState([]);
  const [availableInstructors, setAvailableInstructors] = useState([]);
  const [studentsOfCourse, setStudentsOfCourse] = useState([]);

  const [allEvents, setAllEvents] = useState([]);
  const [allStudentEvents, setAllStudentEvents] = useState([]);
  const [studentsOfInstructor, setStudentsOfInstructor] = useState([]);
  const [selectedStudent, setSelectedStudent] = useState(undefined);
  const [selectedInstructor, setSelectedInstructor] = useState(undefined);
  const [isChanged, setIsChanged] = useState(false);

  const setSelectedCourseHandler = (e) => {
    if (document.getElementById("firstCourse")) {
      document.getElementById("firstCourse").remove();
    }
    setSelectedCourse(e.target.value);
    fetch("http://localhost:3001/getStudentsOfCourse", {
      method: "POST",
      headers: {
        Authorization: "Bearer " + props.loginStatus.token,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        selectedCourseId: e.target.value,
      }),
    })
      .then((res) => {
        return res.json();
      })
      .then((resData) => {
        setStudentsOfCourse(
          resData.students.map((student) => {
            return {
              ...student,
            };
          })
        );
        setIsChanged(true);
      });
  };

  const showAddEventModal = (e) => {
    e.preventDefault();
    setIsOpened(true);
  };

  const hideAddEventModel = (e) => {
    e.preventDefault();
    setIsOpened(false);
  };

  const newEventHandler = async (e) => {
    e.preventDefault();
    // setAllEvents([...allEvents, newEvent]);
    console.log(newEvent);
    try {
      const res = await fetch("http://localhost:3001/createNewEvent", {
        method: "POST",
        headers: {
          Authorization: "Bearer " + props.loginStatus.token,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title: newEvent.title,
          _id:
            newEvent.title === "Theory Class (Course)"
              ? selectedCourse
              : newEvent.user,
          startDate: newEvent.start,
          endDate: newEvent.end,
        }),
      });
      const resData = await res.json();

      if (props.loginStatus.userRole === "instructor") {
        setSelectedStudentHandlerForInstructor(e);
      }
      window.location.reload();
      setIsChanged(true);
    } catch (err) {
      console.log(err);
    }
    setIsChanged(true);
  };

  const loadStudentEvents = useCallback(async () => {
    if (props.loginStatus.userRole === "student") {
      try {
        const res = await fetch("http://localhost:3001/getStudentCalendar", {
          headers: {
            Authorization: "Bearer " + props.loginStatus.token,
          },
        });
        if (res.status !== 200) {
          throw new Error("Failed to fetch courses.");
        }

        const resData = await res.json();
        setAllStudentEvents(
          resData.eventList.map((event) => {
            return {
              ...event,
            };
          })
        );

        setAllEvents(
          resData.eventList.map((event) => ({
            _id: event._id,
            title: event.title,
            start: moment(event.startDate).toDate(),
            end: moment(event.endDate).toDate(),
            status: event.status,
            description: event.description,
            props: props,
          }))
        );
      } catch (err) {
        console.log(err);
      }
    }
  }, [props]);

  const loadCourses = useCallback(async () => {
    if (props.loginStatus.userRole === "owner") {
      try {
        const res = await fetch("http://localhost:3001/courseList", {
          headers: {
            Authorization: "Bearer " + props.loginStatus.token,
          },
        });
        if (res.status !== 200) {
          throw new Error("Failed to fetch courses.");
        }

        const resData = await res.json();
        setAvailableCourses(
          resData.courses.map((course) => {
            return {
              ...course,
            };
          })
        );

        const resInstructors = await fetch(
          "http://localhost:3001/getInstructorsForSchedule",
          {
            headers: {
              Authorization: "Bearer " + props.loginStatus.token,
            },
          }
        );
        if (res.status !== 200) {
          throw new Error("Failed to fetch instructors.");
        }

        const resDataInstructors = await resInstructors.json();
        setAvailableInstructors(
          resDataInstructors.instructors.map((instructor) => {
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
    setIsChanged(false);
  }, [props.loginStatus.userRole, props.loginStatus.token]);

  const getStudentsOfInstructorList = useCallback(async () => {
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

        setStudentsOfInstructor(
          resData.students.map((student) => {
            return student;
          })
        );
        setIsChanged(false);
      } catch (err) {
        console.log(err);
      }
    }
  }, [props.loginStatus.token, props.loginStatus.userRole]);

  useEffect(
    () =>
      loadCourses().then((x) =>
        loadStudentEvents().then((x) => getStudentsOfInstructorList())
      ),
    [loadCourses, loadStudentEvents, getStudentsOfInstructorList]
  );

  const setSelectedStudentHandlerForOwner = (e) => {
    if (document.getElementById("first")) {
      document.getElementById("first").remove();
    }
    setSelectedStudent(e.target.value);
    fetch("http://localhost:3001/getStudentCalendarForInstructor", {
      method: "POST",
      headers: {
        Authorization: "Bearer " + props.loginStatus.token,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        userId: e.target.value ? e.target.value : selectedStudent,
      }),
    })
      .then((res) => {
        return res.json();
      })
      .then((resData) => {
        console.log(resData);
        setAllEvents(
          resData.calendar?.events?.map((event) => ({
            _id: event._id,
            title: event.title,
            start: moment(event.startDate).toDate(),
            end: moment(event.endDate).toDate(),
            status: event.status,
            description: event.description,
            props: props,
          }))
        );
        setIsChanged(true);
      });
  };

  const setSelectedStudentHandlerForInstructor = (e) => {
    if (document.getElementById("first")) {
      document.getElementById("first").remove();
    }
    setSelectedStudent(e.target.value);
    setNewEvent({
      ...newEvent,
      title: "Practical Class",
      user: e.target.value,
    });
    fetch("http://localhost:3001/getStudentCalendarForInstructor", {
      method: "POST",
      headers: {
        Authorization: "Bearer " + props.loginStatus.token,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        userId: e.target.value ? e.target.value : selectedStudent,
      }),
    })
      .then((res) => {
        return res.json();
      })
      .then((resData) => {
        console.log(resData);
        setAllEvents(
          resData.calendar?.events?.map((event) => ({
            _id: event._id,
            title: event.title,
            start: moment(event.startDate).toDate(),
            end: moment(event.endDate).toDate(),
            status: event.status,
            description: event.description,
            props: props,
          }))
        );
        setIsChanged(true);
      });
  };

  const setSelectedInstructorHandler = (e) => {
    if (document.getElementById("first")) {
      document.getElementById("first").remove();
    }
    setSelectedInstructor(e.target.value);
    fetch("http://localhost:3001/getStudentListOfSelectedInstructor", {
      method: "POST",
      headers: {
        Authorization: "Bearer " + props.loginStatus.token,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        userId: e.target.value ? e.target.value : selectedInstructor,
      }),
    })
      .then((res) => {
        return res.json();
      })
      .then((resData) => {
        setStudentsOfInstructor(
          resData.students.map((student) => {
            return student;
          })
        );
        setAllEvents(
          resData.calendar?.events?.map((event) => ({
            _id: event._id,
            title: event.title,
            start: moment(event.startDate).toDate(),
            end: moment(event.endDate).toDate(),
            status: event.status,
            description: event.description,
            props: props,
          }))
        );
        setIsChanged(true);
      })
      .catch((err) => console.log(err));
  };
  console.log(isChanged);
  console.log(selectedStudent);

  return (
    <div>
      {props.loginStatus.userRole === "instructor" && (
        <select
          selected="selected"
          value={
            selectedStudent === undefined ||
            selectedStudent === "Select Student"
              ? ""
              : selectedStudent._id
          }
          name="student"
          id="student"
          onChange={setSelectedStudentHandlerForInstructor}
        >
          <option id="firstStudent">Select Student</option>
          {studentsOfInstructor.map((student) => {
            return (
              <option
                key={student._id}
                value={student._id}
              >{`${student.firstname} ${student.lastname}`}</option>
            );
          })}
        </select>
      )}

      {props.loginStatus.userRole === "owner" && (
        <div>
          <select
            selected="selected"
            value={
              selectedInstructor === undefined ||
              selectedInstructor === "Select Instructor"
                ? ""
                : selectedInstructor._id
            }
            name="instructor"
            id="instructor"
            onChange={setSelectedInstructorHandler}
          >
            <option id="first">Select Instructor</option>
            {availableInstructors.map((instructor) => {
              return (
                <option
                  key={instructor._id}
                  value={instructor._id}
                >{`${instructor.firstname} ${instructor.lastname}`}</option>
              );
            })}
          </select>
          {selectedInstructor !== undefined && (
            <select
              selected="selected"
              value={
                selectedStudent === undefined ||
                selectedStudent === "Select Student"
                  ? ""
                  : selectedStudent._id
              }
              name="student"
              id="student"
              onChange={setSelectedStudentHandlerForInstructor}
            >
              <option id="firstStudent">Select Student</option>
              {studentsOfInstructor.map((student) => {
                return (
                  <option
                    key={student._id}
                    value={student._id}
                  >{`${student.firstname} ${student.lastname}`}</option>
                );
              })}
            </select>
          )}
        </div>
      )}
      {(props.loginStatus.userRole === "instructor" ||
        props.loginStatus.userRole === "owner") && (
        <div>
          {props.loginStatus.userRole === "instructor" &&
            (document.getElementById("first") ? (
              <></>
            ) : (
              <Button onClick={showAddEventModal}>Add Event</Button>
            ))}
          {props.loginStatus.userRole === "owner" && (
            <Button onClick={showAddEventModal}>Add Event</Button>
          )}
          <StyledModal
            aria-labelledby="unstyled-modal-title"
            aria-describedby="unstyled-modal-description"
            open={isOpened}
            onClose={hideAddEventModel}
            BackdropComponent={Backdrop}
          >
            <Box sx={style}>
              <div>
                <form onSubmit={newEventHandler}>
                  {props.loginStatus.userRole === "owner" && (
                    <div>
                      <h5>Event Type</h5>
                      <select
                        selected="selected"
                        value={newEvent.title}
                        name="event"
                        id="event"
                        onChange={(e) => {
                          setNewEvent({ ...newEvent, title: e.target.value });
                        }}
                      >
                        {eventOptions}
                      </select>
                      {newEvent.title === "Individual (Instructor)" && (
                        <select
                          selected="selected"
                          value={
                            newEvent.user === undefined ? "" : newEvent.user
                          }
                          name="instructor"
                          id="instructor"
                          onChange={(e) => {
                            setNewEvent({
                              ...newEvent,
                              user: e.target.value,
                            });
                          }}
                        >
                          <option id="firstInstructor">
                            Select Instructor
                          </option>
                          {availableInstructors.map((instructor) => {
                            return (
                              <option
                                key={instructor._id}
                                value={instructor._id}
                              >
                                {instructor.firstname} {instructor.lastname}
                              </option>
                            );
                          })}
                        </select>
                      )}
                      {(newEvent.title === "Practical Class" ||
                        newEvent.title === "Internal Exam" ||
                        newEvent.title === "Theory Class (Course)") && (
                        <select
                          selected="selected"
                          value={
                            selectedCourse === undefined
                              ? ""
                              : selectedCourse._id
                          }
                          name="course"
                          id="course"
                          onChange={setSelectedCourseHandler}
                        >
                          <option id="firstCourse">Select Course</option>
                          {availableCourses.map((course) => {
                            return (
                              <option key={course._id} value={course._id}>
                                {course.name}
                              </option>
                            );
                          })}
                        </select>
                      )}
                      {selectedCourse !== undefined &&
                        (newEvent.title === "Practical Class" ||
                          newEvent.title === "Internal Exam") && (
                          <select
                            value={
                              newEvent.user === undefined ? "" : newEvent.user
                            }
                            selected="selected"
                            name="student"
                            id="student"
                            onChange={(e) => {
                              setNewEvent({
                                ...newEvent,
                                user: e.target.value
                                  ? e.target.value
                                  : undefined,
                              });
                            }}
                          >
                            <option id="firstStudent">Select Student</option>
                            {studentsOfCourse.map((student) => {
                              return (
                                <option key={student._id} value={student._id}>
                                  {student.firstname} {student.lastname}
                                </option>
                              );
                            })}
                          </select>
                        )}
                    </div>
                  )}

                  <DatePicker
                    showTimeSelect
                    dateFormat="MMMM d, yyyy h:mm aa"
                    showTimeInput
                    placeholderText="Start Date"
                    style={{ marginRight: "10px" }}
                    selected={newEvent.start}
                    onChange={(start) => setNewEvent({ ...newEvent, start })}
                  />

                  <DatePicker
                    showTimeSelect
                    dateFormat="MMMM d, yyyy h:mm aa"
                    showTimeInput
                    placeholderText="End Date"
                    style={{ marginRight: "10px" }}
                    selected={newEvent.end}
                    onChange={(end) => setNewEvent({ ...newEvent, end })}
                  />
                  <Button type="Submit">Add Event</Button>
                </form>
              </div>
            </Box>
          </StyledModal>
        </div>
      )}

      <Calendar
        localizer={localizer}
        events={allEvents}
        startAccessor="start"
        endAccessor="end"
        style={{ height: 800, width: 1000, marginLeft: -100 }}
        eventPropGetter={() => ({
          style: { backgroundColor: "darkgray", overflow: "hidden" },
        })}
        components={{
          event: EventComponent,
        }}
      />
    </div>
  );
};

export default Schedule;
