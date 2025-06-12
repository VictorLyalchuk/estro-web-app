import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Outlet, useNavigate } from "react-router-dom";
import { AuthReducerActionType, IAuthReducerState } from "../../store/accounts/AuthReducer";
import { refreshToken } from "../../services/accounts/account-services";
import { BagReducerActionType } from "../../store/bag/BagReducer";
import { FavoritesReducerActionType } from "../../store/favourites/FavoritesReducer";

const AdminLayout = () => {
  const { isAuth, user } = useSelector((redux: any) => redux.auth as IAuthReducerState);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [loading, setLoading] = useState<boolean>(false);
  const isAdmin = isAuth && user?.Role === "Administrator";

  useEffect(() => {
    const handleAuth = async () => {
      try {
        await refreshToken();
        if (!isAuth) navigate("/auth");
        if (isAuth) {
          if (user?.Role != "Administrator") {
            navigate("/404")
          }
        }
      } catch {
        localStorage.removeItem("token");
        dispatch({
          type: AuthReducerActionType.LOGOUT_USER,
        });
        dispatch({
          type: BagReducerActionType.DELETE_BAG_ALL,
        });
        dispatch({
          type: FavoritesReducerActionType.DELETE_FAVORITES_ALL,
        });
        navigate("/auth");
      }
      finally {
        setLoading(true);
      }
    }
    handleAuth();
  }, [isAuth, user, navigate, dispatch]);

  return (
    loading ? (
      <>
        {isAdmin && <Outlet />}
      </>
    ) : (
      <>
      </>
    )
  );
};

export default AdminLayout;
