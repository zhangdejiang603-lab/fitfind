// ============================================================
// 主应用逻辑 v0.2（index.html 用）
// 界面仍然是「数据驱动」的：data.js 里的表加了新条目，
// 按钮和筛选项自动出现，这里不用改。
// ============================================================

const state = {
  parts: new Set(),      // 选中的大部位
  equipment: new Set(),  // 选中的器械
  types: new Set(),      // 选中的动作类型
  days: new Set(),       // 选中的训练日
  blogger: "all",
  q: "",
  mainOnly: false,       // 只看主项
  favOnly: false,
  hideDone: false        // 隐藏已练
};

// 收藏 / 已练：存在本机浏览器（localStorage），不随数据文件走
const store = {
  load(key) {
    try { return new Set(JSON.parse(localStorage.getItem(key) || "[]")); }
    catch (e) { return new Set(); }
  },
  save(key, val) { localStorage.setItem(key, JSON.stringify([...val])); }
};
let favs = store.load("fitmv_favs");
let done = store.load("fitmv_done");

const bloggerOf = id => BLOGGERS.find(b => b.id === id) || { name: id, color: "#888" };
const esc = s => String(s).replace(/[&<>"']/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));

// 秒 -> "3:25" 格式
const formatTime = sec => `${Math.floor(sec / 60)}:${String(sec % 60).padStart(2, "0")}`;

// 平台适配：能跳时间的平台自动加参数，不能的（抖音）返回原链接
// 数据里记了时间点，将来博主开了 B 站，链接自动获得精准跳转能力
function videoUrlWithStart(url, start) {
  if (!start) return url;
  try {
    const u = new URL(url);
    const host = u.hostname;
    if (host.includes("bilibili.com") || host === "youtu.be" || host.includes("youtube.com")) {
      u.searchParams.set("t", start);
      return u.toString();
    }
    // 抖音网页版不支持时间点参数，只能手动拖（卡片上会显示目标时间）
    return url;
  } catch (e) {
    return url;
  }
}

// ---------- 生成筛选按钮 ----------
function buildChips(containerId, obj, stateSet) {
  const box = document.getElementById(containerId);
  box.innerHTML = "";
  for (const [code, label] of Object.entries(obj)) {
    const btn = document.createElement("button");
    btn.className = "chip" + (stateSet.has(code) ? " active" : "");
    btn.textContent = label;
    btn.onclick = () => {
      stateSet.has(code) ? stateSet.delete(code) : stateSet.add(code);
      btn.classList.toggle("active");
      renderList();
    };
    box.appendChild(btn);
  }
}

function buildBloggerChips() {
  const box = document.getElementById("bloggerChips");
  box.innerHTML = "";
  const all = [{ id: "all", name: "全部博主" }, ...BLOGGERS];
  for (const b of all) {
    const btn = document.createElement("button");
    btn.className = "chip" + (state.blogger === b.id ? " active" : "");
    btn.textContent = b.name;
    btn.onclick = () => {
      state.blogger = b.id;
      buildBloggerChips();
      renderList();
    };
    box.appendChild(btn);
  }
}

// ---------- 筛选逻辑 ----------
function match(m) {
  if (state.blogger !== "all" && !m.videos.some(v => v.blogger === state.blogger)) return false;
  if (state.parts.size && !state.parts.has(m.part)) return false;
  if (state.equipment.size && !m.equipment.some(e => state.equipment.has(e))) return false;
  if (state.types.size && !state.types.has(m.type)) return false;
  if (state.days.size && !m.days.some(d => state.days.has(d))) return false;
  if (state.mainOnly && !m.main) return false;
  if (state.favOnly && !favs.has(m.id)) return false;
  if (state.hideDone && done.has(m.id)) return false;
  if (state.q) {
    const hay = [m.name, m.scheme, m.tips, ...m.muscles, ...m.videos.map(v => v.title)]
      .join(" ").toLowerCase();
    if (!hay.includes(state.q.toLowerCase())) return false;
  }
  return true;
}

// ---------- 排序：先按类型（正式->热身->拉伸），同类型里主项排前面 ----------
const TYPE_RANK = { compound: 0, isolation: 1, warmup: 2, stretch: 3 };
function sortMoves(list) {
  list.sort((a, b) => {
    const ra = (TYPE_RANK[a.type] ?? 9) * 2 + (a.main ? 0 : 1);
    const rb = (TYPE_RANK[b.type] ?? 9) * 2 + (b.main ? 0 : 1);
    return ra - rb;
  });
}

// ---------- 渲染动作卡片 ----------
function cardHtml(m) {
  // 五种标签用五个 class，样式在 style.css 里严格区分
  const tags = [
    `<span class="tag part">${esc(PARTS[m.part] || m.part)}</span>`,
    ...m.equipment.map(e => `<span class="tag equip">${esc(EQUIPMENT[e] || e)}</span>`),
    `<span class="tag type">${esc(MOVE_TYPES[m.type] || m.type)}</span>`,
    ...m.days.map(d => `<span class="tag day">${esc(DAYS[d] || d)}</span>`)
  ].join("");

  const videoRows = m.videos.length
    ? m.videos.map(v => {
        const b = bloggerOf(v.blogger);
        // start 有值时显示"▶ 3:25"徽章；链接经 videoUrlWithStart 处理（抖音原样，B站/油管自动跳）
        const timeBadge = v.start ? `<span class="v-time">▶ ${formatTime(v.start)}</span>` : "";
        return `
        <div class="video-row">
          <span class="v-title"><span class="dot" style="background:${b.color}"></span><b>${esc(b.name)}</b> · ${esc(v.title)}${v.note ? `<span class="v-note">${esc(v.note)}</span>` : ""}${timeBadge}</span>
          <a class="v-open" href="${esc(videoUrlWithStart(v.url, v.start))}" target="_blank" rel="noopener">打开 ↗</a>
        </div>`;
      }).join("")
    : `<div class="video-row"><span class="v-title muted">还没挂讲解视频</span></div>`;

  return `
  <article class="card${done.has(m.id) ? " watched" : ""}" data-id="${esc(m.id)}">
    <div class="card-head">
      <h3>${esc(m.name)}${m.main ? '<span class="badge">主项</span>' : ""}</h3>
      <div class="acts">
        <button class="icon-btn fav${favs.has(m.id) ? " on" : ""}" data-action="fav" title="收藏">★</button>
        <button class="icon-btn done-btn${done.has(m.id) ? " on" : ""}" data-action="done" title="标记已练">✓</button>
      </div>
    </div>
    <p class="muscles">目标：${m.muscles.map(esc).join(" · ")}</p>
    <div class="tags">${tags}</div>
    <p class="scheme">安排 ${esc(m.scheme)}</p>
    <p class="note">${esc(m.tips)}</p>
    <div class="videos">${videoRows}</div>
  </article>`;
}

function renderList() {
  const list = document.getElementById("list");
  const matched = MOVES.filter(match);
  sortMoves(matched);
  document.getElementById("count").textContent = `共 ${matched.length} 个动作`;
  document.getElementById("empty").hidden = matched.length > 0;
  list.innerHTML = matched.map(cardHtml).join("");
}

// ---------- 卡片按钮（收藏 / 已练），事件委托 ----------
document.getElementById("list").addEventListener("click", e => {
  const btn = e.target.closest("button[data-action]");
  if (!btn) return;
  const id = btn.closest(".card").dataset.id;
  if (btn.dataset.action === "fav") {
    favs.has(id) ? favs.delete(id) : favs.add(id);
    store.save("fitmv_favs", favs);
  } else {
    done.has(id) ? done.delete(id) : done.add(id);
    store.save("fitmv_done", done);
  }
  renderList();
});

// ---------- 搜索 & 开关 ----------
document.getElementById("q").addEventListener("input", e => {
  state.q = e.target.value.trim();
  renderList();
});
function bindToggle(id, key) {
  document.getElementById(id).onclick = e => {
    state[key] = !state[key];
    e.target.classList.toggle("active", state[key]);
    renderList();
  };
}
bindToggle("mainOnly", "mainOnly");
bindToggle("favOnly", "favOnly");
bindToggle("hideDone", "hideDone");

document.getElementById("clearFilters").onclick = () => {
  state.parts.clear(); state.equipment.clear();
  state.types.clear(); state.days.clear();
  state.blogger = "all"; state.q = "";
  state.mainOnly = false; state.favOnly = false; state.hideDone = false;
  document.getElementById("q").value = "";
  ["mainOnly", "favOnly", "hideDone"].forEach(i => document.getElementById(i).classList.remove("active"));
  buildChips("partChips", PARTS, state.parts);
  buildChips("equipChips", EQUIPMENT, state.equipment);
  buildChips("typeChips", MOVE_TYPES, state.types);
  buildChips("dayChips", DAYS, state.days);
  buildBloggerChips();
  renderList();
};

// ---------- 启动 ----------
buildChips("partChips", PARTS, state.parts);
buildChips("equipChips", EQUIPMENT, state.equipment);
buildChips("typeChips", MOVE_TYPES, state.types);
buildChips("dayChips", DAYS, state.days);
buildBloggerChips();
renderList();
