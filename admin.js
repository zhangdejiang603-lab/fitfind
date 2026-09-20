// ============================================================
// 录入工具逻辑 v0.2（admin.html 用）
// 浏览器不能替你改磁盘上的文件，所以：内存里改数据 →
// 生成完整的新 data.js → 你下载回去覆盖。托管上线后同样流程。
// ============================================================

let bloggers = JSON.parse(JSON.stringify(BLOGGERS));
let moves = JSON.parse(JSON.stringify(MOVES));

const $ = id => document.getElementById(id);
const showWarn = (el, msg) => { el.textContent = msg; el.hidden = !msg; };

// ---------- 初始化 ----------
function refreshStat() {
  const videoCount = moves.reduce((n, m) => n + m.videos.length, 0);
  $("stat").textContent = `${bloggers.length} 位博主 / ${moves.length} 个动作 / ${videoCount} 条视频`;
}
function fillSelects() {
  $("vBlogger").innerHTML = bloggers
    .map(b => `<option value="${b.id}">${b.name}（${b.platform}）</option>`).join("");
  $("vMove").innerHTML = moves
    .map(m => `<option value="${m.id}">${m.name}（${PARTS[m.part]}）</option>`).join("");
}
// radio 组（单选）和 checkbox 组（多选）都复用 .checks 样式
function buildChecks(containerId, obj, name, type) {
  $(containerId).innerHTML = Object.entries(obj)
    .map(([code, label]) =>
      `<label><input type="${type}" name="${name}" value="${code}">${label}</label>`)
    .join("");
}
function getChecked(name) {
  return [...document.querySelectorAll(`input[name="${name}"]:checked`)].map(i => i.value);
}
function getRadio(name) {
  const el = document.querySelector(`input[name="${name}"]:checked`);
  return el ? el.value : "";
}

// ---------- ① 新建动作 ----------
function nextMoveId() {
  let max = 0;
  for (const m of moves) {
    const n = parseInt(m.id.replace(/\D/g, ""), 10);
    if (!isNaN(n)) max = Math.max(max, n);
  }
  return "m-" + String(max + 1).padStart(3, "0");
}

$("addMoveBtn").onclick = () => {
  const name = $("mName").value.trim();
  const part = getRadio("part");
  const muscles = $("mMuscles").value.split(/[,，、\s]+/).map(s => s.trim()).filter(Boolean);
  const equipment = getChecked("equip");
  const type = getRadio("mtype");
  const main = $("mMain").checked;
  const scheme = $("mScheme").value.trim();
  const days = getChecked("days");
  const tips = $("mTips").value.trim();
  const warn = $("moveWarn");

  if (!name) return showWarn(warn, "动作名还没填");
  if (!part) return showWarn(warn, "选一个大部位");
  if (!type) return showWarn(warn, "选一个动作类型");
  if (moves.some(m => m.name === name)) return showWarn(warn, "库里已有同名动作，直接去第二步给它挂视频");
  showWarn(warn, "");

  moves.push({
    id: nextMoveId(), name, part, muscles, equipment,
    type, main, scheme: scheme || "按动作说明练习",
    days, tips: tips || "", videos: []
  });

  // 清表单，准备下一条
  $("mName").value = ""; $("mMuscles").value = ""; $("mScheme").value = ""; $("mTips").value = "";
  $("mMain").checked = false;
  document.querySelectorAll("input[name=part], input[name=equip], input[name=mtype], input[name=days]")
    .forEach(i => i.checked = false);
  refreshStat(); fillSelects(); renderOutput();
  $("okMsg").hidden = false;
};

