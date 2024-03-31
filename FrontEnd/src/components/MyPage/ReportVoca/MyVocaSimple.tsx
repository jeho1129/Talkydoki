import { useMyVoca } from "@/api/vocaApi";
import { PersonalVocaInterface } from "@/interface/VocaInterface";
import { SimpleVocaContainer } from "@/styles/Mypage/ui";
import { splitMeaning } from "@/util/language/voca";
import { Divider } from "@mui/material";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

type Props = {};

function MyVocaSimple({}: Props) {
  const navigate = useNavigate();
  const [vocaList, setVocaList] = useState<PersonalVocaInterface[]>([]);
  const { data } = useMyVoca();

  // 단어장 단어 5개만 미리보기
  useEffect(() => {
    if (!data) return;
    setVocaList([]);
    data.forEach((each, idx) => {
      if (idx > 4) return;
      setVocaList((prev) => [...prev, each]);
    });
  }, [data]);

  return (
    <SimpleVocaContainer>
      <div className="voca" style={{ marginBottom: "30px" }}>
        <div className="title">나의 단어장</div>
        <div className="seemore" onClick={() => navigate("myvoca")}>
          더보기
        </div>
      </div>
      {vocaList.length === 0 && (
        <div className="nodata">등록된 단어가 없습니다.</div>
      )}
      {vocaList.map((each) => (
        <div key={each.personalVocabularyId}>
          <div className="voca">
            <div className="jp">{each.japanese}</div>
            <div className="kr">{splitMeaning(each.korean)[0]}</div>
          </div>
          <Divider />
        </div>
      ))}
    </SimpleVocaContainer>
  );
}

export default MyVocaSimple;
