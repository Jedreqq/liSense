import { NavLink } from "react-router-dom";
import classes from "./MainNav.module.css";

const MainNav = (props) => {
  let isAuth = props.loginStatus.isAuth;
  let isOwner = props.loginStatus.userRole === 'owner' ? true : false;
  let isStudentOrInstructor =
  (props.loginStatus.userRole === "student" || props.loginStatus.userRole === "instructor") ? true : false;

  return (
    <header className={classes.header}>
      <NavLink to="/" style={{ textDecoration: "none" }}>
        <div className={classes.logo}>liSense</div>
      </NavLink>
      <nav className={classes.nav}>
        {!isAuth && (
          <ul>
            <li>
              <NavLink to="/login" className={classes.active}>
                Login
              </NavLink>
            </li>
            <li>
              <NavLink to="/signup" className={classes.active}>
                Signup
              </NavLink>
            </li>
          </ul>
        )}
        {isAuth && isOwner && (
          <ul>
            <li>
              <NavLink to="/branches" className={classes.active}>Branches</NavLink>              
            </li>
            <li>
              <NavLink to="/students" className={classes.active}>Students</NavLink>
            </li>
            <li>
              <NavLink to="/instructors" className={classes.active}>Instructors</NavLink>
            </li>
            <li>
              <NavLink to="/fleet" className={classes.active}>Fleet</NavLink>
            </li>
            <li>
              <NavLink to="/invoices" className={classes.active}>Invoices</NavLink>
            </li>
            <li>
              <NavLink to="/schedule" className={classes.active}>Schedule</NavLink>
            </li>
            <li>
              <NavLink to="/courses" className={classes.active}>Courses</NavLink>
            </li>
            <li>
              <button onClick={props.onLogout}>Logout</button>
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
      </nav>
    </header>
  );
};

export default MainNav;
