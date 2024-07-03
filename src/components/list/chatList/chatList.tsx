import React from "react";
import "./chatList.css";

const chatList = () => {
  const [isAdding, setIsAdding] = React.useState(false);
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
      <div className="item">
        <img src="/avatar.png" alt="avatar" />
        <div className="texts">
          <span>Bea Ramirez</span>
          <p>Hello</p>
        </div>
      </div>
      <div className="item">
        <img src="/avatar.png" alt="avatar" />
        <div className="texts">
          <span>Bea Ramirez</span>
          <p>Hello</p>
        </div>
      </div>
      <div className="item">
        <img src="/avatar.png" alt="avatar" />
        <div className="texts">
          <span>Bea Ramirez</span>
          <p>Hello</p>
        </div>
      </div>
    </div>
  );
};

export default chatList;
