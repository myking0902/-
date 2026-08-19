/* =====================================================
   기본 데이터
===================================================== */
const heritageData = [
    {
        id: "h1",
        name: "춘천향교",
        region: "춘천",
        era: "조선",
        description: "조선시대 교육과 제례의 공간을 보여주는 문화유산입니다.",
        quiz: "춘천향교와 관련이 깊은 시대는?",
        options: ["조선", "고려", "삼국", "현대"],
        answer: 0
    },
    {
        id: "h2",
        name: "오죽헌",
        region: "강릉",
        era: "조선",
        description: "강릉의 역사와 조선시대 인물을 살펴볼 수 있는 문화유산입니다.",
        quiz: "오죽헌과 관련된 인물은?",
        options: ["이순신", "신사임당", "장보고", "김유신"],
        answer: 1
    },
    {
        id: "h3",
        name: "원주 강원감영",
        region: "원주",
        era: "조선",
        description: "조선시대 강원도의 행정 중심지였던 역사 공간입니다.",
        quiz: "강원감영의 주요 기능은?",
        options: ["행정", "항구", "광산", "공항"],
        answer: 0
    },
    {
        id: "h4",
        name: "근현대 지역유산",
        region: "춘천",
        era: "근현대",
        description: "지역의 근현대 생활과 산업의 흔적을 기록하는 예시 문화유산입니다.",
        quiz: "문화유산을 기록할 때 가장 중요한 태도는?",
        options: ["관찰과 기록", "추측", "과장", "훼손"],
        answer: 0
    }
];

/* =====================================================
   학교 클럽
===================================================== */
const clubs = [
    {
        id: "c1",
        name: "춘천고 역사탐험클럽",
        region: "춘천",
        missions: { visit: 24, quiz: 320, change: 18, report: 2, route: 8 }
    },
    {
        id: "c2",
        name: "강릉고 역사탐험클럽",
        region: "강릉",
        missions: { visit: 8, quiz: 120, change: 5, report: 1, route: 3 }
    },
    {
        id: "c3",
        name: "원주고 역사탐험클럽",
        region: "원주",
        missions: { visit: 15, quiz: 210, change: 12, report: 0, route: 5 }
    }
];

/* =====================================================
   배지
===================================================== */
const badges = [
    { id: "b1", icon: "🏆", name: "지역 완주자" },
    { id: "b2", icon: "🥇", name: "최초 등록자" },
    { id: "b3", icon: "📚", name: "역사 지식왕" },
    { id: "b4", icon: "📸", name: "사진 기록왕" },
    { id: "b5", icon: "🗺️", name: "지역 탐험가" },
    { id: "b6", icon: "🛡️", name: "문화유산 지킴이" },
    { id: "b7", icon: "⚔️", name: "조선 역사 탐험가" },
    { id: "b8", icon: "🧭", name: "첫 탐험" }
];

/* =====================================================
   탐험 루트
===================================================== */
const routes = [
    { id: "r1", name: "🏹 삼국시대의 흔적" },
    { id: "r2", name: "👑 왕조의 발자취" },
    { id: "r3", name: "🏘️ 옛 마을 사람들의 삶" },
    { id: "r4", name: "⚔️ 전쟁과 지역의 역사" },
    { id: "r5", name: "🚂 근현대사의 흔적" },
    { id: "r6", name: "🎨 지역 예술과 장인 문화" }
];

/* =====================================================
   저장 데이터
===================================================== */
let state = JSON.parse(localStorage.getItem("heritageGO")) || {
    nickname: "탐험가",
    points: 0,
    club: "c1",
    visits: {},
    quizzes: {},
    changes: [],
    reports: [],
    earnedBadges: ["b8"],
    selectedBadges: ["b8"],
    tab: "home"
};

function save() {
    localStorage.setItem("heritageGO", JSON.stringify(state));
}

function go(page) {
    state.tab = page;
    save();
    render();
}

/* =====================================================
   네비게이션
===================================================== */
function renderNavigation() {
    const pages = [
        ["home", "🏠 홈"],
        ["explore", "🗺️ 탐험"],
        ["roadmap", "🧭 탐험가"],
        ["collection", "📖 도감"],
        ["club", "🏫 클럽"],
        ["ranking", "🏆 랭킹"],
        ["profile", "👤 프로필"]
    ];

    document.getElementById("navigation").innerHTML = pages.map(page => `
        <button class="${state.tab === page[0] ? "active" : ""}" onclick="go('${page[0]}')">
            ${page[1]}
        </button>
    `).join("");
}

