import { createContext, useCallback, useEffect, useState } from "react";

export const messageContext = createContext(undefined);

export default function MessageContext(props) {
  const { children, token, onMessageReceived, isAuth } = props;
  const [notificationCount, setNotificationCount] = useState(undefined);
  const [messages, setMessages] = useState({
    messages: [],
  });

  onMessageReceived.current = (message) => {
    messages.messages.push(message);
    setMessages({ ...messages });
    console.log(message);
  };

  const loadMailbox = useCallback(async () => {
    try {
      const res = await fetch("http://localhost:3001/messages", {
        headers: {
          Authorization: "Bearer " + token,
        },
      });
      if (res.status !== 200) {
        throw new Error("Failed to fetch messages.");
      }
      const resData = await res.json();
      console.log(resData);
      setMessages((messageInfo) => ({
        ...messageInfo,
        messages: resData.mailbox.messages.map((message) => {
          return {
            ...message,
          };
        }),
      }));
    } catch (err) {
      console.log(err);
    }
  }, [token]);

  useEffect(() => {
      isAuth && loadMailbox();
      return () =>{
        setMessages({
            messages: [],
          });   
          setNotificationCount(undefined);
      }
      },[loadMailbox,setNotificationCount, isAuth]);




  return (
    <messageContext.Provider
      value={{
        messages,
        setMessages,
        loadMailbox,
        notificationCount, 
        setNotificationCount
      }}
    >
      {children}
    </messageContext.Provider>
  );
}
