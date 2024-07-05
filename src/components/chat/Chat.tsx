import React from "react";
import "./Chat.css";
import EmojiPicker from "emoji-picker-react";
import { db } from "../../lib/firebase";
import {
  arrayUnion,
  collection,
  doc,
  getDoc,
  onSnapshot,
  updateDoc,
} from "firebase/firestore";
import { useChatStore } from "../../lib/chatStore";
import { useUserStore } from "../../lib/userStore";
const Chat = () => {
  const [showEmoji, setShowEmoji] = React.useState(false);
  const [message, setMessage] = React.useState("");
  const [chat, setChat] = React.useState();
  const endRef = React.useRef(null);
  const { chatID, changeChat, user } = useChatStore();
  const { currentUser } = useUserStore();

  React.useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, []);

  React.useEffect(() => {
    const unSub = onSnapshot(doc(db, "chats", chatID), (snap) => {
      setChat(snap.data());
    });
    return () => unSub();
  }, [chatID]);
  const handleEmojiClick = (event) => {
    setMessage(message + event.emoji);
  };

  const handleSend = async () => {
    if (message === "") return;
    try {
      const chatCollectionRef = collection(db, "chats");
      const messageRef = doc(chatCollectionRef, chatID);
      await updateDoc(messageRef, {
        messages: arrayUnion({
          message: message,
          sender: currentUser.id,
          time: Date.now(),
        }),
      });

      const userIDs = [user.id, currentUser.id];

      userIDs.forEach(async (id) => {
        const userChatRef = doc(db, "userchats", id);
        const userChatSnap = await getDoc(userChatRef);

        if (userChatSnap.exists()) {
          const userChatData = userChatSnap.data();
          const userIndex = userChatData.chats.findIndex(
            (chat) => chat.chatID === chatID
          );

          userChatData.chats[userIndex].lastChat = message;
          userChatData.chats[userIndex].lastMessageTime = Date.now();
          userChatData.chats[userIndex].isSeen =
            id === currentUser.id ? true : false;

          await updateDoc(userChatRef, {
            chats: userChatData.chats,
          });
        }
      });
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className="chat">
      <div className="top">
        <div className="user">
          <img src={user.avatar} alt="userImage" />
          <div className="texts">
            <span>{user.username}</span>
            <p>User description goes here</p>
          </div>
        </div>
        <div className="icons">
          <img src="/phone.png" alt="phone" />
          <img src="/video.png" alt="video" />
          <img src="/info.png" alt="more" />
        </div>
      </div>
      <div className="center">
        {chat?.messages.map((message) => (
          <div
            className={
              message.sender === currentUser.id ? "message own" : "message"
            }
            key={message.lastMessageTime}
          >
            <div className="texts">
              <p>{message.message}</p>
              {/* <span>1 min ago</span> */}
            </div>
          </div>
        ))}
        <div ref={endRef}></div>
      </div>

      <div className="bottom">
        <div className="icons">
          <img src="/img.png" alt="img" />
          <img src="/camera.png" alt="" />
          <img src="mic.png" alt="" />
        </div>
        <input
          type="text"
          placeholder="Type a message"
          className="messageInput"
          onChange={(event) => {
            setMessage(event.target.value);
          }}
          value={message}
        />
        <div className="emoji">
          <img
            src="/emoji.png"
            alt=""
            onClick={() => setShowEmoji(!showEmoji)}
          />
          <div className="emojipicker">
            <EmojiPicker open={showEmoji} onEmojiClick={handleEmojiClick} />
          </div>
        </div>
        <button className="send" onClick={handleSend}>
          Send
        </button>
      </div>
    </div>
  );
};

export default Chat;
