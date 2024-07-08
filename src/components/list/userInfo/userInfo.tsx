import React from "react";
import "./userInfo.css";
import { useUserStore } from "../../../lib/userStore";
import ChangeUsername from "./changeUsername/changeUsername";
import ChangeDescription from "./changeDescription/changeDescription";
import Logout from "./Logout/Logout";
const userInfo = () => {
  const { currentUser } = useUserStore();
  const [isChangingUsername, setIsChangingUsername] = React.useState(false);
  const [isChangingDescription, setIsChangingDescription] =
    React.useState(false);
  const [isLoggingOut, setIsLoggingOut] = React.useState(false);
  const [updater, setUpdater] = React.useState(false);

  const handleMenuClick = (menu: string) => {
    if (menu === "changeUsername") {
      setIsLoggingOut(false);
      setIsChangingDescription(false);
      setIsChangingUsername(true);
    }
    if (menu === "changeDescription") {
      setIsChangingDescription(true);
      setIsLoggingOut(false);
      setIsChangingUsername(false);
    }
    if (menu === "Logout") {
      setIsLoggingOut(true);
      setIsChangingDescription(false);
      setIsChangingUsername(false);
    }
    document.querySelector("details")!.open = false;
  };

  return (
    <div className="userInfo">
      <div className="user">
        <img src={currentUser.avatar || "/avatar.png"} alt="avatar"></img>
        <div className="usertext">
          <h2>{currentUser.username}</h2>
          {currentUser.description && <p>{currentUser.description}</p>}
        </div>
      </div>
      <div className="icons">
        <details>
          <summary>
            <img src="./more.png" alt="dots_button" />
          </summary>
          <ul>
            <li onClick={() => handleMenuClick("changeUsername")}>
              Change Username
            </li>
            <li onClick={() => handleMenuClick("changeDescription")}>
              Change User Description
            </li>
            <li onClick={() => handleMenuClick("Logout")} className="logout">
              Logout
            </li>
          </ul>
        </details>
        <img src="./edit.png" alt="edit_button" />
      </div>
      {isChangingUsername && (
        <ChangeUsername
          cancel={() => setIsChangingUsername(false)}
          updater={() => setUpdater(!updater)}
        />
      )}
      {isChangingDescription && (
        <ChangeDescription cancel={() => setIsChangingDescription(false)} />
      )}
      {isLoggingOut && (
        <Logout
          cancel={() => setIsLoggingOut(false)}
          updater={() => setUpdater(!updater)}
        />
      )}
    </div>
  );
};

export default userInfo;
