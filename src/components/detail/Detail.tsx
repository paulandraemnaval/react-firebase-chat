import React from "react";
import "./Detail.css";
import { auth } from "../../lib/firebase";
import { useUserStore } from "../../lib/userStore";
import { useChatStore } from "../../lib/chatStore";
import userInfo from "../list/userInfo/userInfo";
const Detail = () => {
  const { user } = useChatStore();

  return (
    <div className="Detail">
      <div className="user">
        <img src={user.avatar} alt="avatar" />
        <h2>{user.username}</h2>
        <p>user description goes here</p>
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
            <img src="/arrowUp.png" alt="arrowdown" />
          </div>
        </div>
        <div className="option">
          <div className="title">
            <span>Shared Files</span>
            <img src="/arrowUp.png" alt="" />
          </div>
        </div>
        <button>Block User</button>
        <button
          className="logoutButton"
          onClick={() => {
            auth.signOut();
          }}
        >
          Log out
        </button>
      </div>
    </div>
  );
};

export default Detail;
