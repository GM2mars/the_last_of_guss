import React from "react";
import { Link } from "react-router";

import { useAuthActions, useAuthToken } from "@/states/Auth.state";

interface TopBarProps {
  title: string;
  hasBack?: boolean;
}

export const TopBar = ({ title, hasBack }: TopBarProps) => {
  //AuthStore
  const token = useAuthToken();
  const { signOut, getUserName } = useAuthActions();
  const [username, setUsername] = React.useState("");

  const logoutHandler = () => {
    signOut();
  };

  React.useEffect(() => {
    token && setUsername(getUserName());
  }, [token]);

  return (
    <div className="w-full bg-base-200 p-2 flex justify-between items-center">
      {hasBack ? <Link to="/rounds">{'<- Back'}</Link> : <div />}

      <h1 className="text-xl">{title}</h1>

      {username
        ? (
          <div className="dropdown dropdown-end">
            <div tabIndex={0} role="button" className="btn m-1 btn-ghost">{username}</div>
            <ul tabIndex={0} className="dropdown-content menu bg-base-100 rounded-box z-1 w-52 p-2 shadow-sm">
              <li><a onClick={logoutHandler}>{'Sign out'}</a></li>
            </ul>
          </div>
        )
        : <div />
      }
    </div>
  )
};
