import react, { useCallback, useContext, useEffect, useState } from "react";
import Loader from "../../components/Loader/Loader";
import Message from "../../components/Message/Message";
import { messageContext } from "../../context/MessageContext";
import ReactPaginate from 'react-paginate';

import classes from "./Mailbox.module.css";
import React from "react";

const Mailbox = (props) => {
  // const [messages, setMessages] = useState({
  //   messages: [],
  // });
  const [pageNumber, setPageNumber] = useState(0);
  const [isLoaded, setIsLoaded] = useState(true);
  const {loadMailbox, messages } = useContext(messageContext);

  const messagesPerPage = 10;
  const pagesVisited = pageNumber * messagesPerPage;

  const showMessages = messages.messages.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)).slice(pagesVisited, pagesVisited + messagesPerPage).map((message) => { return (
    <Message
      loginStatus={props.loginStatus}
      key={message._id}
      id={message._id}
      topic={message.topic}
      sender={message.sender}
      createdAt={message.createdAt}
      received={message.received}
    />
  )});

    const pageCount = Math.ceil(messages.messages.length / messagesPerPage);
    const changeCurrentPage = ({selected}) => {
      setPageNumber(selected)
    }
  return isLoaded ?
    <div>
      <div className={classes.mailboxDiv}>Current Mailbox.</div>
      {messages.messages.length === 0 ? (
        <p>No messages in mailbox...</p>
      ) : (
        <React.Fragment>

        <table className={classes.table}>
          <tbody>
            <tr>
              <td>Sender</td>
              <td>Date</td>
              <td>Topic</td>
              <td>Actions</td>
            </tr>
            {showMessages} 
            {/* {messages.messages.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)).map((message) => (
              <Message
              loginStatus={props.loginStatus}
              key={message._id}
              id={message._id}
              topic={message.topic}
              sender={message.sender}
              createdAt={message.createdAt}
              received={message.received}
              />
            ))} */}
          </tbody>
         
        </table>
         <ReactPaginate previousLabel={"Previous"} nextLabel={"Next"} pageCount={pageCount} onPageChange={changeCurrentPage} containerClassName={classes.pagination} previousLinkClassName={classes.previousBtn} nextLinkClassName={classes.nextBtn} disabledClassName={classes.paginationDisabled} activeClassName={classes.activePagination} />
            </React.Fragment>
      )}
    </div> : <div className={classes.centered}>
      <Loader />
    </div>
};

export default Mailbox;
