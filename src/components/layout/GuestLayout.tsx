import { useEffect } from "react";
import { useSelector } from "react-redux";
import { Outlet, useNavigate } from "react-router-dom";
import { IAuthReducerState } from "../../store/accounts/AuthReducer";


const GuestLayout = () => {
  const { isAuth } = useSelector((redux: any) => redux.auth as IAuthReducerState);

  const navigate = useNavigate();

  useEffect(() => {
    if (isAuth) navigate("/", { replace: true });
  }, [isAuth, navigate]);

  return (
    <>
      {!isAuth && <Outlet />}
    </>
  );
};

export default GuestLayout;