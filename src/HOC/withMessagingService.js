import { MessagingProvider } from "@/context/ChatMessagesProvider";
import React from "react";

function withMessagingService(Component) {
  return (props) => (
    <MessagingProvider>
      <Component {...props} />
    </MessagingProvider>
  );
}

export default withMessagingService;
