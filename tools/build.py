#!/usr/bin/env python3
"""vector_calculus_lab 빌드 — 문구 데이터(content/*.py)를 끼워 자립형 HTML을 만든다.
사용: python3 tools/build.py --sprites /path/to/sprites96.json
캐릭터 그림: fruitfly-lab-expressions → ahnboat_lab_explainer packs/character/character_pack/sprites_96.js 에서 뽑은 JSON
"""
import argparse, html, importlib.util, json, os, re, sys

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
TOOLS = os.path.join(ROOT, 'tools')
SITE = 'https://adminmrobo.github.io/vector_calculus_lab/'
AUTHOR = '글 · 안상선 (<a href="https://adminmrobo.github.io/who_am_i/who_am_i.html">소개</a>) · (주)M-Robo 대표'
NAMES = {'doc': '박사', 'asst': '조수 하루', 'fly': '초파리 연구원', 'robo': '주판봇', 'sia': '시아', 'moa': '모아'}
SERIES = [
    ('index.html', '목차', '연구실 복도 지도'),
    ('00_orientation.html', '0편', '오리엔테이션'),
    ('01_differential.html', '①편', '미분 쪽 — ∇ 네 형제'),
    ('02_integral.html', '②편', '적분 쪽 — 세 정리'),
    ('03_machine_learning.html', '③편', '머신러닝'),
    ('04_deep_learning.html', '④편', '딥러닝'),
    ('05_rendering.html', '⑤편', '렌더링'),
    ('06_factory.html', '⑥편', '공장 최적화'),
    ('07_fish_market.html', '⑦편', '생선 분류 최적화'),
]
E = html.escape


def load_edu():
    spec = importlib.util.spec_from_file_location('edu', os.path.join(TOOLS, 'content', 'edu.py'))
    m = importlib.util.module_from_spec(spec); spec.loader.exec_module(m)
    return m.ROOM, m.AI


EDU, AI = load_edu()


def load(name):
    spec = importlib.util.spec_from_file_location(name, os.path.join(TOOLS, 'content', name + '.py'))
    m = importlib.util.module_from_spec(spec)
    spec.loader.exec_module(m)
    return m.PAGE


def img(who, mood, cls='who', size=None):
    s = f' width="{size}" height="{size}"' if size else ''
    return f'<img class="{cls}" data-who="{who}" data-mood="{mood}" alt="" aria-hidden="true"{s}>'


def say(who, mood, text):
    return f'<div class="say" data-who="{who}">{img(who, mood)}<div><b class="name">{NAMES[who]}</b><p>{text}</p></div></div>'


def nav(pg):
    nv = list(pg.get('nav', []))
    if pg.get('key') in AI:
        i = next((k for k, (a, _) in enumerate(nv) if a == 'duel'), len(nv))
        nv.insert(i, ('aicheck', 'AI 판단'))
    links = ''.join(f'<a href="#{a}">{t}</a>' for a, t in nv)
    return f'<nav class="top" aria-label="이 페이지 차례"><a class="logo" href="index.html">∇ 연구실</a>{links}<a href="#kg">지식 색인</a></nav>'


def cover(pg):
    title = pg['title']
    who = pg.get('cover_cast', [('fly', 'point'), ('doc', 'front'), ('asst', 'smile'), ('robo', 'smile')])
    return f'''<div class="cover" id="cover"><div class="frame" data-img="cover_{pg['key']}">
<svg class="bgfield" viewBox="0 0 160 90" preserveAspectRatio="xMidYMid slice" aria-hidden="true">{bgfield(pg.get('cover_field','grad'))}</svg>
<div class="ttl"><span>{E(pg['kicker'])}</span><b>{title}</b></div>
<div class="cast4">{''.join(img(w, m, 'c') for w, m in who)}</div></div></div>'''


