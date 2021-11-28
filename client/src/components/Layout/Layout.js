import { Fragment } from "react";
import classes from "./Layout.module.css";
import MainNav from "../MainNav/MainNav";

const Layout = (props) => {
  return (
    <Fragment>
      <MainNav activeBranch={props.activeBranch} onLogout={props.onLogout} loginStatus={props.loginStatus} />
      <main className={classes.main}>{props.children}</main>
    </Fragment>
  );
};

export default Layout;
