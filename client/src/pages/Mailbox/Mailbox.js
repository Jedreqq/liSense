import react, { useCallback, useContext, useEffect, useState } from "react";
import Loader from "../../components/Loader/Loader";
import Message from "../../components/Message/Message";
import { messageContext } from "../../context/MessageContext";

import classes from "./Mailbox.module.css";

const Mailbox = (props) => {
  // const [messages, setMessages] = useState({
  //   messages: [],
  // });

  const [isLoaded, setIsLoaded] = useState(true);
  const {loadMailbox, messages } = useContext(messageContext);

  // const loadMailbox = useCallback(async() => {
  //   try {
  //   const res = await fetch("http://localhost:3001/messages", {
  //     headers: {
  //       Authorization: "Bearer " + props.loginStatus.token,
  //     },
  //   })
  //       if (res.status !== 200) {
  //         throw new Error("Failed to fetch messages.");
  //       }
  //       const resData = await res.json();
  //       console.log(resData)
  //       setMessages((messageInfo) => ({
  //         ...messageInfo,
  //         messages: resData.mailbox.messages.map((message) => {
  //           return {
  //             ...message,
  //           };
  //         }),
  //       }));
  //     } catch(err) {
  //       console.log(err);
  //     }
  // }, [props.loginStatus.token]);

  // useEffect(() => loadMailbox().finally(x => setIsLoaded(true)), [loadMailbox, setIsLoaded, props.loginStatus.token]);

  return isLoaded ?
    <div>
      <div className={classes.mailboxDiv}>Current Mailbox.</div>
      {messages.messages.length === 0 ? (
        <p>No messages in mailbox...</p>
      ) : (
        <table className={classes.table}>
          <tbody>
            <tr>
              <td>Sender</td>
              <td>Date</td>
              <td>Topic</td>
              <td>Actions</td>
            </tr>
            {messages.messages.map((message) => (
            <Message
              loginStatus={props.loginStatus}
              key={message._id}
              id={message._id}
              topic={message.topic}
              sender={message.sender}
              createdAt={message.createdAt}
              received={message.received}
            />
          ))}
          </tbody>
        </table>
        
      )}
    </div> : <div className={classes.centered}>
      <Loader />
    </div>
};

export default Mailbox;
