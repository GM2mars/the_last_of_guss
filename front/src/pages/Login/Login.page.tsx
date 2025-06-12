import React from "react";
import { useNavigate } from "react-router";

import { TopBar } from "@/components/TopBar";
import { useAuthActions, useAuthError, useAuthToken } from "@/states/Auth.state";

export const LoginPage = () => {
  const navigate = useNavigate();
  //AuthStore
  const { signIn, setUserName, setUserPassword } = useAuthActions();
  const token = useAuthToken();
  const error = useAuthError();

  console.log(useAuthActions());

  React.useEffect(() => {
    token && navigate('/rounds');
  }, [token]);


  return (
    <div className="container mx-auto p-10">
      <TopBar title="Войти" />
      <div className="flex flex-col items-center justify-center gap-6 mt-10">
        <fieldset className="fieldset">
          <legend className="fieldset-legend">{'Имя пользователя:'}</legend>
          <input type="text" className="input input-lg" onChange={(e) => setUserName(e.target.value)} />
        </fieldset>

        <fieldset className="fieldset">
          <legend className="fieldset-legend">{'Пароль:'}</legend>
          <input type="password" className="input input-lg" onChange={(e) => setUserPassword(e.target.value)} />
        </fieldset>

        {error && <p className="text-error">{error}</p>}

        <button className="btn btn-outline btn-primary btn-wide mt-10" onClick={signIn}>
          <span className="uppercase">{'Войти'}</span>
        </button>
      </div>

    </div>
  )
};
