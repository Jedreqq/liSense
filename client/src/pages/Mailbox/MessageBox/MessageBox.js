import react from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useState } from "react/cjs/react.development";
import Button from "../../../components/Button/Button";
import Input from "../../../components/Input/Input";

import classes from "./MessageBox.module.css";

const MessageBox = (props) => {
  const { userId } = useParams();
  const [messageData, setMessageData] = useState({
    topic: "",
    messageContent: "",
  });

  const navigate = useNavigate();

  const sendMessageHandler = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch("http://localhost:3001/sendMessage", {
        method: "POST",
        headers: {
          Authorization: "Bearer " + props.loginStatus.token,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          topic: messageData.topic,
          messageContent: messageData.messageContent,
          receiverId: userId,
        }),
      });

      if (res.status === 422) {
        throw new Error("Validation failed.");
      }
      if (res.status !== 200 && res.status !== 201) {
        console.log("Error!");
        throw new Error("Sending message failed!");
      }
      const resData = await res.json();
      
      console.log(resData);
      navigate('/mailbox');
      //  props.onCreateVehicle(e, resData);
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <form className={classes.messageBox} onSubmit={sendMessageHandler}>
      <Input
        id="topic"
        label="Topic"
        type="text"
        control="input"
        onChange={(e) => {
          setMessageData({ ...messageData, topic: e.target.value });
        }}
      />
      <label>Message</label>
      <textarea
        id="messageContent"
        className={classes.textarea}
        placeholder="Write message here..."
        onChange={(e) => {
          setMessageData({ ...messageData, messageContent: e.target.value });
        }}
      ></textarea>
      <div className={classes.btnDiv}>
        <Button type="submit">Send Message</Button>
      </div>
    </form>
  );
};

export default MessageBox;