/* =====================================================
   등급 계산
===================================================== */
function getLevel() {
    const levels = [
        ["🌱", "문화유산 새싹", 0],
        ["🔎", "문화유산 탐험가", 100],
        ["🏛️", "역사 탐험가", 500],
        ["🏆", "문화유산 전문가", 1000],
        ["👑", "문화유산 마스터", 2000]
    ];

    let current = 0;
    levels.forEach((level, index) => {
        if (state.points >= level[2]) {
            current = index;
        }
    });

    return { levels, current };
}

/* =====================================================
   페이지 렌더링 함수들
===================================================== */
function homePage() {
    const level = getLevel();
    const current = level.levels[level.current];
    const next = level.levels[level.current + 1];

    let progress = 100;
    if (next) {
        progress = ((state.points - current[2]) / (next[2] - current[2])) * 100;
    }

    return `
        <section class="hero">
            <h1>🏛️ ${state.nickname}의 유산GO</h1>
            <p>문화유산을 발견하고, 배우고, 기록하는 역사 탐험</p>
            <h2>${current[0]} ${current[1]}</h2>
            <div class="progress">
                <div class="progress-bar" style="width:${Math.min(progress, 100)}%;"></div>
            </div>
            <p>${next ? `다음 등급까지 ${next[2] - state.points}P` : "최고 등급 달성!"}</p>
            <div class="actions">
                <button class="primary" onclick="go('explore')">🗺️ 탐험 시작</button>
                <button class="secondary" onclick="go('roadmap')">🧭 탐험가 여정</button>
            </div>
        </section>

        <div class="card-grid">
            <div class="card">
                <h3>📖 문화유산 도감</h3>
                <h2>${Object.keys(state.visits).length} / ${heritageData.length}</h2>
                <p class="muted">수집한 문화유산</p>
            </div>
            <div class="card">
                <h3>🏅 배지</h3>
                <h2>${state.earnedBadges.length}</h2>
                <p class="muted">획득한 배지</p>
            </div>
            <div class="card">
                <h3>🏫 나의 클럽</h3>
                <h3>${clubs.find(c => c.id === state.club).name}</h3>
            </div>
        </div>
    `;
}

function explorePage() {
    return `
        <h2>🗺️ 문화유산 탐험</h2>
        <p class="muted">방문한 문화유산을 사진으로 인증하고 역사 퀴즈에 도전하세요.</p>
        <div class="actions">
            <button class="primary" onclick="getLocation()">📍 내 위치 확인</button>
            <button class="secondary" onclick="openReport()">🔎 새로운 문화유산 제보</button>
        </div>
        <br>
        <div class="card-grid">
            ${heritageData.map(heritage => heritageCard(heritage)).join("")}
        </div>
    `;
}

function heritageCard(h) {
    const visit = state.visits[h.id];
    return `
        <div class="card">
            <h3>🏛️ ${h.name}</h3>
            <span class="tag">${h.region}</span>
            <span class="tag">${h.era}</span>
            <p>${h.description}</p>
            ${visit 
                ? `<p>📸 방문 기록 있음<br>재방문: ${visit.count}회</p>`
                : `<p class="muted">아직 방문하지 않았습니다.</p>`
            }
            <button class="primary" onclick="openHeritage('${h.id}')">상세 보기</button>
        </div>
    `;
}

function openHeritage(id) {
    const h = heritageData.find(x => x.id === id);
    openModal(`
        <h2>🏛️ ${h.name}</h2>
        <p>${h.description}</p>
        <span class="tag">${h.region}</span>
        <span class="tag">${h.era}</span>
        <hr>
        <h3>📸 방문 사진 인증</h3>
        <input id="visitPhoto" type="file" accept="image/*" capture="environment" onchange="previewPhoto(this, 'visitPreview')">
        <img id="visitPreview" class="photo-preview">
        <button class="primary" onclick="visitHeritage('${h.id}')">방문 인증</button>
        <hr>
        <h3>🧠 역사 퀴즈</h3>
        <p>${h.quiz}</p>
        ${h.options.map((option, index) => `
            <button class="quiz-option" onclick="answerQuiz('${h.id}', ${index})">
                ${option}
            </button>
        `).join("")}
        ${state.visits[h.id] ? `
            <hr>
            <button class="secondary" onclick="openChangeRecord('${h.id}')">🔄 변화 기록</button>
        ` : ""}
    `);
}

