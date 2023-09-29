import React from 'react'
import { Alert } from 'reactstrap';

const Error = (props) =>
  props.error ? <Alert color="success">{props.error}</Alert> : "";

export default Error;
