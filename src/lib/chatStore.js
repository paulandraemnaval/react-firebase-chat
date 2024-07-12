import { create } from "zustand";
import { useUserStore } from "./userStore";

export const useChatStore = create((set) => ({
  chatID: null,
  user: null,
  isCurrentUserBlocked: false,
  isRecieverBlocked: false,

  changeChat: (chatID, user) => {
    const currentUser = useUserStore.getState().currentUser;
    if (user.blocked.includes(currentUser.id)) {
      return set({
        chatID,
        user,
        isCurrentUserBlocked: true,
        isRecieverBlocked: false,
      });
    } else if (currentUser.blocked.includes(user.id)) {
      return set({
        chatID,
        user,
        isCurrentUserBlocked: false,
        isRecieverBlocked: true,
      });
    } else {
      console.log("no one is blocked");
      return set({
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
}));
