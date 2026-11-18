# ∇ 특별편 — 화살표 하나로 보는 미분·적분과 다섯 현장

'좌표축 위의 그릇' 시리즈의 독립 특별편입니다. ∇(나블라) 하나로 그래디언트·발산·회전·라플라시안을 읽고, 적분하면 세 정리가 되며, 머신러닝·딥러닝·렌더링·공장·생선 선별대가 모두 이 화살표 위에서 움직인다는 것을 비전공자용 연구실 해설로 보여 줍니다.

- 공개 주소: https://adminmrobo.github.io/vector_calculus_lab/
- 글 · 안상선 ((주)M-Robo 대표) · [소개](https://adminmrobo.github.io/who_am_i/who_am_i.html)

## 구성 (8편 · 방 26개)

| 파일 | 편 | 방 |
|---|---|---|
| [index.html](index.html) | 목차 · 읽는 길 | — |
| [00_orientation.html](00_orientation.html) | 0편 오리엔테이션 (건너뛰어도 됨) | A·B |
| [01_differential.html](01_differential.html) | ①편 미분 쪽 — ∇ 네 형제 | 1~6 |
| [02_integral.html](02_integral.html) | ②편 적분 쪽 — 세 정리 (심화) | 7~9 + 두 항등식 |
| [03_machine_learning.html](03_machine_learning.html) | ③편 머신러닝 | 10~12 |
| [04_deep_learning.html](04_deep_learning.html) | ④편 딥러닝 | 13~15 |
| [05_rendering.html](05_rendering.html) | ⑤편 렌더링 | 16~18 |
| [06_factory.html](06_factory.html) | ⑥편 공장 최적화 (공정의 시간·비용) | 19~21 |
| [07_fish_market.html](07_fish_market.html) | ⑦편 생선 분류 최적화 (모델의 정확도·시간·비용) | 22~26 |

**빠른 길:** 0편 → ①편(방 1~5) → ⑦편. 방 6과 ②편은 심화입니다.

## 수업 배치 (90분 × 3차시)

| 차시 | 내용 |
|---|---|
| 1차시 | 0편 · ①편 |
| 2차시 | ③편 · ④편 · ⑤편 |
| 3차시 | ⑥편 · ⑦편 + 대결 |
| 자습·과제 | ②편 적분 쪽 |

## 원자료

인포그래픽 7장 — Vector Differential Operator · Del Operator (@askwhyvalley), Cartesian/Cylindrical/Spherical Coordinates · Lagrange Multipliers · Hessian Matrix (matharium), Gradient in Different Coordinate Systems (@matheorems), Gradient, Divergence & Curl (Quantum Physics, Grok 생성). 그림은 붙여 넣지 않고 다시 그렸으며, 원자료끼리의 기호 차이는 각 편에 "바꿉니다"로 밝혔습니다. 모든 실험 데이터는 설명용 모형·가상 수치입니다.

## 만들기

페이지는 `tools/build.py`가 문구 데이터(`tools/content/*.py`)를 끼워 자립형 HTML로 만듭니다(외부 요청은 글꼴 하나).

```bash
# 캐릭터 그림: ahnboat_lab_explainer/packs/character/character_pack/sprites_96.js 를 JSON으로 뽑아 둔다
python3 tools/build.py --sprites /path/to/sprites96.json
```

- `tools/lab.css` · `tools/lab_core.js` · `tools/lab_mods.js` — 디자인, 공용 모듈, 실험 패널 26종
- `docs/PLAN_v2.1.md` — 기획안(페르소나 평가 반영)
- `docs/COVER_PROMPTS_vector_calculus_lab.md` — 표지 9장 지시문

캐릭터 그림: [fruitfly-lab-expressions](https://github.com/adminmrobo/fruitfly-lab-expressions)
