import React from "react";
import "./Detail.css";
import { auth } from "../../lib/firebase";
const Detail = () => {
  return (
    <div className="Detail">
      <div className="user">
        <img src="/avatar.png" alt="avatar" />
        <h2>john doe</h2>
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
            <img src="/arrowDown.png" alt="arrowdown" />
          </div>
          <div className="photos">
            <div className="photoItem">
              <div className="photoDetail">
                <img src="/img.png" alt="shared_photo" />
                <span>png_2024.png</span>
              </div>
              <img
                src="/download.png"
                alt="download"
                className="downloadIcon"
              />
            </div>
            <div className="photoItem">
              <div className="photoDetail">
                <img src="/img.png" alt="shared_photo" />
                <span>png_2024.png</span>
              </div>
              <img
                src="/download.png"
                alt="download"
                className="downloadIcon"
              />
            </div>
            <div className="photoItem">
              <div className="photoDetail">
                <img src="/img.png" alt="shared_photo" />
                <span>png_2024.png</span>
              </div>
              <img
                src="/download.png"
                alt="download"
                className="downloadIcon"
              />
            </div>
            <div className="photoItem">
              <div className="photoDetail">
                <img src="/img.png" alt="shared_photo" />
                <span>png_2024.png</span>
              </div>
              <img
                src="/download.png"
                alt="download"
                className="downloadIcon"
              />
            </div>
            <div className="photoItem">
              <div className="photoDetail">
                <img src="/img.png" alt="shared_photo" />
                <span>png_2024.png</span>
              </div>
              <img
                src="/download.png"
                alt="download"
                className="downloadIcon"
              />
            </div>
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
