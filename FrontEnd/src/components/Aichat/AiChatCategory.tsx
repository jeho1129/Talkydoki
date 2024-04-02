import { Categorybox } from "@/styles/Aichat/AiChatList";
import ChatCategory from "../ui/AIChatCategory";
import { Divider } from "@mui/material";

type Props = {};

function AiChatCategory({}: Props) {
  return (
    <>
      <Categorybox>
        <div className="titleBox">
          <div>초급 회화</div>
          <Divider />
        </div>
        <ChatCategory
          iconId={1}
          title={"호텔 체크인하기"}
          Category={"HOTEL_CHECK_IN"}
        ></ChatCategory>
        <ChatCategory
          iconId={2}
          title={"축구 대화 하기"}
          Category={"SOCCER_CONVERSATION"}
        ></ChatCategory>
        <ChatCategory
          iconId={3}
          title={"  햄버거 주문하기"}
          Category={"ORDER_HAMBURGER"}
        ></ChatCategory>
      </Categorybox>

      <Categorybox>
        <div className="titleBox">
          <div>중급 회화</div>
          <Divider />
        </div>
        <ChatCategory
          iconId={4}
          title={"미용실에서 머리자르기"}
          Category={"HAIRCUT_AT_SALON"}
        ></ChatCategory>
        <ChatCategory
          iconId={5}
          title={"병원에서 몸상태 말하기"}
          Category={"DESCRIBE_HEALTH_CONDITION_AT_HOSPITAL"}
        ></ChatCategory>
        <ChatCategory
          iconId={6}
          title={"경찰서에서 분실물 찾기"}
          Category={"FIND_LOST_ITEM_AT_POLICE_STATION"}
        ></ChatCategory>
      </Categorybox>

      <Categorybox>
        <div className="titleBox">
          <div>상급 회화</div>
          <Divider />
        </div>
        <ChatCategory
          iconId={7}
          title={"사회적 토론하기"}
          Category={"ENGAGE_IN_SOCIAL_DISCUSSION"}
        ></ChatCategory>
        <ChatCategory
          iconId={8}
          title={"동료와 친해지기"}
          Category={"BEFRIEND_A_COLLEAGUE"}
        ></ChatCategory>
        <ChatCategory
          iconId={9}
          title={"브런치 식사 대화하기"}
          Category={"BRUNCH_CONVERSATION"}
        ></ChatCategory>
      </Categorybox>
    </>
  );
}

export default AiChatCategory;
