import React, { useState } from "react";
import { styled, Box } from "@mui/system";
import ModalUnstyled from "@mui/base/ModalUnstyled";

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

  const handleOpen = (e) => {
    e.preventDefault();
    setIsOpened(true);
  };

  const handleClose = (e) => {
    e.preventDefault();
    setIsOpened(false);
  };

  return (
    <React.Fragment>
      <div onClick={handleOpen}>
        {event.status === false && (
          <div style={{ backgroundColor: "red", padding: 2, borderRadius: 2 }}>
            <span>{event.title}</span>
            {/* {event.users.map((user) => {
              return <p style={{ borderTop: 0, margin: 0 }}>{user + "\n"}</p>;
            })} */}
          </div>
        )}
        {event.status === true && (
          <div
            style={{ backgroundColor: "green", padding: 2, borderRadius: 2 }}
          >
            <span>{event.title}</span>
            {/* <p>
              {event.users.map((user) => {
                return user;
              })} */}
            {/* </p> */}
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
        <Box sx={style}>
          <div style={{backgroundColor: 'white'}}>
            Details: {event.status}{" "}
            {/* {event.users.map((user) => {
              return user;
            })} */}
          </div>
        </Box>
      </StyledModal>
    </React.Fragment>
  );
};

export default EventComponent;
