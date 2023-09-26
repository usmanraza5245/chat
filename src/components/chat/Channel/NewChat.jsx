import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControlLabel,
  Radio,
  TextField,
  Box,
  Typography,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  ListItemAvatar,
  Avatar,
} from "@mui/material";
import React, { useState, useEffect, useRef } from "react";
import InfiniteScroll from "react-infinite-scroll-component";
import { useIdentityService } from "@/context/IdentityProvider";
import { useAuthContext } from "@/context/AuthProvider";
import {
  createChannel,
  createChannelMembership,
  describeChannel,
} from "@/config/ChimeAPI";
import appConfig from "@/Config";

function NewChat() {
  const [open, setOpen] = useState(false);
  const [searchText, setSearchText] = useState("");

  const identityClient = useIdentityService();
  const { useCognitoIdp, member } = useAuthContext();
  const [selectedUser, setSelectedUser] = useState(null);
  const [usersList, setUsersList] = useState([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);

  const getUsers = async () => {
    try {
      // const limit = 5;
      // const skip = (page - 1) * 5;
      // const data = await fetch(
      //   `https://dummyjson.com/users?limit=${limit}&skip=${skip}`
      // );
      // const jsonData = await data.json();
      // console.log("json data...", jsonData);
      // setUsersList([...usersList, ...jsonData.users]);
      // setPage((prev) => prev + 1);
      // if (jsonData.users?.length === 0) {
      //   setHasMore(false);
      // }
    } catch (err) {
      console.log("error...", err);
    }
  };

  const handleSearchText = (event) => {
    setSearchText(event.target.value);
  };

  const handleOpen = () => {
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
  };

  const selectUser = (user) => {
    setSelectedUser(user);
  };

  const getAllUsersFromCognitoIdp = () => {
    identityClient
      ?.getUsers()
      .then((users) => {
        const list = users
          .filter((user) => getUserAttributeByName(user, "profile") !== "none")
          .map((user) => {
            return {
              label: user.Username,
              value: user.Attributes.filter(
                (attr) => attr.Name === "profile"
              )[0].Value,
            };
          });
        setUsersList(list);
      })
      .catch((err) => {
        throw new Error(
          `Failed at getAllUsersFromCognitoIdp() with error: ${err}`
        );
      });
  };

  const getUserAttributeByName = (user, attribute) => {
    try {
      return user.Attributes.filter((attr) => attr.Name === attribute)[0].Value;
    } catch (err) {
      throw new Error(`Failed at getUserAttributeByName() with error: ${err}`);
    }
  };

  const getAllUsers = () => {
    // either approach works, but if you have an IDP it is likely other apps will use IDP to find users so why not reuse here
    if (useCognitoIdp) {
      return getAllUsersFromCognitoIdp();
    } else {
      return getAllUsersFromListAppInstanceUsers();
    }
  };

  useEffect(() => {
    // console.log("running...", identityClient);
    // if (!identityClient) return;\
    setupClient();
  }, [identityClient]);

  const setupClient = async () => {
    if (useCognitoIdp) {
      await identityClient.setupClient();
      getAllUsers();
    }
  };

  const handleCreateChat = async (e) => {
    e.preventDefault();

    try {
      let name = member.username + "-" + selectedUser.label;
      let mode = "RESTRICTED";
      let privacy = "PRIVATE";
      const channelArn = await createChannel(
        appConfig.appInstanceArn,
        null,
        name,
        mode,
        privacy,
        null,
        member.userId
      );
      // console.log("channel Arn", channelArn);
      if (channelArn) {
        const channel = await describeChannel(channelArn, member.userId);
        console.log("described channel", channel);
        console.log("selected user...", selectedUser);
        const membership = await createChannelMembership(
          channel.ChannelArn,
          `${appConfig.appInstanceArn}/user/${selectedUser.value}`,
          member.userId
        );
        console.log("add user to channel", membership);
      } else {
        console.log("channel issue");
      }
      handleClose();
    } catch (error) {
      console.log("error...", error);
    }
  };

  return (
    <>
      <Button variant="contained" color="primary" onClick={handleOpen}>
        New Chat
      </Button>
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle px={2}>New Chat</DialogTitle>
        <DialogContent>
          <Box p={1} width={"100%"}>
            <TextField
              label="search"
              value={searchText}
              onChange={handleSearchText}
              sx={{
                width: "100%",
              }}
            />
          </Box>
          <InfiniteScroll
            dataLength={usersList.length}
            next={getUsers}
            hasMore={hasMore}
            loader={<h2>Loading...</h2>}
            height={200}
          >
            <List
              sx={{
                width: "100%",
                minWidth: "400px",
              }}
            >
              {usersList?.map((user) => (
                <ListItem disablePadding key={user.value}>
                  <ListItemButton
                    selected={selectedUser?.value === user.value}
                    onClick={(e) => selectUser(user)}
                    sx={{
                      "&.Mui-selected": {
                        backgroundColor: "#daC12C",
                        "&:hover": {
                          backgroundColor: "#7DC12C",
                        },
                      },
                    }}
                  >
                    <ListItemAvatar>
                      <Avatar />
                    </ListItemAvatar>
                    <ListItemText primary={user.label} secondary={user.value} />
                  </ListItemButton>
                </ListItem>
              ))}
            </List>
          </InfiniteScroll>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button
            onClick={handleCreateChat}
            color="primary"
            variant="contained"
          >
            Submit
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}

export default NewChat;
