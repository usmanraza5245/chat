import React, { useState, useEffect, useRef } from "react";
import {
  PopOverItem,
  PopOverSeparator,
  PopOverSubMenu,
  IconButton,
  Dots,
  useNotificationDispatch,
  useMeetingManager,
  ChannelList,
  ChannelItem,
  SecondaryButton,
} from "amazon-chime-sdk-component-library-react";
import appConfig from "@/Config";
import mergeArrayOfObjects from "@/utilities/mergeArrays";
import { MeetingSessionConfiguration } from "amazon-chime-sdk-js";
import {
  Persistence,
  MessageType,
  associateChannelFlow,
  createMemberArn,
  createChannelMembership,
  createChannel,
  updateChannel,
  listChannelMessages,
  sendChannelMessage,
  listChannels,
  listChannelMembershipsForAppInstanceUser,
  listChannelsModeratedByAppInstanceUser,
  deleteChannel,
  describeChannel,
  listChannelMemberships,
  deleteChannelMembership,
  listChannelModerators,
  listChannelBans,
  listSubChannels,
  createChannelBan,
  deleteChannelBan,
  createMeeting,
  createAttendee,
  endMeeting,
  createGetAttendeeCallback,
  listChannelFlows,
  describeChannelFlow,
  disassociateChannelFlow,
  resetAWSClients,
} from "@/config/ChimeAPI";
import { useAuthContext } from "@/context/AuthProvider";
import {
  useChatChannelState,
  useChatMessagingState,
} from "@/context/ChatMessagesProvider";
import {
  Avatar,
  Box,
  Button,
  List,
  ListItem,
  ListItemAvatar,
  ListItemButton,
  ListItemText,
  Typography,
} from "@mui/material";
import NewChat from "./NewChat";
function ChannelWrappers() {
  const {
    activeChannelRef,
    activeSubChannelRef,
    channelList,
    channelListRef,
    channelListModerator,
    setChannelListModerator,
    subChannelList,
    setSubChannelList,
    setChannelList,
    setActiveChannel,
    setActiveSubChannel,
    activeChannel,
    activeSubChannel,
    activeChannelMemberships,
    setActiveChannelMemberships,
    setChannelMessageToken,
    unreadChannels,
    setUnreadChannels,
    hasMembership,
    meetingInfo,
    setMeetingInfo,
    activeChannelFlow,
    setActiveChannelFlow,
    activeView,
    setActiveView,
    moderatedChannel,
    setModeratedChannel,
    subChannelIds,
    setSubChannelIds,
  } = useChatChannelState();
  const { username, userId } = useAuthContext().member;
  const [activeChannelModerators, setActiveChannelModerators] = useState([]);
  const { setMessages } = useChatMessagingState();
  // get all channels
  useEffect(() => {
    if (!userId) return;
    console.log("userid..", userId);
    const fetchChannels = async () => {
      if (activeView === "User") {
        const userChannelMemberships =
          await listChannelMembershipsForAppInstanceUser(userId);
        const userChannelList = userChannelMemberships.map(
          (channelMembership) => {
            const channelSummary = channelMembership.ChannelSummary;
            channelSummary.SubChannelId =
              channelMembership.AppInstanceUserMembershipSummary.SubChannelId;

            return channelSummary;
          }
        );
        const tempChannelList = [...userChannelList];
        for (const channel of tempChannelList) {
          if (
            channel.SubChannelId &&
            !subChannelIds.includes(channel.SubChannelId)
          ) {
            subChannelIds.push(channel.SubChannelId);
          }
        }
        setSubChannelIds(subChannelIds);

        const publicChannels = await listChannels(
          appConfig.appInstanceArn,
          userId
        );

        const moderatorChannels = await listChannelsModeratedByAppInstanceUser(
          userId
        );
        const moderatorChannelList = moderatorChannels.map(
          (channelMembership) => channelMembership.ChannelSummary
        );
        setChannelList(
          mergeArrayOfObjects(
            mergeArrayOfObjects(publicChannels, userChannelList, "ChannelArn"),
            moderatorChannelList,
            "ChannelArn"
          )
        );
        console.log("user channel list", userChannelList);
      }
      // await publishStatusToAllChannels();
    };
    setTimeout(() => {
      fetchChannels();
    }, 1000);
  }, [userId, activeView]);

  const channelIdChangeHandler = async (channel) => {
    if (activeChannel.ChannelArn === channel.ChannelArn) return;

    let mods = [];
    setActiveChannelModerators([]);
    var isModerator = false;
    const channelType = JSON.parse(channel.Metadata || "{}").ChannelType;
    try {
      mods = await listChannelModerators(channel.ChannelArn, userId);
      setActiveChannelModerators([...mods]);
    } catch (err) {
      console.log("error", err);
    }

    isModerator = false;
    // mods?.find((moderator) => moderator.Moderator.Arn === messagingUserArn) ||
    // false;

    // userPermission.setRole(isModerator ? "moderator" : "user");

    const newChannel = await describeChannel(channel.ChannelArn, userId);
    newChannel.SubChannelId = channel.SubChannelId;
    channel = newChannel;
    const newMessages = await listChannelMessages(
      channel.ChannelArn,
      userId,
      channel.SubChannelId
    );
    setMessages(newMessages.Messages);
    setChannelMessageToken(newMessages.NextToken);
    setActiveChannel(channel);
    await loadChannelFlow(channel);

    setUnreadChannels(unreadChannels.filter((c) => c !== channel.ChannelArn));
  };

  const loadChannelFlow = async (channel) => {
    if (channel.ChannelFlowArn == null) {
      setActiveChannelFlow({});
    } else {
      let flow;
      try {
        flow = await describeChannelFlow(channel.ChannelFlowArn);
        setActiveChannelFlow(flow);
      } catch (err) {
        console.log("error while loading channel flow", err);
      }
    }
  };

  return (
    <Box p={2}>
      <Box display={"flex"} justifyContent="flex-end" mb={1} p={1}>
        <NewChat />
      </Box>
      {channelList?.length > 0 ? (
        <List
          component="nav"
          aria-label="amazon chime chat"
          sx={{ backgroundColor: "#ebebeb" }}
        >
          {channelList.map((channel) => {
            let channelName = channel.Name.split("-").find(
              (name) => name != username
            );
            return (
              <ListItemButton
                key={channel.ChannelArn}
                selected={channel.ChannelArn === activeChannel.ChannelArn}
                onClick={(e) => {
                  e.stopPropagation();
                  console.log("running ", channel);
                  channelIdChangeHandler(channel);
                }}
                sx={{
                  backgroundColor: "#fff",
                  padding: "10px",
                  borderRadius: "10px",
                  border: "#1px solid #52525b",
                  margin: "10px 0px",
                  "&.Mui-selected": {
                    backgroundColor: "#fff !important",
                  },
                }}
              >
                <ListItemAvatar>
                  <Avatar />
                </ListItemAvatar>
                <ListItemText primary={channelName} />
              </ListItemButton>
            );
          })}
        </List>
      ) : (
        <Typography>No chat found</Typography>
      )}
    </Box>
  );
}

export default ChannelWrappers;
