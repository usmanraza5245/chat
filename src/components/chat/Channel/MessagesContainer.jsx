import { Box } from "@mui/material";
import React, { useEffect, useRef } from "react";
import moment from "moment";

function MessagesContainer({
  messages,
  currentMember,
  messagesRef,
  activeChannel,
}) {
  const messageListRef = useRef(null);
  useEffect(() => {
    scrollToBottom();
  }, [activeChannel, messages]);

  // Function to scroll to the bottom of the message list
  const scrollToBottom = () => {
    if (messageListRef.current && messages?.length <= 50) {
      console.log("scroll height = ", messageListRef.current.scrollHeight);
      messageListRef.current.scrollTop =
        messageListRef.current.scrollHeight + 140;
      // const chatContanier = document.querySelector(".message-list");
      // chatContanier.style.paddingBottom = "0px";
    }
  };

  const handleScrollTop = () => {
    const element = messageListRef.current;
    if (element.scrollTop === 0) {
      console.log("load more content...");
      console.log("moved to top");
    }
  };

  return (
    <Box
      sx={{
        backgroundColor: "#ebebeb",
        overflowY: "scroll",
        position: "relative",
        padding: "0px 50px",
      }}
    >
      <div
        style={{
          textAlign: "center",
          padding: "0.76rem",
          marginBottom: "1rem",
          position: "sticky",
          zIndex: 2,
          top: 0,
          right: 0,
          left: 0,
        }}
      >
        Test
      </div>
      <div
        ref={messageListRef}
        style={{ height: "100%", overflowY: "scroll", paddingBottom: "0px" }}
        onScroll={handleScrollTop}
      >
        <ul
          className={`message-list`}
          style={{
            padding: 0,
            margin: 0,
            listStyle: "none",
            // paddingBottom: "40px",
          }}
        >
          {messages.map((message) => {
            const { Sender, MessageId, Content, CreatedTimestamp } = message;
            return (
              <li id={MessageId} role="article" key={MessageId}>
                <div
                  style={{
                    display: "flex",
                    flexDirection: "row",
                    fontSize: "0.7rem",
                    alignItems: "center",
                    // width: "100%",
                    padding: "10px 5px",
                    justifyContent:
                      Sender?.Name === currentMember?.username
                        ? "flex-end"
                        : "flex-start",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      gap: "5px",
                      backgroundColor: "#fff",
                      padding: "10px 25px",
                      borderRadius: "10px",
                      border: "1px solid #ebebeb",
                    }}
                  >
                    {/* <div
                      style={{
                        backgroundColor: "#f1f2f3",
                        padding: "5px",
                        borderRadius: "3px",
                      }}
                    >
                      {Sender?.Name === currentMember?.username
                        ? "You"
                        : Sender.Name}
                    </div> */}
                    <div style={{ fontSize: 16 }}>{Content}</div>
                    <span>{moment(CreatedTimestamp).format("hh:mm A")}</span>
                  </div>
                </div>
              </li>
            );
          })}
        </ul>
      </div>
    </Box>
  );
}

export default MessagesContainer;
