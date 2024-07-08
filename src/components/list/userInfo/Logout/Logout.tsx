import React from "react";
import "./Logout.css";
import { signOut } from "firebase/auth";
import { auth } from "../../../../lib/firebase";

interface Props {
  cancel: () => void;
  updater: () => void;
}
const ChangeUsername = ({ cancel }: Props) => {
  return (
    <div className="Logout">
      <h2>Logout?</h2>

      <button className="logout" onClick={() => signOut(auth)}>
        Logout
      </button>
      <button className="cancel" onClick={cancel}>
        Cancel
      </button>
    </div>
  );
};

export default ChangeUsername;