def bgfield(kind):
    out = []
    for i in range(16):
        for j in range(9):
            x, y = 5 + i * 10, 5 + j * 10
            u, v = (x - 80) / 40, (y - 45) / 40
            if kind == 'curl':
                dx, dy = -v, u
            elif kind == 'div':
                dx, dy = u, v
            else:
                dx, dy = 2 * u, 2 * v
            L = (dx * dx + dy * dy) ** .5 or 1
            k = 3.4 / L
            out.append(f'<line x1="{x}" y1="{y}" x2="{x + dx * k:.1f}" y2="{y + dy * k:.1f}" stroke="rgba(15,111,115,.18)" stroke-width=".6"/>')
    return ''.join(out)


def three(pg):
    t = pg['three']
    ab = ''.join(f'<li><b>{E(k)}</b> — {v}</li>' for k, v in pg.get('abbr', []))
    return f'''<section id="first" class="three"><h2>처음 오신 분께 — 이 페이지를 3줄로</h2><ol><li><b>무엇을:</b> {t[0]}</li><li><b>왜 중요한가:</b> {t[1]}</li><li><b>업무에서는:</b> {t[2]}</li></ol>
<span class="nocode">코드·수식을 몰라도 됩니다</span>{'<details><summary>영어 약어·기호 풀이</summary><ul>' + ab + '</ul></details>' if ab else ''}</section>'''


def castsec(pg):
    roles = pg.get('cast_roles', {})
    order = pg.get('cast_order', ['sia', 'moa', 'doc', 'asst', 'fly', 'robo'])
    base = {'sia': '인턴 · 직관파. 비유를 먼저 꺼낸다', 'moa': '인턴 · 꼼꼼파. 조건과 예외를 묻는다', 'doc': '방을 만든 사람. 방마다 정리한다',
            'asst': '수식이 어려운 독자 대신 묻고 숫자로 풀어 본다', 'fly': '의심 담당. "이걸 눌러 봐"', 'robo': '성급한 확신으로 흔한 오해를 대표한다'}
    cards = ''.join(f'<div class="c">{img(w, "smile" if w in ("sia", "moa", "asst", "robo") else ("front" if w == "doc" else "clip"), "", 64)}<div><b>{NAMES[w]}</b><span>{roles.get(w, base[w])}</span></div></div>' for w in order)
    return f'<section id="cast"><h2>등장인물 · 이 페이지 사용법</h2><div class="cast">{cards}</div><p>노란 점선 밑줄을 누르면 뜻이 나옵니다. 실험 패널은 직접 눌러 보며 읽으세요. {pg.get("prev_note", "")}</p></section>'


def why(pg):
    s = ''.join(f'<div><b class="n">{i + 1}</b><b>{E(t)}</b><p>{d}</p></div>' for i, (t, d) in enumerate(pg['why']))
    return f'<section id="why"><h2>왜 이 주제인가</h2><div class="steps">{s}</div></section>'


def bigpic(pg):
    s = ''.join(f'<div><b>{E(t)}</b>{d}</div>' for t, d in pg['big'])
    extra = pg.get('big_extra', '')
    return f'<section id="big"><h2>큰 그림</h2><div class="big">{s}</div>{extra}</section>'


