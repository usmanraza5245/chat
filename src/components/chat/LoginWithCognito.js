// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: MIT-0

import React, { useState } from "react";
import {
  FormField,
  Input,
  Button,
  Heading,
} from "amazon-chime-sdk-component-library-react";
import SignIn from "../auth/SignIn";

const LoginWithCognito = (props) => {
  const { login, register } = props;

  return (
    <div>
      <SignIn onLogin={login} />
    </div>
  );
};

export default LoginWithCognito;
