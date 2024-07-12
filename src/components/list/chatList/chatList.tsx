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
    id: string;
    avatar: string;
    username: string;
    blocked: [];
  };
  lastChat: string;
  lastMessageTime: number;
  receiverID: string;
  img: [string, string];
}

const chatList = () => {
  const [isAdding, setIsAdding] = React.useState(false);
  const [chats, setChats] = React.useState([]);
  const { currentUser } = useUserStore();
  const { chatID, changeChat, isRecieverBlocked, isCurrentUserBlocked } =
    useChatStore();
  const [latestSender, setLatestSender] = React.useState("");

  React.useEffect(() => {
    const onSub = onSnapshot(
      doc(db, "userchats", currentUser.id), //get the userchats of the currentUser

      async (response) => {
        // after getting the userChats of the currentUser, execute this callback

        const data: DocumentData = response.data()?.chats; // this is the object {chatID, isSeen, lastChat, lastMessageTime, receiverID} of the currentUser.
        //Reciever ID is the ID of the user that the currentUser is chatting with

        const promises = data.map(async (chat) => {
          //this loops through chats of the currentUser

          const userDocumnentRef = doc(db, "users", chat.recieverID);
          const userDocumnentSnap = await getDoc(userDocumnentRef);
          const user = userDocumnentSnap.data(); //get the user data of the recepient

          return { ...chat, user }; // get the chat data with recepient user appended to it as an object
        });
        const chatData: any = await Promise.all(promises); //this is now the array of chat data of the same structure as the interface above
        setChats(
          chatData.sort((a, b) => b.lastMessageTime - a.lastMessageTime) // set chats as the recievers of the currentUser sorted by lastMessageTime. Structure is the same as interface
        );

        const chatRef = doc(db, "chats", chatID);
        const chatSnap = await getDoc(chatRef);

        const latestSender =
          chatSnap.data()?.messages[chatSnap.data()!.messages.length - 1]
            .sender;
        setLatestSender(latestSender);
      }
    );

    return () => onSub();
  }, [currentUser.id]);

  const handleSelectChat = async (chat) => {
    //chat here is the chats in the useState with the structure of {chatID, isSeen, user: {avatar, username}, lastChat, lastMessageTime, receiverID}
    const userChats = chats.map((c) => {
      const { user, ...rest } = c as chat;
      return rest; // assign userChats as the chats without the user object
    });

    const chatIndex = userChats.findIndex((c) => c.chatID === chat.chatID); //find the index of the chat that was clicked on in the userChats array
    userChats[chatIndex].isSeen = true; //set the isSeen property of the chat that was clicked on to true

    try {
      //self explanatory
      await updateDoc(doc(db, "userchats", currentUser.id), {
        chats: userChats,
      });
      changeChat(chat.chatID, chat.user); // user is the recepient here
    } catch (err) {
      console.log(err);
    }
  };

  const handleDisplayMessage = (chat) => {
    if (currentUser.blocked.includes(chat.user.id)) return "User is blocked";
    else if (chat.lastChat === "" && chat.isLatestImage) {
      if (latestSender === currentUser.id) return "You sent an image";
      else return `${chat.user.username} sent an image`;
    } else if (chat.lastChat === "" && !chat.isLatestImage)
      return "No message yet";
    else return chat.lastChat;
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
        (
          chat: chat //chat is an object that has the recepient user and the chat data
        ) => (
          <div
            className="item"
            key={chat.chatID}
            onClick={() => {
              handleSelectChat(chat);
            }}
            style={{
              backgroundColor: chat.isSeen
                ? "transparent"
                : currentUser.blocked.includes(chat.user.id)
                ? "transparent"
                : "#5183fe",
            }}
          >
            <img
              src={
                currentUser.blocked.includes(chat.user.id)
                  ? "/avatar.png"
                  : chat.user.avatar
              }
              alt="avatar"
            />
            <div className="texts">
              <span>
                {currentUser.blocked.includes(chat.user.id)
                  ? "User"
                  : chat.user.username}
              </span>
              <p
                style={{
                  color: chat.isSeen
                    ? "rgba(127, 139, 141, 0.911)"
                    : currentUser.blocked.includes(chat.user.id)
                    ? "rgba(127, 139, 141, 0.911)"
                    : "white",
                }}
              >
                {handleDisplayMessage(chat)}
              </p>
            </div>
          </div>
        )
      )}
      {isAdding && <AddUser closeFunc={() => setIsAdding(false)} />}
    </div>
  );
};
export default chatList;
