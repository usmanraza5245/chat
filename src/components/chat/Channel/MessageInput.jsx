import { Box, IconButton } from "@mui/material";
import React, { useRef, useState } from "react";
import CancelIcon from "@mui/icons-material/Cancel";
import SendIcon from "@mui/icons-material/Send";
import AttachFileIcon from "@mui/icons-material/AttachFile";
import AttachmentService from "@/config/AttachmentService";
import { getChannelMessage, sendChannelMessage } from "@/config/ChimeAPI";

const uploadObjDefaults = {
  name: "",
  file: "",
  type: "",
  response: null,
  key: "",
};

function MessageInput({ activeChannel, setMessages, member }) {
  const [text, setText] = useState("");
  const uploadRef = useRef(null);
  const [uploadObj, setUploadObj] = useState(uploadObjDefaults);
  const handleSendMessage = async (e) => {
    e.preventDefault();
    console.log("sending message");
    let sendMessageResponse;
    let options;
    if (uploadRef.current.files[0]) {
      try {
        const response = await AttachmentService.upload(
          uploadRef.current.files[0]
        );
        setUploadObj({
          key: response.key,
          ...uploadObj,
        });

        options.Metadata = JSON.stringify({
          attachments: [
            {
              fileKey: response.key,
              name: uploadObj.name,
              size: uploadObj.file.size,
              type: uploadObj.file.type,
            },
          ],
        });
        setUploadObj(uploadObjDefaults);
        uploadRef.current.value = "";
      } catch (err) {
        setUploadObj({
          response: `Can't upload file: ${err}`,
          ...uploadObj,
        });
      }
    }
    sendMessageResponse = await sendChannelMessage(
      activeChannel.ChannelArn,
      text,
      "PERSISTENT",
      "STANDARD",
      member,
      null,
      options
    );
    setText("");
    if (sendMessageResponse.response.Status == "PENDING") {
      const sentMessage = await getChannelMessage(
        activeChannel.ChannelArn,
        member,
        sendMessageResponse.response.MessageId,
        null
      );
      const newMessages = [...MessagesContainer, sentMessage];
      setMessages([...newMessages]);
    }
  };
  const handleInputChange = (e) => {
    setText(e.target.value);
  };
  return (
    <Box
      sx={{
        display: "flex",
        flexFlow: "row",
        marginTop: "auto",
        marginBottom: "0px",
        minHeight: "4rem",
      }}
    >
      <form
        style={{
          display: "flex",
          padding: "0.5rem 0 1rem 1rem",
          width: "100%",
        }}
        onSubmit={handleSendMessage}
      >
        <IconButton onClick={(e) => uploadRef.current.click()}>
          <AttachFileIcon />
        </IconButton>
        <input
          ref={uploadRef}
          type="file"
          style={{ display: "none" }}
          onChange={(event) => {
            const file = event.target.files[0];
            if (!file) return;

            if (file.size / 1024 / 1024 < 5) {
              setUploadObj({
                file: file,
                name: file.name,
              });
            } else {
              console.log("Maximum supported file size is up to 5mb");
            }
          }}
        />
        <div style={{ display: "flex", width: "100%", position: "relative" }}>
          <input
            style={{
              padding: "0.3437rem 1.75rem 0.3437rem 0.5rem",
              width: "100%",
            }}
            value={text}
            onChange={handleInputChange}
          />
          {text && (
            <IconButton
              style={{ position: "absolute", right: "5px", top: "-2px" }}
              onClick={() => setText("")}
            >
              <CancelIcon />
            </IconButton>
          )}
        </div>
        <IconButton type="submit">
          <SendIcon />
        </IconButton>
      </form>
    </Box>
  );
}

export default MessageInput;
