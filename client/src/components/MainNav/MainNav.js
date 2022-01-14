import { useCallback, useContext, useEffect, useState } from "react";
import { NavLink } from "react-router-dom";
import { messageContext } from "../../context/MessageContext";
import classes from "./MainNav.module.css";

const MainNav = (props) => {
  let isAuth = props.loginStatus.isAuth;
  let isOwner = props.loginStatus.userRole === "owner" ? true : false;
  let isStudentOrInstructor =
    props.loginStatus.userRole === "student" ||
    props.loginStatus.userRole === "instructor"
      ? true
      : false;
  let isStudent = props.loginStatus.userRole === "student";
  let isInstructor = props.loginStatus.userRole === "instructor";
  let isMember = props.isMember;
  const {messages, notificationCount, setNotificationCount} = useContext(messageContext);

  const countNotification = useCallback(() => {
    let counter = 0;
    messages?.messages?.forEach((message) => {
      if (!message.received) {
        counter++;
      }
    });
    return counter;
  }, [messages]);

  useEffect(() => setNotificationCount(countNotification()), [setNotificationCount, countNotification])

  // const [isLoaded, setIsLoaded] = useState(false);
  // const [notificationCount, setNotificationCount] = useState(0);

  // const loadNav = useCallback(async() => {
  //   try {
  //     const res = await fetch('http://localhost:3001/notifications', {
  //       headers: {
  //         Authorization: "Bearer " + props.loginStatus.token
  //       }
  //     });
  //     const resData = await res.json();
  //     console.log(resData);
  //    setNotificationCount(resData.counter);
  //   } catch(err) {
  //     console.log(err);
  //   }
  // }, [props.loginStatus.token])
  
  // useEffect(() => loadNav().finally(x => setIsLoaded(true)), [loadNav, setIsLoaded])

  return (
    <header className={classes.header}>
      <NavLink to="/" style={{ textDecoration: "none" }}>
        <div className={classes.logo}>liSense</div>
      </NavLink>
      <nav className={classes.nav}>
        {!isAuth && (
          <ul>
            <li>
              <NavLink
                to="/login"
                className={(navData) =>
                  navData.isActive ? classes.active : ""
                }
              >
                Login
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/signup"
                className={(navData) =>
                  navData.isActive ? classes.active : ""
                }
              >
                Signup
              </NavLink>
            </li>
          </ul>
        )}
        {isAuth && isOwner && (
          <ul>
            <li>
              <NavLink
                to="/branches"
                className={(navData) =>
                  navData.isActive ? classes.active : ""
                }
              >
                Branches
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/students"
                className={(navData) =>
                  navData.isActive ? classes.active : ""
                }
              >
                Students
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/instructors"
                className={(navData) =>
                  navData.isActive ? classes.active : ""
                }
              >
                Instructors
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/fleet"
                className={(navData) =>
                  navData.isActive ? classes.active : ""
                }
              >
                Fleet
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/payments"
                className={(navData) =>
                  navData.isActive ? classes.active : ""
                }
              >
                Payments
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/schedule"
                className={(navData) =>
                  navData.isActive ? classes.active : ""
                }
              >
                Schedule
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/courses"
                className={(navData) =>
                  navData.isActive ? classes.active : ""
                }
              >
                Courses
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/mailbox"
                className={(navData) =>
                  navData.isActive ? classes.active : ""
                }
              >
                Mailbox ({notificationCount === undefined ?  ' ' : notificationCount})
              </NavLink>
              
            </li>
            <li>
              <button onClick={props.onLogout}>Logout</button>
            </li>
          </ul>
        )}
        {isAuth && isStudent && isMember && (
          <ul>
            <li>
              <NavLink
                to="/instructors"
                className={(navData) =>
                  navData.isActive ? classes.active : ""
                }
              >
                Instructors
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/courses"
                className={(navData) =>
                  navData.isActive ? classes.active : ""
                }
              >
                Courses
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/mailbox"
                className={(navData) =>
                  navData.isActive ? classes.active : ""
                }
              >
                Mailbox ({notificationCount === undefined ?  ' ' : notificationCount})
              </NavLink>
            </li>
          </ul>
        )}
        {isAuth && isStudentOrInstructor && (
          <ul>
            <li>
              <button onClick={props.onLogout}>Logout</button>
            </li>
          </ul>
        )}
        {isAuth && isInstructor && isMember && (
          <ul>
            <li>
              <NavLink
                to="/students"
                className={(navData) =>
                  navData.isActive ? classes.active : ""
                }
              >
                Students
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/schedule"
                className={(navData) =>
                  navData.isActive ? classes.active : ""
                }
              >
                Schedule
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/mailbox"
                className={(navData) =>
                  navData.isActive ? classes.active : ""
                }
              >
                Mailbox ({notificationCount === undefined ?  ' ' : notificationCount})
              </NavLink>
            </li>
          </ul>
        )}
      </nav>
    </header>
  );
};

export default MainNav;
