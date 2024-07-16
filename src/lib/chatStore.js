import { create } from "zustand";
import { useUserStore } from "./userStore";

export const useChatStore = create((set) => ({
  //Private chat
  chatID: null,
  user: null,
  isCurrentUserBlocked: false,
  isRecieverBlocked: false,

  //Groupchat
  users: [],
  isGroupChat: false,
  groupChat: null,

  changeChat: (chatID, user) => {
    const currentUser = useUserStore.getState().currentUser;
    if (user.blocked.includes(currentUser.id)) {
      return set({
        isGroupChat: false,
        chatID,
        user,
        isCurrentUserBlocked: true,
        isRecieverBlocked: false,
      });
    } else if (currentUser.blocked.includes(user.id)) {
      return set({
        isGroupChat: false,
        chatID,
        user,
        isCurrentUserBlocked: false,
        isRecieverBlocked: true,
      });
    } else {
      console.log("no one is blocked");
      return set({
        isGroupChat: false,
        chatID,
        user,
        isCurrentUserBlocked: false,
        isRecieverBlocked: false,
      });
    }
  },

  resetChat: () => {
    set({
      chatID: null,
      user: null,
      isCurrentUserBlocked: false,
      isRecieverBlocked: false,
    });
  },

  changeBlock: () => {
    set((state) => ({
      ...state,
      isRecieverBlocked: !state.isRecieverBlocked,
    }));
  },

  changeGroupChat: (groupChat, groupchatID, users) => {
    set({
      isGroupChat: true,
      chatID: groupchatID,
      users,
      groupChat,
    });
  },
}));
