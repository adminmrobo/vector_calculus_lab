# 표지 지시문 — ∇ 특별편 (vector_calculus_lab)

> **그림체: 16비트 RPG 픽셀아트(연구실 스킬 공통 스타일).** 판 L: 16:9, 가로 1920 이상 → 빌드 WebP 1600×900(220 KB 이하). 그림 안 글자·숫자·로고 금지.
> 참고 이미지: 네 캐릭터 기본 그림 4장 + 시아·모아 기본 그림 2장 (GitHub `adminmrobo/fruitfly-lab-expressions`).
> **목차 표지(cover_index)를 먼저 받아 그림체를 확인한 뒤**, 나머지 요청에 그 표지를 참고 그림으로 함께 올린다.
> 받은 그림은 `assets/cover/cover_{키}.webp`로 넣고, 각 페이지 `data-img="cover_{키}"` 자리에 반영한다(18-15).

## 공통 영어 조각

- **공통 스타일 (모든 표지 맨 앞에):** 16-bit RPG style pixel art, bold dark outline, 2–3 tone shading, small highlights, consistent with the reference images

- **Doctor:** chibi scientist, thin teal rectangular glasses, spiky black hair with one white streak, small ponytail at the back, white lab coat over black vest and tie
- **Assistant (Haru):** girl researcher, long pink hair with two round buns and a navy streak, blue eyes, white lab coat over lavender hoodie, jeans
- **Fruit fly researcher:** anthropomorphic fruit fly researcher, black body, big red compound eyes, blue helmet with a gold stripe and pink and blue cables, white lab coat over a black vest, black gloves, transparent wings — on the left facing right
- **Jupanbot:** boxy beige retro CRT-monitor robot, dark green screen face with mint pixel eyes and mouth, short antenna topped with a red-brown abacus bead, gray segmented arms, two small tank treads, holding a wooden abacus — on the right facing left
- **Sia (optional, background):** calm girl maid intern, long straight jet-black hair with side-swept bangs, no headdress, gray eyes, small silver drop earrings, charcoal-black long-sleeved maid dress, large gray bow, long white frilled apron
- **Moa (optional, background):** gentle girl maid intern, long ash-beige wavy hair, white frilled maid headband with a ribbon over the left ear, amber-brown eyes, red and navy plaid bow tie, camel knit cardigan, white frilled apron, black skirt
- **꼬리 (모든 표지 끝에):** Composition: keep every face and hand inside the central safe area (12% margin left and right, 10% top, 18% bottom); keep the bottom-left corner plain, bright and simple. Mood: curious, friendly rivalry, the moment before the result. Bright daytime lab, white walls. No text, no letters, no numbers, no logos, no weapons, no cigarettes, no alcohol, no blood, no real brands.

## 표지 목록

| 키 | 페이지 | 장소 | 주제 은유 (글자 없이) | 앞 표지와 다른 점 |
|---|---|---|---|---|
| cover_index | 목차 | 번호 없는 문 8개가 줄지은 밝은 연구실 복도 | 복도 바닥에 은은하게 빛나는 화살표 무늬(화살표 밭) | 첫 표지 — 여섯 식구 모두 |
| cover_00 | 0편 | 칠판 앞 작은 세미나 탁자 | 칠판에 그린 곡선 하나와 그 위에 걸친 빛나는 접선 막대 | 실내 탁자, 시아가 안내 |
| cover_01 | ①편 | 탁자 위 큰 지형 모형(언덕) | 언덕 모형 위에 꽂힌 작은 화살표 깃발들, 한쪽엔 작은 바람개비 | 지형 모형 |
| cover_02 | ②편 | 투명한 유리 상자가 놓인 실험대 | 상자 안에서 솟아 겉면으로 빠져나가는 빛 줄기, 둥근 테두리를 도는 빛 고리 | 유리 상자 |
| cover_03 | ③편 | 커다란 그릇 모양 미끄럼 모형 | 그릇 안쪽 벽을 따라 바닥으로 굴러가는 빛나는 구슬과 그 자취 | 그릇 모형 |
| cover_04 | ④편 | 말안장 모양 곡면 모형과 두 개의 회전 의자 | 안장 꼭대기의 구슬, 서로를 쫓아 원을 그리는 두 빛 점 | 안장 곡면 |
| cover_05 | ⑤편 | 어두운 커튼 앞 작은 촬영 무대(실내는 밝게) | 조명을 받는 흰 공, 공 위로 소용돌이치는 연기 입자 | 촬영 무대 |
| cover_06 | ⑥편 | 시멘트 가마 축소 모형이 있는 공장 견학실 | 가마 모형 겉면을 따라 퍼지는 따뜻한 색 그라데이션, 입구·출구 화살표 모양 컨베이어 | 공장 모형 |
| cover_07 | ⑦편 | 생선 선별 컨베이어가 있는 수산 시장 작업대 | 컨베이어 위 생선들 위로 세 개의 빛나는 축(정확도·시간·비용)이 만든 투명한 그릇 | 시장 작업대, 마지막 편 |

