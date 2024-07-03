import React from "react";
import "./Chat.css";
import EmojiPicker from "emoji-picker-react";
const Chat = () => {
  const [showEmoji, setShowEmoji] = React.useState(false);
  const [message, setMessage] = React.useState("");

  const handleEmojiClick = (event) => {
    setMessage(message + event.emoji);
  };
  console.log(message);
  return (
    <div className="chat">
      <div className="top">
        <div className="user">
          <img src="/avatar.png" alt="userImage" />
          <div className="texts">
            <span>Bea Ramirez</span>
            <p>User description goes here</p>
          </div>
        </div>
        <div className="icons">
          <img src="/phone.png" alt="phone" />
          <img src="/video.png" alt="video" />
          <img src="/info.png" alt="more" />
        </div>
      </div>
      <div className="center"></div>
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
          onChange={(event) => setMessage(event.target.value)}
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
        <button className="send">Send</button>
      </div>
    </div>
  );
};

export default Chat;