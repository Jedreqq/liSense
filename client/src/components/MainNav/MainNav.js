import { NavLink } from "react-router-dom";
import classes from "./MainNav.module.css"

const MainNav = (props) => {    
  return (
    <header className={classes.header}>
      <NavLink to="/" style={{ textDecoration: 'none' }}>
        <div className={classes.logo}>liSense</div>
      </NavLink>
      <nav className={classes.nav}>
        <ul>
          <li>
            <NavLink to="/login"  className={classes.active}>
              Login
            </NavLink>
          </li>
          <li>
            <NavLink to="/signup" className={classes.active}>
              Signup
            </NavLink>
          </li>
        </ul>
      </nav>
    </header>
  );
};

export default MainNav;
