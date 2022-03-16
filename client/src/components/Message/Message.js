
import ButtonLink from "../ButtonLink/ButtonLink";

import classes from "./Message.module.css";

const Message = (props) => {
  return (
    <tr className={classes.messageSection}>
      <td
        className={props.received ? classes.readMessage : classes.message}
      >{props.topic}</td>
      <td className={props.received ? classes.readMessage : classes.message}>
        {props.createdAt
          ? props.createdAt.slice(0, 16).replace("T", " ")
          : new Date().toJSON().slice(0, 16).replace("T", " ")}
      </td>

      <td className={props.received ? classes.readMessage : classes.message}>
      {`${props.sender.firstname} ${props.sender.lastname}`}
      </td>
      <td>

      <ButtonLink  link={`/mailbox/read/${props.id}`}>Open</ButtonLink>
      </td>
    </tr>
  );
};

export default Message;
