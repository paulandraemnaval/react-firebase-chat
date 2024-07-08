import React from "react";
import "./Detail.css";
import { auth, db } from "../../lib/firebase";
import { useUserStore } from "../../lib/userStore";
import { useChatStore } from "../../lib/chatStore";
import userInfo from "../list/userInfo/userInfo";
import { arrayRemove, getDoc, updateDoc } from "firebase/firestore";
import { arrayUnion, doc } from "firebase/firestore";
import { download } from "../../lib/download";
interface Message {
  img?: string;
  message: string;
  senderID: string;
  time: number;
  filename?: string;
}

const Detail = () => {
  type imageTuple = [string, string];
  const { user, changeBlock, isRecieverBlocked } = useChatStore();
  const { currentUser } = useUserStore();
  const [images, setImages] = React.useState<imageTuple[]>([]);
  const [showingImages, setShowingImages] = React.useState(false);
  const handleBlock = async () => {
    if (!user) return;
    try {
      const userRef = doc(db, "users", currentUser.id);
      await updateDoc(userRef, {
        blocked: isRecieverBlocked ? arrayRemove(user.id) : arrayUnion(user.id),
      });
      changeBlock();
    } catch (err) {
      console.log(err);
    }
  };

  const handleImages = async () => {
    try {
      const currentChatSnap = await getDoc(
        doc(db, "userchats", currentUser.id) // userchats of current user
      );

      const userchats = currentChatSnap.data()?.chats; // this is the index of the chat of the current user with currently open chat's user
      const chatIndex = userchats.findIndex((userChat) => {
        return userChat.recieverID === user?.id;
      });

      const chatID = userchats[chatIndex].chatID; // this is the chatID of the chat of the current user with currently open chat's user

      const convo = await getDoc(doc(db, "chats", chatID));
      convo.data()?.messages.forEach((message: Message) => {
        if (message.img) {
          setImages((prev) => [
            ...prev,
            [message.img!, message.filename || ""],
          ]);
        }
      });
    } catch (err) {
      console.log(err);
    }
  };
  return (
    <div className="Detail">
      <div className="user">
        <img src={user?.avatar || "/avatar.png"} alt="avatar" />
        <h2>{user?.username || "User"}</h2>
        <p>{user?.description || ""}</p>
      </div>
      <div className="info">
        <div className="option">
          <div className="title">
            <span>Chat Settings</span>
            <img src="/arrowUp.png" alt="arrowup" />
          </div>
        </div>
        <div className="option">
          <div className="title">
            <span>Privacy & Help</span>
            <img src="/arrowUp.png" alt="" />
          </div>
        </div>
        <div className="option">
          <div className="title">
            <span>Shared Photos</span>
            <img
              src={showingImages ? "/arrowUp.png" : "/arrowDown.png"}
              alt="arrowdown"
              onClick={() => {
                if (!showingImages) setImages([]);
                setShowingImages(!showingImages);
                handleImages();
              }}
            />
          </div>

          {showingImages &&
            images.map((img, index) => (
              <div className="photos">
                <div className="photoItem" key={`photo_${index}`}>
                  <div className="photoDetail">
                    <img src={img[0]} alt="image_sent" />
                  </div>

                  <img
                    src="/download.png"
                    alt="download"
                    className="downloadIcon"
                    onClick={() => {
                      download(img[0], img[1]);
                    }}
                  />
                </div>
              </div>
            ))}
        </div>
        <div className="option">
          <div className="title">
            <span>Shared Files</span>
            <img src="/arrowUp.png" alt="" />
          </div>
        </div>

        <div className="blockdiv">
          <button onClick={handleBlock}>
            {isRecieverBlocked ? "Unblock" : "Block"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Detail;
