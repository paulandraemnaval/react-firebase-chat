import { create } from "zustand";
import { db } from "./firebase";
import { doc, getDoc } from "firebase/firestore";
import { useUserStore } from "./userStore";
export const useChatStore = create((set) => ({
  chatID: null,
  user: null,
  isCurrentUserBlocked: false,
  isRecieverBlocked: false,

  changeChat: (chatID, user) => {
    console.log("changeChat: Recipient->", user);
    const currentUser = useUserStore.getState().currentUser;
    if (user.blocked.includes(currentUser.id)) {
      console.log("current user is blocked by reciever");
      set({
        chatID,
        user,
        isCurrentUserBlocked: true,
        isRecieverBlocked: false,
      });
    }
    if (currentUser.blocked.includes(user.id)) {
      console.log("reciever is blocked by current user");
      set({
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
  changeBlock: () => {
    set((state) => ({
      ...state,
      isRecieverBlocked: !state.isRecieverBlocked,
    }));
  },
}));
