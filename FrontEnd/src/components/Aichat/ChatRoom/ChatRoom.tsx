import { useEffect, useState } from "react";
import { useLocation, useParams } from "react-router-dom";
import ChatHeader from "./ChatHeader";
import ChatMain from "./ChatMain";
import ChatFooter from "./ChatFooter";
import ChatTip from "./ChatTip";
import { ChatRoomContainer, FooterContainer } from "@/styles/Aichat/AiChatRoom";
import { useSpeechRecognition } from "react-speech-recognition";
// 환경변수에서 웹소켓 서버의 URL을 가져옵니다.

// 예시 붙이는용
const { VITE_REACT_WS_URL } = import.meta.env;
import { Client, Frame } from "webstomp-client";
import { getCookie } from "@/util/auth/userCookie";

import {
  connectStompClient,
  getStompClient,
} from "@/util/websocket/stompConnection";

export type ChatMessage = {
  sender: "USER" | "GPT" | "USER_TIP";
  japanese: string;
  korean?: string | null;
};
function ChatRoom() {
  const { state } = useLocation();
  const { roomId } = state;
  const { catagory } = useParams<{ catagory: string | undefined }>();

  const [chats, setChats] = useState<ChatMessage[]>([]);
  const [lastUserTip, setLastUserTip] = useState<ChatMessage | null>(null);
  // 추가
  const { transcript, resetTranscript } = useSpeechRecognition();
  const [isRecording, setIsRecording] = useState<boolean>(false);
  const [isWaiting, setIsWaiting] = useState(true);
  const [isEnd, setIsEnd] = useState(false);
  const [isReady, setIsReady] = useState(false);
  const [flag, setFlag] = useState(0);

  useEffect(() => {
    const serverURL = VITE_REACT_WS_URL as string;
    const token = getCookie();
    const onConnected = (client: Client) => {
      const subscription = client.subscribe(
        `/topic/room.${roomId}`,
        (message) => {
          const chat = JSON.parse(message.body) as ChatMessage;
          if (chat.sender === "USER_TIP") {
            setLastUserTip(chat); // 마지막 USER_TIP 메시지를 저장
          } else if (chat.sender === "GPT") {
            if (chat.japanese.startsWith("대화가 종료되었습니다.")) {
              setIsEnd(true);
            }
            setIsWaiting(false);
          } else if (chat.sender === "USER") {
            setFlag((prevFlag) => prevFlag + 1);

            setLastUserTip(null);
          }

          setChats((prev) => [...prev, chat]);
        }
      );

      return () => subscription.unsubscribe();
    };

    const onError = (error: Frame | string) => {
      if (typeof error === "string") {
        console.error("Connection string error: ", error);
      } else {
        console.error("Connection frame error: ", error.headers.message);
      }
    };

    connectStompClient(
      serverURL,
      token,
      roomId,
      catagory,
      onConnected,
      onError
    );

    // 컴포넌트 언마운트 시 웹소켓 연결을 종료
    return () => {
      getStompClient()?.disconnect();
    };
  }, [roomId]);

  useEffect(() => {
    if (flag === 2) {
      setIsReady(true);
    }
  }, [flag]);

  return (
    <>
      <ChatRoomContainer>
        <ChatHeader />
        <ChatMain
          messages={chats}
          transcript={transcript}
          isRecording={isRecording}
          isWaiting={isWaiting}
        />
        <FooterContainer>
          <ChatFooter
            roomId={roomId}
            transcript={transcript}
            resetTranscript={resetTranscript}
            isRecording={isRecording}
            setIsRecording={setIsRecording}
            isWaiting={isWaiting}
            setIsWaiting={setIsWaiting}
            isEnd={isEnd}
            isReady={isReady}
          />
          {!isWaiting && lastUserTip && <ChatTip lastUserTip={lastUserTip} />}
        </FooterContainer>
      </ChatRoomContainer>
    </>
  );
}

export default ChatRoom;
