CARDS = [
 ('00_orientation.html', '0편 · 오리엔테이션', '미분 세 줄 복습, 숫자 지도와 화살표 지도', '방 A·B · 건너뛰어도 됨', 'sia', 'guide', '입문'),
 ('01_differential.html', '①편 · 미분 쪽 — ∇ 네 형제', '그래디언트·발산·회전·라플라시안, 좌표 바꾸기', '방 1~6', 'doc', 'front', '기초'),
 ('02_integral.html', '②편 · 적분 쪽 — 세 정리', '기울기 정리·발산 정리·스토크스 정리, 두 항등식', '방 7~9 · 심화', 'moa', 'think', '심화'),
 ('03_machine_learning.html', '③편 · 머신러닝', '경사 하강, 라그랑주 승수, 헤시안', '방 10~12', 'asst', 'smile', '현장'),
 ('04_deep_learning.html', '④편 · 딥러닝', '역전파, 안장점, 도는 학습(GAN)', '방 13~15', 'fly', 'magnify', '현장'),
 ('05_rendering.html', '⑤편 · 렌더링', '표면 법선, 연기 입자, 확산 모델', '방 16~18', 'doc', 'magic', '현장'),
 ('06_factory.html', '⑥편 · 공장 최적화', '가마 온도, 물질 수지, 예산 안의 생산', '방 19~21', 'robo', 'calc', '현장'),
 ('07_fish_market.html', '⑦편 · 생선 분류 최적화', '정확도·시간·비용의 3D 지도', '방 22~26 · 마지막 편', 'moa', 'cheer', '종합'),
]

def _body():
    cards = ''.join(f'<a class="room" href="{f}"><img data-who="{w}" data-mood="{m}" alt="" aria-hidden="true"><span class="tag">{lv}</span><b>{t}</b><span>{d}</span><div class="meta">{meta}</div></a>' for f, t, d, meta, w, m, lv in CARDS)
    return f'''<section id="first" class="three"><h2>처음 오신 분께 — 이 특별편을 3줄로</h2><ol>
<li><b>무엇을:</b> ∇(나블라) 하나로 언덕(그래디언트)·샘(발산)·소용돌이(회전)·주변과의 차이(라플라시안)를 읽고, 적분하면 세 정리가 됩니다.</li>
<li><b>왜 중요한가:</b> 머신러닝·딥러닝 학습, 3D 렌더링, 공장 최적화, 생선 선별대가 모두 이 화살표 위에서 움직입니다.</li>
<li><b>업무에서는:</b> "어느 쪽으로 바꾸면 가장 빨리 좋아지나"와 "시간·비용까지 놓고 어디서 멈출까"를 숫자와 방향으로 답합니다.</li></ol>
<span class="nocode">코드·수식을 몰라도 됩니다</span></section>
<section id="route"><h2>읽는 길</h2><div class="route"><a class="fast" href="00_orientation.html">빠른 길: 0편 → ①편(방 1~5) → ⑦편</a><a href="00_orientation.html">처음부터 차례대로</a><a href="02_integral.html">심화: ②편 적분 쪽</a></div>
<p>방 6(좌표 바꾸기)과 ②편 전체는 <b>심화</b>입니다. 건너뛰어도 다음 편을 읽을 수 있습니다.</p>
<div class="tw"><table class="tb"><tr><th>수업 배치 (90분 × 3차시)</th><th>내용</th></tr><tr><td>1차시</td><td>0편 · ①편</td></tr><tr><td>2차시</td><td>③편 · ④편 · ⑤편</td></tr><tr><td>3차시</td><td>⑥편 · ⑦편 + 대결</td></tr><tr><td>자습·과제</td><td>②편 적분 쪽</td></tr></table></div></section>
<section id="toc"><h2>연구실 복도 — 방 26개</h2><div class="toc">{cards}</div></section>
<section id="series"><h2>이 특별편의 자리</h2><p>'좌표축 위의 그릇' 시리즈의 <b>독립 특별편</b>입니다. 그릇 3편 본문의 "자세히는 특별편" 안내가 이곳의 방으로 이어집니다. 미분이 처음이면 <a href="https://adminmrobo.github.io/optimization_3d_map/">최적화 첫걸음</a>을 먼저 보아도 좋습니다.</p>
<div class="fix">원자료 인포그래픽 7장(∇ 연산자, 좌표계, 좌표계별 그래디언트, 델 연산자, 그래디언트·발산·회전, 라그랑주 승수, 헤시안)은 붙여 넣지 않고 구도와 기호를 살려 다시 그렸습니다. 원자료끼리 기호가 다른 곳(원통 좌표 등)은 각 편에서 "바꿉니다"로 밝혔습니다.</div></section>'''

PAGE = {
 'file': 'index.html', 'key': 'index', 'cover_field': 'grad',
 'kicker': '좌표축 위의 그릇 · ∇ 특별편',
 'title': '∇ 특별편 — 화살표 하나로 보는 미분·적분과 다섯 현장',
 'question': '화살표 하나로 학습·그림·공장·선별대를 모두 설명할 수 있을까?',
 'question_en': 'Can one arrow operator explain learning, rendering, factories, and sorting lines?',
 'intro': '기초 두 편(미분 쪽·적분 쪽)과 현장 다섯 편(머신러닝·딥러닝·렌더링·공장·생선 분류)으로 이루어진 연구실 해설입니다. 시아와 모아가 방 26개를 통과합니다.',
 'kpis': [('g', '8', '편'), ('m', '26', '방'), ('r', '7', '원자료 인포그래픽'), ('a', '3', '마지막 편의 축 (정확도·시간·비용)')],
 'hero_say': ('doc', 'front', '연구실 복도에 방이 26개 있습니다. 빠른 길로 가도, 차례대로 가도 좋아요.'),
 'nav': [('first', '3줄 요약'), ('route', '읽는 길'), ('toc', '목차'), ('series', '시리즈')],
 'custom_body': _body(),
 'quiz': {},
 'gloss': {'∇': ['∇ (나블라)', '도구', '방향별 기울기를 한 줄로 묶은 미분 도구.'], '그래디언트': ['그래디언트', '연산', '가장 가파르게 오르는 화살표.'], '발산': ['발산', '연산', '샘(+)·배수구(−)의 세기.'], '회전': ['회전', '연산', '그 자리에서 도는 빠르기.'], '라플라시안': ['라플라시안', '연산', '주변 평균과의 차이.']},
 'gloss_en': {'∇': 'nabla', '그래디언트': 'gradient', '발산': 'divergence', '회전': 'curl', '라플라시안': 'laplacian'},
 'refs': [
  {'id': 'src1', 'title': 'Vector Differential Operator (인포그래픽)', 'publisher': '@askwhyvalley'}, {'id': 'src2', 'title': 'Cartesian, Cylindrical and Spherical Coordinates (인포그래픽)', 'publisher': 'matharium'},
  {'id': 'src3', 'title': 'Gradient in Different Coordinate Systems (인포그래픽)', 'publisher': '@matheorems'}, {'id': 'src4', 'title': 'Del Operator (Nabla) (인포그래픽)', 'publisher': '@askwhyvalley'},
  {'id': 'src5', 'title': 'Gradient, Divergence & Curl (인포그래픽)', 'publisher': 'Quantum Physics (Grok 생성)'}, {'id': 'src6', 'title': 'Lagrange Multipliers (인포그래픽)', 'publisher': 'matharium'},
  {'id': 'src7', 'title': 'Hessian Matrix (인포그래픽)', 'publisher': 'matharium'}],
}