def room(r):
    ed = EDU.get(r['no'], {})
    tags = ''.join(f'<span class="tag {c}">{E(t)}</span>' for c, t in r['tags'])
    deep = f'<p class="deepnote">{r["deep"]}</p>' if r.get('deep') else ''
    w = r['why']
    a = r['asst']
    reads = ed.get('reads')
    if reads:
        rows = [(p, reads[i] if i < len(reads) else '', m) for i, (p, m) in enumerate(a['parts'])] + list(ed.get('extra', []))
        parts = ''.join(f'<tr><td>{p}</td><td>{rd}</td><td>{m}</td></tr>' for p, rd, m in rows)
        thead = '<tr><th>식 조각</th><th>읽는 법</th><th>뜻</th></tr>'
    else:
        parts = ''.join(f'<tr><td>{p}</td><td>{m}</td></tr>' for p, m in a['parts'])
        thead = '<tr><th>식 조각</th><th>뜻</th></tr>'
    first = f'<p class="sayfirst"><b>말로 먼저:</b> {ed["say"]}</p>' if ed.get('say') else ''
    duo = f'''<div class="duo"><div class="whybox"><h3>왜 이 방법을 쓰나</h3><p><b>문제:</b> {w[0]}</p><p><b>앞 방법의 한계:</b> {w[1]}</p><p><b>해법:</b> {w[2]}</p><div class="easy"><b>쉽게 말하면</b> {w[3]}</div></div>
<div class="mathbox"><h3>수학 수식을 어려워하는 조수가 대신 물어봅니다</h3><div class="asq">{img('asst', 'shock', '', 52)}<p><b>조수:</b> {a['q']}</p></div>
<p class="school">학교 수학으로 보면: {a['school']}</p>{first}<details class="eqfold"><summary>식으로 보기 — 기호 읽는 법 포함</summary><div class="eq">{a['eq']}</div><table>{thead}{parts}</table></details>
<div class="num"><b>숫자로 한 번 해 보기</b><br>{a['num']}{ed.get('num_add', '')}</div><div class="asq">{img('asst', 'spark', '', 52)}<p><b>조수:</b> {a['comment']}</p></div></div></div>'''
    pair = f'<div class="pair"><div class="fly"><b>일상으로 치면</b>{r["pair"][0]}</div><div class="nn"><b>{r["pair"][1]}</b>{r["pair"][2]}</div></div>'
    tl = ([('doc', 'board', ed['doc'])] if ed.get('doc') else []) + list(r['talk'])
    talk = '<div class="talk">' + ''.join(say(*t) for t in tl) + '</div>'
    fix = f'<p class="fix">{r["fix"]}</p>' if r.get('fix') else ''
    panel = f'<div class="panel" id="sim-{r["id"]}"><div class="ptitle">실험 · {r["panel"]}</div><div data-mod="{r["mod"]}"></div></div>'
    exps = list(r['explain']) + ([ed['explain_add']] if ed.get('explain_add') else [])
    ex = f'<div class="explain"><h3>풀이</h3>{"".join("<p>" + p + "</p>" for p in exps)}<p class="lim"><b>이 방의 한계:</b> {r["limit"]}</p></div>'
    br = ''.join(f'<div class="bridge {c}"><b>{t}</b> {d}</div>' for c, t, d in r.get('bridge', []))
    cd = r.get('code') or ed.get('code')
    code = f'<details class="codefold"><summary>파이썬 코드로 같은 값 확인 (몰라도 됩니다)</summary><code>{E(cd[0])}</code><p>{cd[1]}</p></details>' if cd else ''
    return f'''<section class="level" id="room-{r['no']}"><div class="lvhead"><div class="hex">{r['no']}</div><div><h2>{r['title']}</h2><div class="tags">{tags}</div></div></div>{deep}
<p>{r['lead']}</p>{duo}{pair}{fix}{talk}{panel}{ex}{br}{code}<div class="quiz" data-quiz="q{r['no']}"></div></section>'''


def aicheck(pg):
    a = AI.get(pg['key'])
    if not a: return ''
    qs = ''.join(f'<li>{q}</li>' for q in a['qs'])
    return f'''<section class="level" id="aicheck"><div class="lvhead"><div class="hex">AI</div><div><h2>AI 판단 코너 — 이 답을 그대로 믿어도 될까</h2><div class="tags"><span class="tag m">방법: 결과 확인하기</span><span class="tag d">일상: 보고서 검토</span></div></div></div>
<p>계산은 프로그램과 AI가 1초 만에 해 줍니다. 우리에게 필요한 힘은 그 결과가 맞는지 따져 보는 힘입니다. 아래는 주판봇이 AI에게서 받아 온 답입니다.</p>
<div class="talk">{say('robo', 'chart', 'AI가 이렇게 답했어요! ' + a['claim'])}{say('doc', 'board', '바로 믿기 전에 두 가지만 확인해 볼까요? 틀려도 괜찮아요. 확인하는 습관이 목적입니다.')}</div>
<div class="explain"><h3>확인 질문</h3><ol>{qs}</ol></div>
<details><summary>확인해 보기 (먼저 생각해 본 뒤 여세요)</summary><p>{a['ans']}</p></details></section>'''


