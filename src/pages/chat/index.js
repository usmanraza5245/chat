import withIdentityService from "@/HOC/withIdentityService";
import withMessagingService from "@/HOC/withMessagingService";
import ChannelWrappers from "@/components/chat/Channel/ChannelWrappers";
import MessageInput from "@/components/chat/Channel/MessageInput";
import MessagesContainer from "@/components/chat/Channel/MessagesContainer";
import { useAuthContext } from "@/context/AuthProvider";
import {
  useChatChannelState,
  useChatMessagingState,
} from "@/context/ChatMessagesProvider";
import { useIdentityService } from "@/context/IdentityProvider";
import { Box, Grid, Typography } from "@mui/material";
import React, { useEffect, useState } from "react";

function ChatPage() {
  const { member } = useAuthContext();
  const { activeChannel } = useChatChannelState();
  const { messages, messagesRef, setMessages, onReceiveMessage } =
    useChatMessagingState();

  return (
    <Grid container height={"calc(100vh - 20px)"} backgroundColor="#ebebeb">
      <Grid item xs={12} md={5} lg={4} xl={3}>
        <ChannelWrappers />
      </Grid>
      <Grid item xs={12} md={7} lg={8} xl={9} height={"calc(100vh - 20px)"}>
        <Box
          sx={{
            background: "#ebebeb",
            height: "100%",
            width: "100%",
            overflowY: "scroll",
            display: "flex",
            flexDirection: "column",
            border: "1px solid #fff",
          }}
        >
          {activeChannel.ChannelArn ? (
            <>
              <MessagesContainer
                messages={messages}
                currentMember={member}
                messagesRef={messagesRef}
                activeChannel={activeChannel}
              />
              <MessageInput
                activeChannel={activeChannel}
                setMessages={setMessages}
                member={member}
              />
            </>
          ) : (
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                height: "100%",
              }}
            >
              <Typography fontSize={20}>Welcome</Typography>
            </Box>
          )}
        </Box>
      </Grid>
    </Grid>
  );
}

export default withIdentityService(withMessagingService(ChatPage));