// ---------- ② 挂视频 ----------
$("extractBtn").onclick = () => {
  const text = $("shareText").value;
  const m = text.match(/https?:\/\/[^\s"'，。；）)]+/);
  if (m) {
    $("vUrl").value = m[0];
    if (!$("vTitle").value) {
      $("vTitle").value = text.replace(/https?:\/\/\S+/g, "").replace(/[「」【】#\s]+/g, " ").trim().slice(0, 40);
    }
    showWarn($("videoWarn"), "");
  } else {
    showWarn($("videoWarn"), "没识别到链接，请检查粘贴内容是否完整");
  }
};

// 把 "3:25" 或 "205" 解析成秒；空串返回 null；非法返回 undefined
function parseStart(str) {
  str = (str || "").trim();
  if (!str) return null;
  const m = str.match(/^(\d+):([0-5]?\d)$/);   // 3:25
  if (m) return parseInt(m[1], 10) * 60 + parseInt(m[2], 10);
  if (/^\d+$/.test(str)) return parseInt(str, 10); // 纯秒数
  return undefined;
}

$("addVideoBtn").onclick = () => {
  const moveId = $("vMove").value;
  const blogger = $("vBlogger").value;
  const title = $("vTitle").value.trim();
  const url = $("vUrl").value.trim();
  const note = $("vNote").value.trim();
  const start = parseStart($("vStart").value);
  const warn = $("videoWarn");

  if (!moveId) return showWarn(warn, "库里还没有动作，请先在第一步新建");
  if (!title) return showWarn(warn, "视频标题还没填");
  if (!/^https?:\/\/.+/.test(url)) return showWarn(warn, "链接格式不对，应以 http:// 或 https:// 开头");
  if (start === undefined) return showWarn(warn, "开始时间格式不对，例：3:25 或 205（秒）");

  const move = moves.find(m => m.id === moveId);
  // 同一条视频挂到同一动作下才算重复；挂到不同动作是允许的（跟练课会覆盖多个动作）
  if (move.videos.some(v => v.url === url)) return showWarn(warn, "这条视频已经挂在这个动作下了");

  move.videos.push({ blogger, title, url, note, start });
  $("vTitle").value = ""; $("vUrl").value = ""; $("vNote").value = ""; $("vStart").value = ""; $("shareText").value = "";
  showWarn(warn, "");
  refreshStat(); renderOutput();
  $("okMsg").hidden = false;
};

// ---------- ③ 导出完整 data.js ----------
function dataJsText() {
  return "// 本文件由 admin.html 生成，可直接整体覆盖项目里的 data.js\n"
    + "// BLOGGERS=博主  PARTS=大部位  EQUIPMENT=器械  MOVE_TYPES=类型  DAYS=训练日  MOVES=动作库\n\n"
    + "const BLOGGERS = " + JSON.stringify(bloggers, null, 2) + ";\n\n"
    + "const PARTS = " + JSON.stringify(PARTS, null, 2) + ";\n\n"
    + "const EQUIPMENT = " + JSON.stringify(EQUIPMENT, null, 2) + ";\n\n"
    + "const MOVE_TYPES = " + JSON.stringify(MOVE_TYPES, null, 2) + ";\n\n"
    + "const DAYS = " + JSON.stringify(DAYS, null, 2) + ";\n\n"
    + "const MOVES = " + JSON.stringify(moves, null, 2) + ";\n";
}
function renderOutput() { $("out").value = dataJsText(); }

$("downloadBtn").onclick = () => {
  const blob = new Blob([dataJsText()], { type: "text/javascript" });
  const a = document.createElement("a");
  a.href = URL.createObjectURL(blob);
  a.download = "data.js";
  a.click();
  URL.revokeObjectURL(a.href);
};

// ---------- 添加新博主 ----------
$("addBloggerBtn").onclick = () => {
  const id = $("bId").value.trim().toLowerCase();
  const name = $("bName").value.trim();
  const platform = $("bPlatform").value.trim() || "抖音";
  const warn = $("bWarn");

  if (!/^[a-z][a-z0-9-]*$/.test(id)) return showWarn(warn, "英文 id 只能用小写字母、数字、横线，且以字母开头");
  if (!name) return showWarn(warn, "显示名还没填");
  if (bloggers.some(b => b.id === id)) return showWarn(warn, "这个 id 已经存在");

  const palette = ["#ff6b35", "#4dabf7", "#69db7c", "#ffd43b", "#b197fc", "#f783ac"];
  bloggers.push({ id, name, platform, color: palette[bloggers.length % palette.length] });

  $("bId").value = ""; $("bName").value = ""; $("bPlatform").value = "";
  showWarn(warn, "");
  refreshStat(); fillSelects(); renderOutput();
};

// ---------- 启动 ----------
refreshStat();
fillSelects();
buildChecks("mPart", PARTS, "part", "radio");
buildChecks("mEquip", EQUIPMENT, "equip", "checkbox");
buildChecks("mType", MOVE_TYPES, "mtype", "radio");
buildChecks("mDays", DAYS, "days", "checkbox");
renderOutput();