def duel(pg):
    d = pg['duel']
    return f'''<section id="duel"><h2>대결 · {d['title']}</h2><p>{d['q']}</p><div class="duel" id="duelbox"><div class="vs">
<div class="side l">{img('fly', 'point', '', 96)}<b>초파리 연구원</b><p>{d['fly'][0]}</p><small>{d['fly'][1]}</small></div><div class="vsmark">VS</div>
<div class="side r">{img('robo', 'coin', '', 96)}<b>주판봇</b><p>{d['robo'][0]}</p><small>{d['robo'][1]}</small></div></div>
<div class="ctrl guess"><span class="glabel">먼저 맞혀 보기:</span><button type="button" class="bt" aria-pressed="false">초파리가 이길 것 같다</button><button type="button" class="bt" aria-pressed="false">주판봇이 이길 것 같다</button><span class="guessed glabel" aria-live="polite"></span></div>
<button type="button" class="bt primary reveal">결과 보기</button><div class="result" aria-live="polite"><div class="bars"></div>
<div class="say asst" data-who="asst">{img('asst', 'report')}<div><b class="name">조수 하루</b><p></p></div></div>
<div class="say verdict" data-who="doc">{img('doc', 'judge')}<div><b class="name">박사</b><p></p></div></div></div></div></section>'''


def summary(pg):
    s = pg['summary']
    head = ''.join(f'<th>{h}</th>' for h in s['head'])
    rows = ''.join('<tr>' + ''.join(f'<td>{c}</td>' for c in r) + '</tr>' for r in s['rows'])
    return f'<section id="summary"><h2>정리</h2><div class="tw"><table class="tb"><tr>{head}</tr>{rows}</table></div>{s.get("after", "")}</section>'


def outro(pg):
    return '<section id="outro"><h2>아웃트로</h2><div class="talk">' + ''.join(say(*t) for t in pg['outro']) + '</div></section>'


def kg_section():
    return '''<section class="level kg" id="kg"><h2>지식 색인 — 이 페이지에서 찾아보기</h2><input type="search" placeholder="개념·방법·용어 검색 (한글·영어)" aria-label="지식 색인 검색">
<div class="chips" role="group" aria-label="종류"></div><div class="list" aria-live="polite"></div><h3>미니 그래프</h3><canvas role="img" aria-label="이 페이지 개념 연결 그래프"></canvas>
<p class="stats glabel"></p><h3>배우는 순서</h3><div class="flowchips"></div><h3>열린 질문</h3><ul class="openq"></ul>
<div class="ctrl"><button type="button" class="bt" id="kg-json">JSON 내려받기</button><button type="button" class="bt" id="kg-mmd">Mermaid 내려받기</button><span class="glabel">전체 형식은 아래 꾸러미에서</span></div></section>'''


def export_section(pg):
    cite = f'안상선 (2026). {strip(pg["title"])}. ∇ 특별편 — 좌표축 위의 그릇. (주)M-Robo. {SITE}{pg["file"]}'
    refs = ''.join(f'<li>{E(r["title"])} — {E(r.get("publisher", ""))} <span class="stamp">{"확인" if r.get("checked") else "원자료 이미지"}</span></li>' for r in pg['refs'])
    return f'''<section class="level" id="export"><h2>온톨로지·서지 꾸러미</h2><h3>이 페이지 인용하기</h3><p id="cite-text">{E(cite)}</p>
<div class="ctrl"><button type="button" class="bt" id="cite-copy">인용 복사</button><button type="button" class="bt" id="bib-dl">BibTeX 내려받기</button><button type="button" class="bt primary" id="zip-all">꾸러미 ZIP 내려받기</button></div>
<h3>참고 자료</h3><ul>{refs}</ul><p class="glabel">ZIP 안: kg.json(원본) · kg.jsonld · kg.ttl · nodes.csv · edges.csv · kg.mmd · references.csl.json · references.bib · citation.txt</p></section>'''