## Genspark에 붙여 넣기 (표지마다 장소·은유만 바꿔 쓴다)

```
웹페이지 맨 위에 거는 표지 그림 1장을 만들어 줘.
- 비율 16:9, 가로 1920px 이상
- 그림체는 16비트 RPG 픽셀아트(굵은 어두운 외곽선, 2~3단 명암, 작은 하이라이트)
- 첨부한 참고 이미지의 캐릭터(박사, 조수, 초파리 연구원, 주판봇)를 같은 그림체·같은 외형으로, 넷 모두 등장
- 그림 안에 글자·숫자·로고를 넣지 말 것
- 얼굴과 손은 가장자리에서 떨어진 가운데 영역에, 왼쪽 아래 구석은 밝고 단순하게
아래 영어 프롬프트를 그대로 써 줘.

Website top cover illustration, wide 16:9.
16-bit RPG style pixel art, bold dark outline, 2–3 tone shading, small highlights, consistent with the reference images.
Match the art style, proportions and colors of the attached reference images exactly.
Scene: {장소 영어}.
All four characters together: {Doctor}, standing at the back center pointing at the prop; {Assistant}, at one side holding a clipboard; {Fruit fly researcher}, curious; {Jupanbot}, confident.
Visual metaphor of the topic: {은유 영어}.
The light falls on {핵심 소품}.
{꼬리}
```

### 장소·은유 영어 (복사용)

- **cover_index:** Scene: a bright laboratory corridor with eight plain doors without numbers. Metaphor: softly glowing arrow patterns on the floor like a field of arrows. Add Sia and Moa walking in the background.
- **cover_00:** Scene: a small seminar table in front of a chalkboard. Metaphor: one smooth curve drawn on the board with a glowing ruler touching it at a single point (tangent). Sia stands beside the board as a guide.
- **cover_01:** Scene: a large tabletop terrain model of a hill. Metaphor: tiny arrow flags planted on the hill pointing uphill, and one small pinwheel spinning on the side.
- **cover_02:** Scene: a lab bench with a transparent glass box. Metaphor: rays of light rising inside the box and passing out through its faces, and a ring of light circling the rim of a round disk.
- **cover_03:** Scene: a big bowl-shaped slide model. Metaphor: a glowing marble rolling down the inner wall toward the bottom, leaving a faint trail.
- **cover_04:** Scene: a saddle-shaped surface model and two swivel chairs. Metaphor: a marble resting on top of the saddle, and two light dots chasing each other in a circle.
- **cover_05:** Scene: a small photo stage in a bright room with a dark curtain behind it. Metaphor: a white sphere lit from one side, with swirling smoke particles curling above it.
- **cover_06:** Scene: a factory visitor room with a scale model of a cement kiln. Metaphor: a warm color gradient spreading along the kiln model, and conveyor belts shaped like in-and-out arrows.
- **cover_07:** Scene: a fish market sorting table with a small conveyor. Metaphor: fish on the conveyor under a transparent bowl formed by three glowing axes. Sia and Moa cheer in the background (last episode).

**고칠 때 (같은 대화에서):** `Same four characters, same 16-bit pixel art style and composition. Change only: {고칠 점}. Still no text.`
