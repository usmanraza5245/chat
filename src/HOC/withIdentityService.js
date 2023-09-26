import IdentityProvider from "@/context/IdentityProvider";
import React from "react";

function withIdentityService(Component) {
  return (props) => (
    <IdentityProvider>
      <Component {...props} />
    </IdentityProvider>
  );
}

export default withIdentityService;