def strip(s):
    return re.sub(r'<[^>]+>', '', s)


def footer(pg):
    i = [s[0] for s in SERIES].index(pg['file'])
    prev = f'<a href="{SERIES[i - 1][0]}">← {SERIES[i - 1][1]} {SERIES[i - 1][2]}</a>' if i > 0 else '<span></span>'
    nxt = f'<a href="{SERIES[i + 1][0]}">{SERIES[i + 1][1]} {SERIES[i + 1][2]} →</a>' if i + 1 < len(SERIES) else '<a href="index.html">목차로 →</a>'
    src = ''.join(f'<li>{E(r["title"])} · {E(r.get("publisher", ""))}</li>' for r in pg['refs'])
    return f'''<footer><div class="nextprev">{prev}{nxt}</div><p><b>출처</b></p><ul>{src}</ul>
<p><b>예시값·설명용 모형인 것:</b> {pg.get('models_note', '모든 실험 패널의 데이터와 그림은 식으로 계산한 설명용 모형입니다. 실제 측정 데이터가 아닙니다.')}</p>
<p>원자료 그림은 붙여 넣지 않고 구도와 기호를 살려 다시 그렸습니다. 원자료의 오류·기호 차이는 본문에 "바꿉니다"로 적었습니다.</p>
<p>{AUTHOR} · 시리즈: ∇ 특별편 (좌표축 위의 그릇) · 캐릭터 그림: fruitfly-lab-expressions</p></footer>'''


