import { useEffect } from "react";
import { useSelector } from "react-redux";
import { Outlet, useNavigate } from "react-router-dom";
import { IAuthReducerState } from "../../store/accounts/AuthReducer";


const UserLayout = () => {
  const { isAuth, user } = useSelector((redux: any) => redux.auth as IAuthReducerState);

  const navigate = useNavigate();

  const isUser = isAuth && user?.Role === "User" || user?.Role === "Administrator";
  useEffect(() => {
    if (!isAuth) navigate("/auth");
    if (isAuth) {
      if (!isUser) {
        navigate("/404")
      }
    }
  }, [isAuth, user]);

  return (
    <>
      {isUser && <Outlet />}
    </>
  );
};

export default UserLayout;