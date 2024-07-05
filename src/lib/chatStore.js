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
    const currentUser = useUserStore.getState().currentUser;
    if (user.blocked.includes(currentUser.uid)) {
      return set({
        chatID,
        user: null,
        isCurrentUserBlocked: true,
        isRecieverBlocked: false,
      });
    } else if (currentUser.blocked.includes(user.uid)) {
      return set({
        chatID,
        user: user,
        isCurrentUserBlocked: false,
        isRecieverBlocked: true,
      });
    } else {
      return set({
        chatID,
        user,
        isCurrentUserBlocked: false,
        isRecieverBlocked: false,
      });
    }
  },
  changeBlock: () => {
    set((state) => ({ ...state, isRecieverBlocked: !state.isRecieverBlocked }));
  },
}));