def kg_build(pg):
    page = pg['file'].replace('.html', '')
    N, Ed = [], []

    def node(i, t, ko, en, anchor=None, definition=None, level=None):
        n = {'id': i, 'type': t, 'label': {'ko': ko, 'en': en}, 'page': page, 'domain': ['ai'], 'status': 'known', 'confidence': 'high'}
        if anchor: n['anchor'] = anchor
        if definition: n['definition'] = {'ko': definition}
        if level: n['level'] = level
        n['family'] = 'optimization'
        N.append(n)
        return i

    def edge(s, p, o, anchor):
        Ed.append({'s': s, 'p': 'lab:' + p, 'o': o, 'anchor': anchor, 'confidence': 'high'})

    q = node(f'lab:question/{page}-core', 'Question', strip(pg['question']), pg.get('question_en', 'core question'), '#first')
    prev = None
    for k, r in enumerate(pg.get('rooms', [])):
        a = f'#room-{r["no"]}'
        c = node(r['kg_id'], r.get('kg_type', 'Concept'), strip(r['kg_ko']), r['kg_en'], a, strip(r['kg_def']), k + 1)
        edge(q, 'relatedTo', c, '#first') if k == 0 else None
        lim = node(f'lab:limitation/{r["kg_en"].lower().replace(" ", "-")}-limit', 'Limitation', strip(r['limit'])[:60], r['kg_en'] + ' limitation', a)
        edge(c, 'hasLimitation', lim, a)
        if prev: edge(prev[0], 'prerequisiteOf', c, a); edge(prev[1], 'addressedBy', c, a)
        sim = node(f'lab:simulation/{page}-{r["mod"]}', 'Simulation', '실험 · ' + strip(r['panel']), r['mod'] + ' simulation', f'#sim-{r["id"]}')
        edge(c, 'demonstratedBy', sim, f'#sim-{r["id"]}')
        an = node(f'lab:analogy/{page}-{r["no"]}', 'Analogy', strip(r['pair'][0])[:50], 'everyday analogy ' + str(r['no']), a)
        edge(an, 'analogyOf', c, a)
        for qi, qq in enumerate(pg['quiz'].get(f'q{r["no"]}', [])):
            qn = node(f'lab:quiz/{page}-{r["no"]}-{qi}', 'QuizItem', qq['q'][:50], f'quiz {r["no"]}-{qi}', a)
            edge(qn, 'assesses', c, a)
        prev = (c, lim)
    for term, (title, kind, d) in pg['gloss'].items():
        t = node('lab:term/' + re.sub(r'[^a-z0-9]+', '-', pg['gloss_en'].get(term, term).lower()).strip('-'), 'Term', term, pg['gloss_en'].get(term, term), None, d)
        tgt = next((r['kg_id'] for r in pg.get('rooms', []) if term in strip(r['lead'] + r['title'] + ''.join(r['explain']))), q)
        edge(t, 'relatedTo' if tgt == q else 'partOf', tgt, '#first')
    for i, r in enumerate(pg['refs']):
        w = node(f'lab:work/{r["id"]}', 'Work', r['title'], r['title'], None)
        tgt = next((rr['kg_id'] for rr in pg.get('rooms', []) if r['id'] in rr.get('src', [])), q)
        edge(tgt, 'relatedTo', w, '#export') if tgt == q else edge(w, 'supports', tgt, '#export')
    if pg.get('duel'):
        dq = node(f'lab:question/{page}-duel', 'Question', strip(pg['duel']['q'])[:70], 'duel question', '#duel')
        edge(q, 'raises', dq, '#duel')
    # 고립 노드 방지
    used = {e['s'] for e in Ed} | {e['o'] for e in Ed}
    for n in N:
        if n['id'] not in used: edge(n['id'], 'relatedTo', q, '#first')
    seen = set(); NN = []
    for n in N:
        if n['id'] in seen: n['id'] += '-' + str(len(seen))
        seen.add(n['id']); NN.append(n)
    raw = {'version': '1.0', 'page': page, 'nodes': NN, 'edges': Ed}
    ld = {'@context': {'skos': 'http://www.w3.org/2004/02/skos/core#', 'schema': 'https://schema.org/', 'dct': 'http://purl.org/dc/terms/', 'prov': 'http://www.w3.org/ns/prov#', 'lab': 'urn:lab:'},
          '@graph': [{'@id': n['id'].replace('lab:', 'urn:lab:'), '@type': 'skos:Concept' if n['type'] not in ('Work', 'QuizItem') else ('schema:CreativeWork' if n['type'] == 'Work' else 'schema:Question'),
                      'lab:type': n['type'], 'skos:prefLabel': [{'@value': n['label']['ko'], '@language': 'ko'}, {'@value': n['label']['en'], '@language': 'en'}]} for n in NN]}
    return raw, ld


def csl(pg):
    out = []
    for r in pg['refs']:
        out.append({'id': r['id'], 'type': 'webpage' if r.get('url') else 'graphic', 'title': r['title'], 'publisher': r.get('publisher', ''),
                    'author': [{'literal': r.get('author', r.get('publisher', ''))}], 'URL': r.get('url', ''), 'issued': {'date-parts': [[r.get('year', 2026)]]}, 'note': r.get('note', '')})
    return out


def sprites_for(htm, S, extra):
    pairs = set(re.findall(r'data-who="(\w+)" data-mood="(\w+)"', htm)) | set(extra)
    alias, im = S['alias'], S['img']
    out, al = {}, {}
    for w, m in pairs:
        k = f'{w}_{m}'
        kk = alias.get(k, k)
        if kk in im:
            out[kk] = im[kk]
            if kk != k: al[k] = kk
    return out, al