function previewPhoto(input, target) {
    if (input.files && input.files[0]) {
        const img = document.getElementById(target);
        img.src = URL.createObjectURL(input.files[0]);
        img.style.display = "block";
    }
}

function visitHeritage(id) {
    const input = document.getElementById("visitPhoto");
    if (!input.files || !input.files[0]) {
        toast("사진을 선택해주세요.");
        return;
    }

    const now = Date.now();
    const previous = state.visits[id];

    if (!previous) {
        state.visits[id] = { firstVisit: now, lastVisit: now, count: 1 };
        state.points += 10;
        toast("📸 방문 인증! +10P");
    } else {
        const days = (now - previous.lastVisit) / 86400000;
        if (days >= 7) {
            previous.lastVisit = now;
            previous.count++;
            state.points += 5;
            toast("🔄 7일 후 재방문! +5P");
        } else {
            toast("7일 이내 재방문입니다. 기록만 저장됩니다.");
        }
    }

    save();
    closeModal();
    checkBadges();
    render();
}

function answerQuiz(id, selected) {
    if (state.quizzes[id]) {
        toast("이미 보상을 받은 퀴즈입니다.");
        return;
    }

    const h = heritageData.find(x => x.id === id);
    if (selected === h.answer) {
        state.quizzes[id] = Date.now();
        state.points += 20;
        toast("🧠 정답! +20P");
        checkBadges();
        save();
        render();
    } else {
        toast("❌ 아쉽습니다. 다시 생각해보세요.");
    }
}

function roadmapPage() {
    const level = getLevel();
    return `
        <h2>🧭 나의 탐험 여정</h2>
        <p class="muted">위에서 아래로 내려가며 탐험가의 성장 과정을 확인하세요.</p>
        <div class="roadmap">
            ${level.levels.map((stage, index) => {
                let status = index < level.current ? "done" : (index === level.current ? "current" : "locked");
                return `
                    <div class="stage ${status}">
                        <div class="stage-icon">${stage[0]}</div>
                        <h3>Stage ${index + 1} · ${stage[1]}</h3>
                        <p>${stage[2]}P</p>
                        ${status === "done" ? "<b>✓ 달성</b>" : (status === "current" ? `<b>⭐ 현재 위치</b><p>현재 ${state.points}P</p>` : "<b>🔒 잠김</b>")}
                    </div>
                `;
            }).join("")}
        </div>
    `;
}

function collectionPage() {
    const collected = Object.keys(state.visits).length;
    return `
        <h2>📖 나의 문화유산 도감</h2>
        <p>수집률 ${Math.round((collected / heritageData.length) * 100)}%</p>
        <div class="progress">
            <div class="progress-bar" style="width:${(collected / heritageData.length) * 100}%"></div>
        </div>
        <br>
        <div class="card-grid">
            ${heritageData.map(h => {
                if (state.visits[h.id]) {
                    return `
                        <div class="card">
                            <h3>🏛️ ${h.name}</h3>
                            <span class="tag">${h.region}</span>
                            <p>${h.description}</p>
                        </div>
                    `;
                }
                return `
                    <div class="card" style="opacity:.55">
                        <h2>❔</h2>
                        <h3>미발견 문화유산</h3>
                        <p>방문하면 도감이 해금됩니다.</p>
                    </div>
                `;
            }).join("")}
        </div>
    `;
}

function clubPage() {
    const club = clubs.find(c => c.id === state.club);
    return `
        <h2>🏫 학교 클럽</h2>
        <div class="card">
            <h3>${club.name}</h3>
            <span class="tag">${club.region}</span>
            <h3>🎯 클럽 미션</h3>
            <p>🗺️ 우리 지역 문화유산 ${club.missions.visit}/30</p>
            <p>📚 역사 퀴즈 ${club.missions.quiz}/500</p>
            <p>📸 변화 기록 ${club.missions.change}/50</p>
            <p>🔎 신규 제보 ${club.missions.report}/5</p>
            <p>🏛️ 역사 루트 ${club.missions.route}/20</p>
        </div>
        <div class="card">
            <h3>🏫 클럽 변경</h3>
            <select onchange="changeClub(this.value)">
                ${clubs.map(c => `
                    <option value="${c.id}" ${c.id === state.club ? "selected" : ""}>
                        ${c.name}
                    </option>
                `).join("")}
            </select>
            <p class="muted">클럽을 변경해도 개인 포인트와 배지는 유지되며, 클럽 미션은 독립적으로 관리됩니다.</p>
        </div>
    `;
}

