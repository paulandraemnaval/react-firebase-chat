import React from "react";
import "./userInfo.css";
const userInfo = () => {
  return (
    <div className="userInfo">
      <div className="user">
        <img src="./avatar.png" alt="avatar"></img>
        <h2>Paul Naval</h2>
      </div>
      <div className="icons">
        <img src="./more.png" alt="dots_button" />
        <img src="./video.png" alt="video_button" />
        <img src="./edit.png" alt="edit_button" />
      </div>
    </div>
  );
};

export default userInfo;