def render(pg, S, css, core, mods):
    body = []
    if pg.get('custom_body'):
        body.append(pg['custom_body'])
    else:
        body += [three(pg), castsec(pg), why(pg), bigpic(pg)]
        body += [room(r) for r in pg.get('rooms', [])]
        if pg.get('extra_after_rooms'): body.append(pg['extra_after_rooms'])
        body.append(aicheck(pg))
        if pg.get('duel'): body.append(duel(pg))
        body += [summary(pg), outro(pg)]
    body += [kg_section(), export_section(pg)]
    raw, ld = kg_build(pg)
    main = '\n'.join(body)
    hero = f'''<header class="hero" id="top"><div class="kicker">{E(pg['kicker'])}</div><h1>{pg['title']}</h1><p class="q">{pg['question']}</p><p>{pg['intro']}</p>
<div class="kpis">{''.join(f'<div class="kpi {c}"><b>{v}</b><span>{t}</span></div>' for c, v, t in pg['kpis'])}</div>{say(*pg['hero_say'])}{pg.get('hero_extra', '')}</header>'''
    duel_moods = [('fly', m) for m in ('point', 'arms', 'sigh', 'coffee', 'cry')] + [('robo', m) for m in ('coin', 'happy', 'meh', 'calc', 'sigh')]
    pre = nav(pg) + cover(pg) + '<main>' + hero + main + '</main>' + footer(pg)
    spr, al = sprites_for(pre, S, duel_moods if pg.get('duel') else [])
    quiz = json.dumps(pg['quiz'], ensure_ascii=False)
    gloss = json.dumps(pg['gloss'], ensure_ascii=False)
    core_terms = json.dumps(pg.get('gloss_core', list(pg['gloss'].keys())[:12]), ensure_ascii=False)
    duel_js = ''
    if pg.get('duel'):
        d = pg['duel']
        duel_js = f"Duel({{el:'#duelbox',run:function(){{{d['run']}}},report:function(f,b){{return {d['report']};}},lesson:{json.dumps(d['lesson'], ensure_ascii=False)},higherIsBetter:{str(d.get('higher', True)).lower()},drawMargin:{d.get('margin', 0.01)},unit:{json.dumps(d.get('unit', ''), ensure_ascii=False)}}});"
    title = strip(pg['title'])
    og = f'{SITE}assets/og/{pg["key"]}.jpg'
    return f'''<!DOCTYPE html><html lang="ko"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
<title>{E(title)} · ∇ 특별편</title><meta name="description" content="{E(strip(pg['intro']))[:150]}">
<meta property="og:title" content="{E(title)} · ∇ 특별편"><meta property="og:description" content="{E(strip(pg['question']))}"><meta property="og:image" content="{og}"><meta property="og:type" content="article">
<link rel="preconnect" href="https://fonts.googleapis.com"><link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=IBM+Plex+Sans+KR:wght@400;500;700&display=swap">
<style>{css}</style>
<script type="application/json" id="kg-raw">{json.dumps(raw, ensure_ascii=False)}</script>
<script type="application/ld+json" id="kg-ld">{json.dumps(ld, ensure_ascii=False)}</script>
<script type="application/json" id="refs-csl">{json.dumps(csl(pg), ensure_ascii=False)}</script>
</head><body>
{pre}
<script>var SPRITE={json.dumps(spr)};var LAB_ALIAS={json.dumps(al)};</script>
<script>{core}
{mods}
(function(){{Cast.fill();$$('[data-mod]').forEach(function(el){{var f=MODS[el.dataset.mod];if(f)f(el);}});
var g=Gloss({gloss},{core_terms});Study({quiz},g);{duel_js}KG();LOOP.start();{pg.get('page_js', '')}}})();</script>
</body></html>'''


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument('--sprites', required=True)
    ap.add_argument('--only', default='')
    a = ap.parse_args()
    S = json.load(open(a.sprites))
    css = open(os.path.join(TOOLS, 'lab.css')).read()
    core = open(os.path.join(TOOLS, 'lab_core.js')).read()
    mods = open(os.path.join(TOOLS, 'lab_mods.js')).read()
    names = [n for n in ['index', 'p00', 'p01', 'p02', 'p03', 'p04', 'p05', 'p06', 'p07'] if os.path.exists(os.path.join(TOOLS, 'content', n + '.py'))]
    if a.only: names = [n for n in names if n in a.only.split(',')]
    for n in names:
        pg = load(n)
        out = render(pg, S, css, core, mods)
        open(os.path.join(ROOT, pg['file']), 'w').write(out)
        print(f'{pg["file"]}: {len(out.encode()) // 1024} KB')


if __name__ == '__main__':
    main()
