import { NavLink } from "react-router-dom";
import classes from "./MainNav.module.css";

const MainNav = (props) => {
  let isAuth = props.loginStatus.isAuth;
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
        {isAuth && (
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
