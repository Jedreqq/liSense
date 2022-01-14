import React, { useCallback, useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import ButtonLink from "../../../components/ButtonLink/ButtonLink";
import Loader from "../../../components/Loader/Loader";
import { messageContext } from "../../../context/MessageContext";

import classes from "./SingleMessage.module.css";

const SingleMessage = (props) => {
  const { messageId } = useParams();

  const [messageData, setMessageData] = useState({
    sender: "",
    createdAt: "",
    topic: "",
    messageContent: "",
  });

  const [isLoaded, setIsLoaded] = useState(false);
  const { messages, setMessages } = useContext(messageContext);

  const loadSingleMessage = async () => {
    try {
      const res = await fetch("http://localhost:3001/messages/" + messageId, {
        headers: {
          Authorization: "Bearer " + props.loginStatus.token,
        },
      });

      if (res.status !== 200) {
        throw new Error("Failed to fetch status");
      }

      const message = messages?.messages?.find((x) => +x._id === +messageId);
      if (!!message) message.received = true;
      setMessages({ ...messages });
      const resData = await res.json();

      setMessageData((messageInfo) => ({
        ...messageInfo,
        sender: resData.message.sender,
        createdAt: resData.message.createdAt,
        topic: resData.message.topic,
        messageContent: resData.message.messageContent,
      }));
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => loadSingleMessage().finally((x) => setIsLoaded(true)), []);
  return isLoaded ? (
    <React.Fragment>
      <div className={classes.btnDiv}>
        <ButtonLink link="/mailbox">Back</ButtonLink>
      </div>
      <div className={classes.container}>
        <div className={classes.topic}>{messageData.topic}</div>
        <section className={classes.leftSide}>
          <p
            className={classes.containerP}
          >{`${messageData.sender.firstname} ${messageData.sender.lastname}`}</p>
          <p className={classes.containerP}>
            {messageData.createdAt
              ? messageData.createdAt.slice(0, 16).replace("T", " ")
              : new Date().toJSON().slice(0, 16).replace("T", " ")}{" "}
          </p>
        </section>
        <section className={classes.rightSide}>
          <p>{messageData.messageContent}</p>
        </section>
      </div>
    </React.Fragment>
  ) : (
    <div className={classes.centered}>
      <Loader />
    </div>
  );
};

export default SingleMessage;
