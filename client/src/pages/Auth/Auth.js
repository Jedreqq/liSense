import React from 'react';

import classes from './Auth.module.css';

const Auth = props => <section className={classes.auth_form}>{props.children}</section>;

export default Auth;