function changeClub(id) {
    if (id === state.club) return;
    const club = clubs.find(c => c.id === id);
    if (confirm(`${club.name}으로 변경할까요?`)) {
        state.club = id;
        save();
        render();
        toast(`🏫 ${club.name}으로 변경했습니다.`);
    }
}

function rankingPage() {
    return `
        <h2>🏆 랭킹</h2>
        <div class="card">
            <h3>👤 개인 랭킹</h3>
            <table>
                <tr><th>순위</th><th>탐험가</th><th>포인트</th></tr>
                <tr><td>🥇</td><td>${state.nickname}</td><td>${state.points}P</td></tr>
                <tr><td>🥈</td><td>역사친구</td><td>850P</td></tr>
                <tr><td>🥉</td><td>문화유산러</td><td>720P</td></tr>
            </table>
        </div>
        <br>
        <div class="card">
            <h3>🏫 학교 클럽 랭킹</h3>
            ${clubs.map((club, index) => `
                <p>${["🥇","🥈","🥉"][index] || "🏅"} ${club.name} — ${1000 - index * 150}P</p>
            `).join("")}
        </div>
    `;
}

function profilePage() {
    const level = getLevel();
    return `
        <h2>👤 ${state.nickname}</h2>
        <div class="card">
            <label>닉네임</label>
            <input id="nickname" value="${state.nickname}">
            <button class="primary" onclick="saveNickname()">저장</button>
            <hr>
            <p>현재 등급: ${level.levels[level.current][0]} ${level.levels[level.current][1]}</p>
            <p>🪙 ${state.points}P</p>
            <p>📸 방문 ${Object.keys(state.visits).length}곳</p>
            <p>🧠 퀴즈 ${Object.keys(state.quizzes).length}개</p>
        </div>

        <h3>🏅 나의 배지</h3>
        <div class="card-grid">
            ${badges.filter(badge => state.earnedBadges.includes(badge.id)).map(badge => `
                <div class="card">
                    <div class="badge-icon">${badge.icon}</div>
                    <h3>${badge.name}</h3>
                    <button class="${state.selectedBadges.includes(badge.id) ? "primary" : "secondary"}" onclick="toggleBadge('${badge.id}')">
                        ${state.selectedBadges.includes(badge.id) ? "⭐ 전시 중" : "프로필에 전시"}
                    </button>
                </div>
            `).join("")}
        </div>
        <br>
        <div class="card">
            <h3>🤖 AI 역사 도우미</h3>
            <p>문화유산에 대해 질문해보세요.</p>
            <input id="aiQuestion" placeholder="예: 이 문화유산은 왜 중요한가요?">
            <button class="primary" onclick="askAI()">질문하기</button>
            <div id="aiAnswer"></div>
        </div>
        <br>
        <button class="danger" onclick="resetApp()">데이터 초기화</button>
    `;
}

function saveNickname() {
    const input = document.getElementById("nickname");
    state.nickname = input.value.trim() || "탐험가";
    save();
    render();
    toast("닉네임이 저장되었습니다.");
}

function toggleBadge(id) {
    const index = state.selectedBadges.indexOf(id);
    if (index >= 0) {
        state.selectedBadges.splice(index, 1);
    } else {
        if (state.selectedBadges.length >= 6) {
            toast("대표 배지는 최대 6개입니다.");
            return;
        }
        state.selectedBadges.push(id);
    }
    save();
    render();
}

function openChangeRecord(id) {
    openModal(`
        <h2>🔄 문화유산 변화 기록</h2>
        <p>이전 방문 사진과 비교할 새로운 사진을 인증하세요.</p>
        <input id="changePhoto" type="file" accept="image/*" capture="environment" onchange="previewPhoto(this, 'changePreview')">
        <img id="changePreview" class="photo-preview">
        <select id="changeType">
            <option>주변 환경 변화</option>
            <option>안내판 변화</option>
            <option>시설물 변화</option>
            <option>보존 상태 변화</option>
            <option>특별한 변화 없음</option>
        </select>
        <textarea id="changeMemo" placeholder="직접 관찰한 사실을 기록하세요."></textarea>
        <button class="primary" onclick="saveChange('${id}')">변화 기록 저장</button>
    `);
}

