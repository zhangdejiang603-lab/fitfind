// ============================================================
// 数据文件 —— 这是你以后主要维护的文件（配合 admin.html 生成）
//
// 四套数据：
//   BLOGGERS:   博主列表
//   PARTS:      大部位表（一个动作归一个大部位）
//   EQUIPMENT:  器械表
//   MOVE_TYPES: 动作类型表（正式/热身/拉伸）
//   DAYS:       训练日表（推/拉/腿）
//   MOVES:      动作库 —— 核心数据，每个动作挂若干讲解视频
//
// 设计思路（v0.2 动作库结构）：
//   你在健身房想的是"高位下拉怎么做"，而不是"某条视频"。
//   所以以动作为中心：动作上挂组数、要点、器械，
//   视频只是"证据"，同一动作可挂多个博主的讲解。
//
// videos 条目字段：
//   blogger: 博主 id（对应 BLOGGERS）
//   title:   视频标题
//   url:     链接
//   note:    备注（可留空 ""）
//   start:   该动作在视频里的开始时间（秒，选填 null）
//            ——B 站/YouTube 链接会自动从此处播放；
//              抖音不支持链接跳时间，卡片显示「▶ 3:25」手动拖过去
// ============================================================

const BLOGGERS = [
  {
    id: "tanchengyi",
    name: "谭成义",
    platform: "抖音",
    color: "#ff6b35"
  },
  {
    id: "kaishengwang",
    name: "凯圣王",
    platform: "B站",
    color: "#4dabf7"
  }
];

const PARTS = {
  chest: "胸",
  back: "背",
  shoulders: "肩",
  arms: "手臂",
  legs: "腿",
  glutes: "臀",
  core: "核心",
  full: "全身"
};

const EQUIPMENT = {
  barbell: "杠铃",
  dumbbell: "哑铃",
  cable: "绳索/钢线",
  machine: "固定器械",
  kettlebell: "壶铃",
  band: "弹力带",
  bodyweight: "徒手",
  foamroller: "泡沫轴",
  bench: "凳/训练凳",
  other: "其它"
};

const MOVE_TYPES = {
  compound: "正式·多关节",
  isolation: "正式·单关节",
  warmup: "热身激活",
  stretch: "拉伸放松"
};

const DAYS = {
  push: "推日",
  pull: "拉日",
  legsday: "腿日",
  full: "全身/其他"
};

const MOVES = [
  {
    id: "m-001",
    name: "高位下拉",
    part: "back",                     // 大部位代码，单选
    muscles: ["背阔肌", "大圆肌外延"],  // 细分肌肉，自由填写
    equipment: ["cable"],             // 器械代码，可多选
    type: "compound",                 // 类型代码，单选
    main: true,                       // 是否主项
    scheme: "4组×8–12次",             // 组数次数
    days: ["pull"],                   // 出现在哪些训练日
    tips: "下拉是向下发力、不是向后；肩胛骨被动下沉；先质量后重量",
    videos: [
      {
        blogger: "tanchengyi",
        title: "背训⑤：高位下拉（背阔肌外延）",
        url: "https://www.douyin.com/shipin/7605413792285657142",
        note: "该视频的第5个动作"
      },
      {
        blogger: "kaishengwang",
        title: "透视学动作④——正反高位下拉的区别",
        url: "https://www.bilibili.com/video/BV1zyAUztE1n",
        note: "凯圣王×谭成义联名系列，B站专讲",
        start: null
      }
    ]
  },
  {
    id: "m-002",
    name: "杠铃颈后深蹲（高杠）",
    part: "legs",
    muscles: ["股四头肌", "臀部"],
    equipment: ["barbell"],
    type: "compound",
    main: true,
    scheme: "4组×8–10次",
    days: ["legsday"],
    tips: "扛铃放在斜方肌上、不是颈椎；先屈髋找“坐凳子”感，膝盖顺脚尖方向，手肘主动下压",
    videos: [
      {
        blogger: "tanchengyi",
        title: "三分化⑤跟练：腿（股四头肌+腘绳肌）",
        url: "https://www.douyin.com/shipin/7627299540386973731",
        note: "完整跟练课，含练腿前热身讲解"
      },
      {
        blogger: "kaishengwang",
        title: "透视学动作③——罗马尼亚硬拉详解",
        url: "https://www.bilibili.com/video/BV1qF6wBaEWu",
        note: "凯圣王×谭成义联名系列，B站专讲",
        start: null
      }
    ]
  },
  {
    id: "m-003",
    name: "罗马尼亚硬拉",
    part: "legs",
    muscles: ["臀部", "腘绳肌"],
    equipment: ["barbell", "dumbbell"],
    type: "compound",
    main: false,
    scheme: "4组×10–12次",
    days: ["legsday"],
    tips: "微屈膝锁定；臀部往后平移主导，杠铃贴小腿走；离心越慢臀越圆；别弓背",
    videos: [
      {
        blogger: "tanchengyi",
        title: "三分化⑤跟练：腿（股四头肌+腘绳肌）",
        url: "https://www.douyin.com/shipin/7627299540386973731",
        note: "翘臀不粗腿的核心动作"
      }
    ]
  },
  {
    id: "m-004",
    name: "保加利亚分腿蹲",
    part: "legs",
    muscles: ["臀大肌", "股四头肌"],
    equipment: ["dumbbell", "bench"],
    type: "compound",
    main: false,
    scheme: "3组×每侧10次",
    days: ["legsday"],
    tips: "后脚搭凳，上身前倾约15°，重心压前脚跟外侧；想着用臀把上半身顶起来",
    videos: [
      {
        blogger: "tanchengyi",
        title: "三分化⑤跟练：腿（股四头肌+腘绳肌）",
        url: "https://www.douyin.com/shipin/7627299540386973731",
        note: ""
      }
    ]
  },
  {
    id: "m-005",
    name: "坐姿腿弯举",
    part: "legs",
    muscles: ["腘绳肌"],
    equipment: ["machine"],
    type: "isolation",
    main: false,
    scheme: "3组×12–15次",
    days: ["legsday"],
    tips: "顶峰收缩停1秒，想象脚跟夹一张纸",
    videos: [
      {
        blogger: "tanchengyi",
        title: "三分化⑤跟练：腿（股四头肌+腘绳肌）",
        url: "https://www.douyin.com/shipin/7627299540386973731",
        note: ""
      }
    ]
  },
  {
    id: "m-006",
    name: "悬垂举腿",
    part: "core",
    muscles: ["腹直肌", "屈髋肌群"],
    equipment: ["bodyweight"],
    type: "isolation",
    main: false,
    scheme: "3组×力竭",
    days: ["legsday"],
    tips: "骨盆后倾+卷腹，把腿“卷”起来，别靠惯性；没力了做屈膝版，质量永远第一",
    videos: [
      {
        blogger: "tanchengyi",
        title: "三分化⑤跟练：腿（股四头肌+腘绳肌）",
        url: "https://www.douyin.com/shipin/7627299540386973731",
        note: "练腿日的腹部收尾"
      }
    ]
  }
];
