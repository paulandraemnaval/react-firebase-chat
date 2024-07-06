import React from "react";
import "./chatList.css";
import AddUser from "./addUser/addUser";
import { useUserStore } from "../../../lib/userStore";
import { doc, getDoc, onSnapshot, updateDoc } from "firebase/firestore";
import { db } from "../../../lib/firebase";
import { useChatStore } from "../../../lib/chatStore";
import { DocumentData } from "firebase/firestore/lite";

interface chat {
  chatID: string;
  isSeen: boolean;
  user: {
    avatar: string;
    username: string;
  };
  lastChat: string;
  lastMessageTime: number;
  receiverID: string;
}

const chatList = () => {
  const [isAdding, setIsAdding] = React.useState(false);
  const [chats, setChats] = React.useState([]);
  const { currentUser } = useUserStore();
  const { chatID, changeChat } = useChatStore();

  console.log("chatList.tsx ->", chatID);

  React.useEffect(() => {
    const onSub = onSnapshot(
      doc(db, "userchats", currentUser.id),
      async (response) => {
        const data: DocumentData = response.data()?.chats;

        const promises = data.map(async (chat) => {
          const userDocumnentRef = doc(db, "users", chat.recieverID);
          const userDocumnentSnap = await getDoc(userDocumnentRef);

          const user = userDocumnentSnap.data();

          return { ...chat, user };
        });
        const chatData: any = await Promise.all(promises);
        setChats(
          chatData.sort((a, b) => b.lastMessageTime - a.lastMessageTime)
        );
      }
    );

    return () => onSub();
  }, [currentUser.id]);

  const handleSelectChat = async (chat) => {
    changeChat(chat.chatID, chat.user);
  };

  const handleSeen = async (chat: chat) => {
    try {
      const chatRef = await getDoc(doc(db, "userchats", currentUser.id));
      const chatData = chatRef.data()?.chats;
      const chatIndex = chatData.findIndex((c) => c.chatID === chat.chatID);
      chatData[chatIndex].isSeen = true;

      await updateDoc(doc(db, "userchats", currentUser.id), {
        chats: chatData,
      });
    } catch (err) {}
  };
  return (
    <div className="chatList">
      <div className="search">
        <div className="searchBar">
          <img src="/search.png " alt="search" />
          <input type="text" className="searchbarInput" placeholder="Search" />
        </div>
        <img
          src={isAdding ? "/minus.png" : "plus.png"}
          alt="add"
          className="add"
          onClick={() => setIsAdding(!isAdding)}
        />
      </div>
      {chats.map(
        (chat: chat) => (
          console.log("chatList.tsx ->", chat),
          (
            <div
              className="item"
              key={chat.chatID}
              onClick={() => {
                handleSelectChat(chat);
                handleSeen(chat);
              }}
              style={{
                backgroundColor: chat.isSeen ? "transparent" : "#5183fe",
              }}
            >
              <img src={chat.user.avatar} alt="avatar" />
              <div className="texts">
                <span>{chat.user.username}</span>
                <p
                  style={{
                    color: chat.isSeen
                      ? "rgba(127, 139, 141, 0.911)"
                      : "1white",
                  }}
                >
                  {chat.lastChat}
                </p>
              </div>
            </div>
          )
        )
      )}
      {isAdding && <AddUser />}
    </div>
  );
};

export default chatList;
