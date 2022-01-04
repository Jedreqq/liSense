import { NavLink } from "react-router-dom";
import classes from "./MainNav.module.css";

const MainNav = (props) => {
  let isAuth = props.loginStatus.isAuth;
  let isOwner = props.loginStatus.userRole === 'owner' ? true : false;
  let isStudentOrInstructor =
  (props.loginStatus.userRole === "student" || props.loginStatus.userRole === "instructor") ? true : false;
  let isStudent = (props.loginStatus.userRole === "student");
  let isMember = props.isMember;

  return (
    <header className={classes.header}>
      <NavLink to="/" style={{ textDecoration: "none" }}>
        <div className={classes.logo}>liSense</div>
      </NavLink>
      <nav className={classes.nav}>
        {!isAuth && (
          <ul>
            <li>
              <NavLink to="/login" className={(navData) => navData.isActive ? classes.active : ''}>
                Login
              </NavLink>
            </li>
            <li>
              <NavLink to="/signup" className={(navData) => navData.isActive ? classes.active : ''}>
                Signup
              </NavLink>
            </li>
          </ul>
        )}
        {isAuth && isOwner && (
          <ul>
            <li>
              <NavLink to="/branches" className={(navData) => navData.isActive ? classes.active : ''}>Branches</NavLink>              
            </li>
            <li>
              <NavLink to="/students" className={(navData) => navData.isActive ? classes.active : ''}>Students</NavLink>
            </li>
            <li>
              <NavLink to="/instructors" className={(navData) => navData.isActive ? classes.active : ''}>Instructors</NavLink>
            </li>
            <li>
              <NavLink to="/fleet" className={(navData) => navData.isActive ? classes.active : ''}>Fleet</NavLink>
            </li>
            <li>
              <NavLink to="/invoices" className={(navData) => navData.isActive ? classes.active : ''}>Invoices</NavLink>
            </li>
            <li>
              <NavLink to="/schedule" className={(navData) => navData.isActive ? classes.active : ''}>Schedule</NavLink>
            </li>
            <li>
              <NavLink to="/courses" className={(navData) => navData.isActive ? classes.active : ''}>Courses</NavLink>
            </li>
            <li>
              <button onClick={props.onLogout}>Logout</button>
            </li>
          </ul>
        )}
        {isAuth && isStudent && isMember && (
          <ul>
            <li>
              <NavLink to="/courses" className={(navData) => navData.isActive ? classes.active : ''}>Courses</NavLink>
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