function saveChange(id) {
    const photo = document.getElementById("changePhoto");
    if (!photo.files || !photo.files[0]) {
        toast("변화 기록 사진을 선택해주세요.");
        return;
    }

    const reader = new FileReader();
    reader.onload = function () {
        state.changes.push({
            heritageId: id,
            date: Date.now(),
            photo: reader.result,
            type: document.getElementById("changeType").value,
            memo: document.getElementById("changeMemo").value
        });
        save();
        closeModal();
        checkBadges();
        toast("🔄 변화 기록이 저장되었습니다.");
        render();
    };
    reader.readAsDataURL(photo.files[0]);
}

function openReport() {
    openModal(`
        <h2>🔎 새로운 문화유산 제보</h2>
        <input id="reportName" placeholder="문화유산 이름">
        <input id="reportLocation" placeholder="위치">
        <textarea id="reportDescription" placeholder="문화유산 설명"></textarea>
        <input id="reportPhoto" type="file" accept="image/*" capture="environment">
        <button class="primary" onclick="submitReport()">검토 요청</button>
    `);
}

function submitReport() {
    const name = document.getElementById("reportName").value.trim();
    if (!name) {
        toast("문화유산 이름을 입력해주세요.");
        return;
    }

    state.reports.push({
        name,
        location: document.getElementById("reportLocation").value,
        description: document.getElementById("reportDescription").value,
        status: "검토 대기",
        date: Date.now()
    });

    save();
    closeModal();
    toast("🔎 제보가 검토 대기 상태로 등록되었습니다.");
    render();
}

function getLocation() {
    if (!navigator.geolocation) {
        toast("이 브라우저는 위치 기능을 지원하지 않습니다.");
        return;
    }
    navigator.geolocation.getCurrentPosition(
        position => {
            toast(`📍 현재 위치: ${position.coords.latitude.toFixed(3)}, ${position.coords.longitude.toFixed(3)}`);
        },
        () => { toast("위치 권한을 허용해주세요."); }
    );
}

function askAI() {
    const question = document.getElementById("aiQuestion").value.trim();
    const answer = document.getElementById("aiAnswer");
    if (!question) {
        answer.innerHTML = "<p>질문을 입력해주세요.</p>";
        return;
    }
    answer.innerHTML = `
        <div class="card">
            <h4>🤖 역사 도우미</h4>
            <p>질문: ${question}</p>
            <p>API를 연결하면 실제 AI 답변을 받을 수 있습니다.</p>
        </div>
    `;
}

function checkBadges() {
    const visited = Object.keys(state.visits).length;
    const quizzes = Object.keys(state.quizzes).length;
    const changes = state.changes.length;

    const addBadge = function (id) {
        if (!state.earnedBadges.includes(id)) {
            state.earnedBadges.push(id);
            toast("🏅 새로운 배지를 획득했습니다!");
        }
    };

    if (visited >= 1) addBadge("b8");
    if (visited >= 3) addBadge("b5");
    if (quizzes >= 5) addBadge("b3");
    if (changes >= 3) addBadge("b6");

    const joseon = heritageData.filter(h => h.era === "조선" && state.visits[h.id]).length;
    if (joseon >= 2) addBadge("b7");

    if (state.selectedBadges.length > 6) {
        state.selectedBadges = state.selectedBadges.slice(0, 6);
    }
    save();
}

/* =====================================================
   공통 모달 & 토스트 & 초기화
===================================================== */
function openModal(html) {
    document.getElementById("modalContent").innerHTML = html;
    document.getElementById("modal").classList.add("show");
}

function closeModal() {
    document.getElementById("modal").classList.remove("show");
}

function toast(message) {
    const element = document.getElementById("toast");
    element.textContent = message;
    element.classList.add("show");
    setTimeout(() => element.classList.remove("show"), 2000);
}

function resetApp() {
    if (!confirm("유산GO 테스트 데이터를 모두 초기화할까요?")) return;
    localStorage.removeItem("heritageGO");
    location.reload();
}

/* =====================================================
   메인 렌더링
===================================================== */
function render() {
    renderNavigation();
    document.getElementById("points").textContent = state.points;

    const pages = {
        home: homePage,
        explore: explorePage,
        roadmap: roadmapPage,
        collection: collectionPage,
        club: clubPage,
        ranking: rankingPage,
        profile: profilePage
    };

    document.getElementById("content").innerHTML = pages[state.tab]();
    checkBadges();
}

render();
