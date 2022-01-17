import React, { useEffect, useState } from "react";
import { styled, Box } from "@mui/system";
import ModalUnstyled from "@mui/base/ModalUnstyled";
import classes from "./EventComponent.module.css";
import Button from "../../components/Button/Button";

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

const EventComponent = ({ event }) => {
  const [isOpened, setIsOpened] = useState(false);
  const [isChanged, setIsChanged] = useState(false);

  const handleOpen = (e) => {
    e.preventDefault();
    setIsOpened(true);
    setIsChanged(true)

  };

  const handleClose = (e) => {
    e.preventDefault();
    setIsOpened(false);
    setIsChanged(true)
  };

  const changeEventStatus = (e, curStatus) => {
    fetch("http://localhost:3001/changeEventStatus", {
      method: "POST",
      headers: {
        Authorization: "Bearer " + event.props.loginStatus.token,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        eventId: event._id,
        curStatus: curStatus,
      }),
    })
      .then((res) => {
        if (res.status === 422) {
          throw new Error("Validation failed.");
        }
        if (res.status !== 200 && res.status !== 201) {
          console.log("Error!");
          throw new Error("Changing status failed!");
        }
        return res.json();
      })
      .then((resData) => {
        console.log(resData);
        event.status === false ? event.status = true : event.status = false;
        setIsChanged(true);
        setIsOpened(false);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const deleteEventHandler = e => {
    fetch('http://localhost:3001/deleteEvent', {
      method: 'PATCH',
      headers: {
        Authorization: "Bearer " + event.props.loginStatus.token,
        "Content-Type": "application/json",
      }, 
      body: JSON.stringify({
        eventId: event._id
      })
    }).then((res) => {
      if (res.status === 422) {
        throw new Error("Validation failed.");
      }
      if (res.status !== 200 && res.status !== 201) {
        console.log("Error!");
        throw new Error("Deleting failed!");
      }
      return res.json();
    })
    .then((resData) => {
      console.log(resData);
      setIsChanged(true);  
      window.location.reload();
      setIsOpened(false);
    })
    .catch((err) => {
      console.log(err);
    });
  }

  useEffect(() => setIsChanged(false), [setIsChanged]);

  console.log(event);
  return (
    <React.Fragment>
      <div onClick={handleOpen}>
        {event.status === false && (
          <div className={classes.EventComponent}>
            <span>{event.title}</span><br/>
            <span style={{fontSize: 10}}>{event.description.split(',')[0]}</span><br/>
            <span style={{fontSize: 10}}>{event.description.split(',')[1]}</span>
          
          </div>
        )}
        {event.status === true && (
          <div
            style={{ backgroundColor: "green", padding: 2, borderRadius: 2 }}
          >
            <span>{event.title}</span><br/>
            <span style={{fontSize: 10}}>{event.description.split(',')[0]}</span><br/>
            <span style={{fontSize: 10}}>{event.description.split(',')[1]}</span>

          </div>
        )}
      </div>
      <StyledModal
        aria-labelledby="unstyled-modal-title"
        aria-describedby="unstyled-modal-description"
        open={isOpened}
        onClose={handleClose}
        BackdropComponent={Backdrop}
      >
        <Box
          sx={style}
          style={{
            backgroundColor: event.status === false ? "red" : "lightgreen",
          }}
        >
          {event.props.loginStatus.userRole === "student" && (
            <div>
              <br />
              <span id="title" className={classes.dateTime}>
                {event.title}
              </span>
              <h3>Details:</h3>
              <h5>Status</h5>
              <span className={classes.dateTime}>
                {event.status.toString() === "false"
                  ? "Not completed"
                  : "Completed"}
              </span>
              <h5>Date:</h5>
              <span className={classes.dateTime}>
                {event.start.toISOString().slice(0, 16).replace("T", " ")} -{" "}
                {event.end.toISOString().slice(0, 16).replace("T", " ")}
              </span>
              <h5>Descripton:</h5>
              <span className={classes.dateTime}>{event.description}</span>
            </div>
          )}
          {event.props.loginStatus.userRole === "instructor" && (
            <div>
              <br />
              <span id="title" className={classes.dateTime}>
                {event.title}
              </span>
              <h3>Details:</h3>
              <h5>Status</h5>
              <span className={classes.dateTime}>
                {event.status.toString() === "false"
                  ? "Not completed"
                  : "Completed"}
              </span>
              <h5>Date:</h5>
              <span className={classes.dateTime}>
                {event.start.toISOString().slice(0, 16).replace("T", " ")} -{" "}
                {event.end.toISOString().slice(0, 16).replace("T", " ")}
              </span>
              <h5>Descripton:</h5>
              <span className={classes.dateTime}>{event.description}</span>
              <Button onClick={(e) => changeEventStatus(e, event.status)}>
                Change Status
              </Button>
              <Button onClick={deleteEventHandler}>
                Delete Event
              </Button>
            </div>
          )}
          {event.props.loginStatus.userRole === "owner" && (
            <div>
              <br />
              <span id="title" className={classes.dateTime}>
                {event.title}
              </span>
              <h3>Details:</h3>
              <h5>Status</h5>
              <span className={classes.dateTime}>
                {event.status.toString() === "false"
                  ? "Not completed"
                  : "Completed"}
              </span>
              <h5>Date:</h5>
              <span className={classes.dateTime}>
                {event.start.toISOString().slice(0, 16).replace("T", " ")} -{" "}
                {event.end.toISOString().slice(0, 16).replace("T", " ")}
              </span>
              <h5>Descripton:</h5>
              <span className={classes.dateTime}>{event.description}</span>
              <Button onClick={(e) => changeEventStatus(e, event.status)}>
                Change Status
              </Button>
              <Button onClick={deleteEventHandler}>
                Delete Event
              </Button>
            </div>
          )}
        </Box>
      </StyledModal>
    </React.Fragment>
  );
};

export default EventComponent;
