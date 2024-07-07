import React from "react";
import "./Chat.css";
import EmojiPicker from "emoji-picker-react";
import { db } from "../../lib/firebase";
import {
  arrayUnion,
  collection,
  doc,
  DocumentData,
  getDoc,
  onSnapshot,
  updateDoc,
} from "firebase/firestore";
import { useChatStore } from "../../lib/chatStore";
import { useUserStore } from "../../lib/userStore";
import upload from "../../lib/upload";
import { set } from "firebase/database";

interface image {
  file: null;
  imageURL: string;
}
const Chat = () => {
  const [showEmoji, setShowEmoji] = React.useState(false);
  const [message, setMessage] = React.useState("");
  const [chat, setChat] = React.useState<DocumentData>();
  const [image, setImage] = React.useState<image>({ file: null, imageURL: "" });
  const endRef = React.useRef<HTMLDivElement>(null);
  const { chatID, user, isRecieverBlocked } = useChatStore();
  const { currentUser } = useUserStore();

  React.useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chat?.messages]); //chat.messages is the dependency here because we want to scroll to the end of the chat after all messages are loaded

  React.useEffect(() => {
    const unSub = onSnapshot(doc(db, "chats", chatID), (snap) => {
      setChat(snap.data());
      console.log(chat);
    });
    return () => unSub();
  }, [chatID]); //this useEffect listens to changes in the chatID and fetches the chat data from the database.

  const handleEmojiClick = (event) => {
    setMessage(message + event.emoji);
  };

  const handleSend = async () => {
    if (message === "" && !image.file) return;
    try {
      let imageURL: [string, string] | null = null;
      if (image?.file) {
        imageURL = await upload(image.file);
      }

      const [firebaseImgURL, fileNameInDatabase] = imageURL ?? ["", ""];

      const chatCollectionRef = collection(db, "chats");
      const messageRef = doc(chatCollectionRef, chatID);
      await updateDoc(messageRef, {
        messages: arrayUnion({
          message: message,
          sender: currentUser.id,
          time: Date(),
          ...(image.imageURL && {
            img: firebaseImgURL,
            filename: fileNameInDatabase,
          }),
        }),
      }); // reference and update the chats collection with the new message

      const userIDs = [user.id, currentUser.id];

      // this function updates users on both ends' userchats with the new message
      userIDs.forEach(async (id) => {
        const userChatRef = doc(db, "userchats", id);
        const userChatSnap = await getDoc(userChatRef);

        if (userChatSnap.exists()) {
          const userChatData = userChatSnap.data(); // get the userchat data of the recepient or currentUser
          const userIndex = userChatData.chats.findIndex(
            (chat) => chat.chatID === chatID //find their chatID from userChats
          );

          //make necessary changes
          userChatData.chats[userIndex].lastChat = message;
          userChatData.chats[userIndex].lastMessageTime = Date.now();
          userChatData.chats[userIndex].isSeen =
            id === currentUser.id ? true : false;

          await updateDoc(userChatRef, {
            chats: userChatData.chats,
          });
        }
      });

      setMessage("");
      setImage({ file: null, imageURL: "" });
    } catch (err) {
      console.log(err);
    }
  };

  const handleImage = (event) => {
    event.preventDefault();
    const file = event.target.files[0];
    if (file) {
      setImage({
        file: file,
        imageURL: URL.createObjectURL(file),
      });
      console.log(image);
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
        {isRecieverBlocked ? (
          <div className="blocked">
            <p>You have blocked this user</p>
          </div>
        ) : (
          chat?.messages.map((message) => (
            <div
              className={
                message.sender === currentUser.id ? "message own" : "message"
              }
              key={message.lastMessageTime}
            >
              <div className="texts">
                {message.img && <img src={message.img} alt="img" />}
                {message.message && <p>{message.message}</p>}
                {/* <span>1 min ago</span> */}
              </div>
            </div>
          ))
        )}

        <div ref={endRef}></div>
      </div>

      <div
        className="bottom"
        style={{
          display: isRecieverBlocked ? "none" : "flex",
        }}
      >
        {image.file && (
          <div className="selected-image">
            <div className="cancel">
              <img
                src="/icons8-multiply-100.png"
                alt="cancel"
                onClick={() =>
                  setImage({
                    file: null,
                    imageURL: "",
                  })
                }
              />
            </div>
            <div className="texts">
              <img src={image.imageURL} alt="sent_image" />
            </div>
          </div>
        )}
        <div className="message-controls">
          <div className="icons">
            <label htmlFor="file">
              <img src="/img.png" alt="img" />
            </label>
            <input
              type="file"
              id="file"
              onChange={handleImage}
              style={{ display: "none" }}
            />
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
            onKeyDown={(event) => {
              event.key === "Enter" && handleSend();
            }}
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
    </div>
  );
};

export default Chat;
