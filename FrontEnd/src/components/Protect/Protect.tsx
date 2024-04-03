// components/ProtectedRoute.tsx
import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { useAuthStore } from "@/stores/userStore";
import { useShallow } from "zustand/react/shallow";
import { getCookie } from "@/util/auth/userCookie";

// 로그인 필요 체크용 프로텍트라우터
const Protected = () => {
  const { setIsLogin } = useAuthStore(
    useShallow((state) => ({
      setIsLogin: state.setIsLogin,
    }))
  );

  const { pathname } = useLocation();

  useEffect(() => {
    const accessToken = getCookie();
    window.scrollTo(0, 0);
    if (accessToken != undefined) {
      setIsLogin(true);
    } else {
      setIsLogin(false);
    }
  }, [pathname]);

  return <></>;
};

export default Protected;
