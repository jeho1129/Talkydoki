import { customAxios } from "../util/auth/customAxios";
import {
  EmailVerifyPayload,
  LoginParams,
  SignupParams,
  SocialLoginPayload,
} from "../interface/AuthInterface";
import {
  QueryFilters,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import {
  useAuthStore,
  useEmailVerifyActions,
  useIsLogin,
  useSetIsLogin,
  useSetMemberEmail,
} from "@/stores/userStore";

import { UserInterface } from "@/interface/UserInterface";
import { useSetSignupErrors } from "@/stores/signUpStore";
import { useSetISModalOn, useSetModalContent } from "@/stores/modalStore";
import { Cookies } from "react-cookie";

// 일반 로그인
export const useLogin = () => {
  const navigate = useNavigate();
  const setIsLogin = useAuthStore((state) => state.setIsLogin);
  // 로그인시 되는지 전역 확인용 후에 삭제 예정
  const setMemberEmail = useSetMemberEmail();
  const queryClient = useQueryClient();

  const setModalContent = useSetModalContent();
  const setIsModalOn = useSetISModalOn();

  return useMutation({
    mutationFn: (payload: LoginParams) =>
      customAxios.post(`/member/login`, payload),

    onSuccess: (res) => {
      const { data } = res;
      if (data.dataHeader.successCode === 0) {
        // 로그인 후 반환된 email memberEmail에 저장
        setMemberEmail(data.dataBody.memberInfo.email);

        // 로그인 후 return 받은 데이터 getMember 쿼리에 저장
        queryClient.setQueryData(["getMember"], data);
        setIsLogin(true);
        navigate(`/`);
      } else {
        setModalContent({
          message: data.dataHeader.resultMessage,
          isInfo: true,
        });
        setIsModalOn(true);
      }
    },

    onError: (err) => console.error(err),
  });
};

// 일반 회원가입
export const useSignup = () => {
  const { setEmailVerifyStatus } = useEmailVerifyActions();
  const navigate = useNavigate();
  const setErrors = useSetSignupErrors();

  return useMutation({
    mutationFn: (payload: SignupParams) =>
      customAxios.post(`/member/signup`, payload),

    onSuccess: (res) => {
      const { data } = res;
      if (data.dataHeader.successCode === 0) {
        // 성공했을 때 로직 처리
        setEmailVerifyStatus("none");
        navigate("/login");
      } else {
        if (data.dataHeader.resultCode) {
          setErrors(data.dataHeader.resultMessage);
        } else {
          setErrors({ emailError: "이미 가입되어 있는 이메일입니다." });
        }
      }
    },
    //실패 메세지 추가필요
    onError: (err) => console.error(err),
  });
};

// 회원정보 가져오기
export const useGetMember = () => {
  const isLogin = useIsLogin();

  return useQuery({
    queryKey: ["getMember"],
    queryFn: () => {
      return customAxios.get(`/member/get`).then((res) => res.data);
    },
    select: (data) => {
      // get 성공 시 data.dataBody를 getMember로 쿼리에 저장
      if (data.dataHeader.successCode == 0) {
        if (data.dataBody.memberInfo) {
          return data.dataBody.memberInfo as UserInterface;
        } else {
          return data.dataBody as UserInterface;
        }
      } else {
        return null;
      }
    },
    enabled: isLogin, // 로그인 시에만 동작
    staleTime: Infinity, // 유저 정보 새로 가져오는 타이밍 (현재 무기한 연기)
    gcTime: Infinity,
  });
};

// 로그아웃 구현하기
export const useLogout = () => {
  const navigate = useNavigate();
  const setIsLogin = useSetIsLogin();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => customAxios.post(`/member/logout`),

    onSuccess: () => {
      const cookies = new Cookies();
      cookies.remove("accessToken");
      queryClient.removeQueries(["getMember"] as QueryFilters);
      setIsLogin(false);
      setTimeout(() => {
        navigate("/intro");
      }, 0);
    },
    onError: () => {
      const cookies = new Cookies();
      cookies.remove("accessToken");
      queryClient.removeQueries(["getMember"] as QueryFilters);
      setIsLogin(false);
      setTimeout(() => {
        navigate("/intro");
      }, 0);
    },
  });
};

// 소셜 로그인 창 띄우기

export const useSocialLogin = () => {
  return useMutation({
    mutationFn: (payload: string) => customAxios.get(`/oauth/${payload}`),
    onSuccess: (res) => {
      const { data } = res;
      if (data.dataHeader.successCode === 0) {
        window.location.href = data.dataBody;
      } else {
        alert(data.dataHeader.resultMessage);
      }
    },
    onError: (err) => console.error(err),
  });
};

// 소셜 로그인

export const useFinishSocialLogin = () => {
  const setIsLogin = useAuthStore((state) => state.setIsLogin);
  const navigate = useNavigate();

  return useMutation({
    mutationFn: (payload: SocialLoginPayload) =>
      customAxios.get(`/oauth/${payload.provider}/login`, {
        params: { code: payload.code },
      }),
    onSuccess: (res) => {
      const { data } = res;
      if (data.dataHeader.successCode === 0) {
        setIsLogin(true);
        navigate("/main");
      } else {
        alert(data.dataHeader.resultMessage);
      }
    },
    onError: (err) => console.error(err),
  });
};

// 회원탈퇴
export const useDeleteAccount = () => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const { mutate: logout } = useLogout();
  const setIsModalOn = useSetISModalOn();

  return useMutation({
    mutationFn: () => customAxios.delete("/member/delete"),
    onSuccess: ({ data }) => {
      if (data.dataHeader.successCode == 0) {
        logout();
        // 관련된 쿼리 제거
        queryClient.clear();
        navigate("/intro");
        setIsModalOn(false);
      }
    },
  });
};

// 이메일인증

export const useEmailSend = () => {
  const { setSendEmailVerifyMessage } = useEmailVerifyActions();
  return useMutation({
    mutationFn: (payload: string) => customAxios.post(`/email/send/${payload}`),
    onSuccess: (res) => {
      if (res.data.dataHeader.successCode === 0) {
        setSendEmailVerifyMessage("인증번호 발송 성공");
      } else if (res.data.dataHeader.successCode === 1) {
        setSendEmailVerifyMessage("유효하지 않은 이메일 주소입니다.");
      }
    },
    onError: (err) => {
      console.log(err);
      setSendEmailVerifyMessage("오류가 발생했습니다.");
    },
  });
};

export const useEmailVerify = () => {
  const { setEmailVerifyMessage, setEmailVerifyStatus } =
    useEmailVerifyActions();

  return useMutation({
    mutationFn: (payload: EmailVerifyPayload) =>
      customAxios.post(`email/verify/${payload.email}/${payload.code}`),
    onSuccess: (res) => {
      if (res.data.dataHeader.successCode === 0) {
        setEmailVerifyStatus("success");
        setEmailVerifyMessage("이메일 인증에 성공했습니다.");
      } else if (res.data.dataHeader.successCode === 1) {
        setEmailVerifyStatus("error");
        setEmailVerifyMessage("이메일 인증코드를 잘못 입력하였습니다.");
      }
    },
    onError: () => {
      setEmailVerifyStatus("error");
      setEmailVerifyMessage("인증 과정 중 오류가 발생했습니다.");
    },
  });
};
