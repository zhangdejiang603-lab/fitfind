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
    platform: "B站/抖音",
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
  // ======================== 背（拉日） ========================
  {
    id: "m-001",
    name: "高位下拉",
    part: "back",
    muscles: ["背阔肌", "大圆肌外延"],
    equipment: ["cable"],
    type: "compound",
    main: true,
    scheme: "4组×8–12次",
    days: ["pull"],
    tips: "向下发力不是向后；对握优先于正手；肩胛下沉带一点上回旋，别刻意后缩；先质量后重量",
    videos: [
      {
        blogger: "tanchengyi",
        title: "背训⑤：高位下拉（背阔肌外延）",
        url: "https://www.douyin.com/shipin/7605413792285657142",
        note: "抖音，该视频的第5个动作"
      },
      {
        blogger: "kaishengwang",
        title: "透视学动作④——正反高位下拉的区别",
        url: "https://www.bilibili.com/video/BV1zyAUztE1n",
        note: "B站，正手/对握/反手区别专讲",
        start: null
      }
    ]
  },
  {
    id: "m-007",
    name: "变式高位下拉（谭式首推主项）",
    part: "back",
    muscles: ["背阔肌"],
    equipment: ["cable", "machine"],
    type: "compound",
    main: true,
    scheme: "按视频讲解安排",
    days: ["pull"],
    tips: "谭成义明确说要作为主项练的变式；握法与幅度细节见视频",
    videos: [
      {
        blogger: "tanchengyi",
        title: "个人最推荐的变式高位下拉，一定要作为主项训练来",
        url: "https://www.bilibili.com/video/BV1dnkmBaEyo",
        note: "谭的原话：一定要作为主项",
        start: null
      },
      {
        blogger: "kaishengwang",
        title: "器械技巧系列4——Newtech高位下拉",
        url: "https://www.bilibili.com/video/BV1HVdpBMEET",
        note: "器械版变式的做法",
        start: null
      }
    ]
  },
  {
    id: "m-008",
    name: "坐姿绳索划船",
    part: "back",
    muscles: ["背阔肌", "中背"],
    equipment: ["cable"],
    type: "compound",
    main: true,
    scheme: "按视频讲解安排",
    days: ["pull"],
    tips: "视频里附带两个很重要的上肢热身动作，先热身后划船",
    videos: [
      {
        blogger: "tanchengyi",
        title: "焚决背部之坐姿绳索划船，以及两个很重要的上肢热身动作",
        url: "https://www.bilibili.com/video/BV1cK1aBBEBd",
        note: "",
        start: null
      }
    ]
  },
  {
    id: "m-009",
    name: "背部热身激活",
    part: "back",
    muscles: ["背部", "肩胛区域"],
    equipment: ["band", "bodyweight"],
    type: "warmup",
    main: false,
    scheme: "以充分激活为准",
    days: ["pull"],
    tips: "练背前的激活流程，背部训练的第一课",
    videos: [
      {
        blogger: "tanchengyi",
        title: "背部训练先从热身激活开始",
        url: "https://www.bilibili.com/video/BV19AxrzQEEH",
        note: "",
        start: null
      }
    ]
  },

  // ======================== 胸（推日） ========================
  {
    id: "m-010",
    name: "上斜卧推",
    part: "chest",
    muscles: ["上胸", "三角肌前束"],
    equipment: ["barbell", "dumbbell", "bench"],
    type: "compound",
    main: true,
    scheme: "按视频讲解安排",
    days: ["push"],
    tips: "视频前半是胸部热身激活，后半专讲上斜卧推的正确做法",
    videos: [
      {
        blogger: "tanchengyi",
        title: "胸部训练的热身激活训练以及上斜卧推的正确做法",
        url: "https://www.bilibili.com/video/BV1JHC5B2E6H",
        note: "热身+主项一条龙",
        start: null
      },
      {
        blogger: "kaishengwang",
        title: "凯圣王-谭成义三分化②——跟练胸肩三头",
        url: "https://www.bilibili.com/video/BV1CSoKBaEgK",
        note: "推日84分钟完整跟练，含卧推安排",
        start: null
      }
    ]
  },
  {
    id: "m-011",
    name: "蝴蝶机夹胸",
    part: "chest",
    muscles: ["胸大肌"],
    equipment: ["machine"],
    type: "isolation",
    main: false,
    scheme: "按视频讲解安排",
    days: ["push"],
    tips: "器械技巧系列19分钟专讲，含常见错误",
    videos: [
      {
        blogger: "kaishengwang",
        title: "器械技巧系列3——蝴蝶机夹胸",
        url: "https://www.bilibili.com/video/BV1W4X5B1EZE",
        note: "",
        start: null
      }
    ]
  },
  {
    id: "m-012",
    name: "卧推（腿驱技术）",
    part: "chest",
    muscles: ["胸大肌", "肱三头肌"],
    equipment: ["barbell"],
    type: "compound",
    main: true,
    scheme: "按视频讲解安排",
    days: ["push"],
    tips: "腿驱=把下肢力量传导进推起；凯圣王卧推系列第17期专讲",
    videos: [
      {
        blogger: "kaishengwang",
        title: "卧推系列⑰——腿驱",
        url: "https://www.bilibili.com/video/BV1Di6qB9EbC",
        note: "",
        start: null
      }
    ]
  },

  // ======================== 肩 ========================
  {
    id: "m-014",
    name: "肩后束训练",
    part: "shoulders",
    muscles: ["三角肌后束"],
    equipment: ["dumbbell", "cable"],
    type: "isolation",
    main: false,
    scheme: "按视频讲解安排",
    days: ["pull"],
    tips: "含肩后束热身动作；他的三分化里后束归拉日",
    videos: [
      {
        blogger: "tanchengyi",
        title: "焚决之肩后束训练以及热身动作教学",
        url: "https://www.bilibili.com/video/BV1FL2MBME3G",
        note: "",
        start: null
      }
    ]
  },
  {
    id: "m-015",
    name: "肩部整体训练",
    part: "shoulders",
    muscles: ["三角肌"],
    equipment: ["dumbbell"],
    type: "compound",
    main: false,
    scheme: "按视频讲解安排",
    days: ["push"],
    tips: "两期连看：入门操练版 + 细节加强版",
    videos: [
      {
        blogger: "tanchengyi",
        title: "肩部教学来喽，操练起来吧兄弟们",
        url: "https://www.bilibili.com/video/BV1LqJCz1EcE",
        note: "入门版",
        start: null
      },
      {
        blogger: "tanchengyi",
        title: "非常详细的肩部教学视频来喽，赶紧去练习吧",
        url: "https://www.bilibili.com/video/BV1utntzhE9a",
        note: "详细版",
        start: null
      }
    ]
  },

  // ======================== 腿（腿日） ========================
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
        note: "抖音，完整跟练课，含练腿前热身讲解"
      },
      {
        blogger: "tanchengyi",
        title: "根据不同的能力选择不同的深蹲模式",
        url: "https://www.bilibili.com/video/BV1jQsXzREf5",
        note: "B站，不同水平选哪种深蹲",
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
        note: "抖音，翘臀不粗腿的核心动作"
      },
      {
        blogger: "kaishengwang",
        title: "透视学动作③——罗马尼亚硬拉详解",
        url: "https://www.bilibili.com/video/BV1qF6wBaEWu",
        note: "B站专讲",
        start: null
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
        note: "抖音"
      },
      {
        blogger: "tanchengyi",
        title: "高效变式青蛙趴以及保加利亚蹲的两种模式",
        url: "https://www.bilibili.com/video/BV1mcsBzYE97",
        note: "B站，两种模式进阶",
        start: null
      }
    ]
  },
  {
    id: "m-013",
    name: "坐姿腿屈伸",
    part: "legs",
    muscles: ["股四头肌"],
    equipment: ["machine"],
    type: "isolation",
    main: false,
    scheme: "按视频讲解安排",
    days: ["legsday"],
    tips: "腿屈伸的三种模式，按能力进阶选择",
    videos: [
      {
        blogger: "tanchengyi",
        title: "腿部训练焚决来了，腿屈伸的三种模式教学",
        url: "https://www.bilibili.com/video/BV1BxxAzpEzH",
        note: "",
        start: null
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
        note: "抖音"
      }
    ]
  },

  // ======================== 核心 / 手臂 ========================
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
        note: "抖音，练腿日的腹部收尾"
      },
      {
        blogger: "tanchengyi",
        title: "缝匠肌以及悬垂举腿动作细节教学",
        url: "https://www.bilibili.com/video/BV177yUB3E3B",
        note: "B站，细节专讲",
        start: null
      }
    ]
  },
  {
    id: "m-016",
    name: "腹肌核心动作（他最推荐的两个）",
    part: "core",
    muscles: ["腹直肌"],
    equipment: ["bodyweight"],
    type: "isolation",
    main: false,
    scheme: "按视频讲解安排",
    days: ["full"],
    tips: "谭成义最推荐的两个腹肌动作，整套核心就靠它俩",
    videos: [
      {
        blogger: "tanchengyi",
        title: "最推荐的两个腹肌动作",
        url: "https://www.bilibili.com/video/BV1Ehn7zmEHN",
        note: "",
        start: null
      }
    ]
  },
  {
    id: "m-017",
    name: "手臂整体训练",
    part: "arms",
    muscles: ["肱二头肌", "肱三头肌"],
    equipment: ["dumbbell", "barbell"],
    type: "isolation",
    main: false,
    scheme: "按视频讲解安排",
    days: ["push", "pull"],
    tips: "手臂纯享版，推日拉日都能加",
    videos: [
      {
        blogger: "tanchengyi",
        title: "手臂纯享版教学视频来喽，赶紧练起来",
        url: "https://www.bilibili.com/video/BV1hyWwzeETh",
        note: "",
        start: null
      }
    ]
  }
];
