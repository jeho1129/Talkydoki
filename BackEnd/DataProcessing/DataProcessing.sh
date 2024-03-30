#!/bin/bash

# PATH 설정 (selenium과 관련된 패키지가 있는 경로)
export PATH=/usr/local/bin:$PATH

# 카테고리 정보 설정
CAT=(
    '{"CAT_NAME": "SOCIETY","CAT_URL": "/cat01.html"}'
    '{"CAT_NAME": "WEATHER_DISASTER","CAT_URL": "/saigai.html"}'
    '{"CAT_NAME": "SCIENCE_CULTURE","CAT_URL": "/cat03.html"}'
    '{"CAT_NAME": "POLITICS","CAT_URL": "/cat04.html"}'
    '{"CAT_NAME": "BUSINESS","CAT_URL": "/business.html"}'
    '{"CAT_NAME": "INTERNATIONAL","CAT_URL": "/cat06.html"}'
    '{"CAT_NAME": "SPORTS","CAT_URL": "/cat07.html"}'
    '{"CAT_NAME": "LIFE","CAT_URL": "/cat02.html"}'
)

# Python 스크립트 실행
for cat_info in "${CAT[@]}"; do
    python3 /usr/src/app/NewsCrawling/NewsCrawling.py "$cat_info"
done

python3 /usr/src/app/NewsCrawling/RemoveDuplicateNews.py

python3 /usr/src/app/DataProcessing.py


