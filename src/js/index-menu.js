(() => {
  const cards = [
    {
      title: "Daily Insights · 每日洞见",
      href: "daily-insights.html",
      icon: "✨",
      badge: "🆕 全新发布",
      featured: true,
      theme: ["#8b5cf6", "#ec4899"],
      description:
        "融合中国生肖、西方星座和二十四节气的个性化指导系统。面向海外用户，提供可执行的每日建议，覆盖事业、学业、财富、感情、健康、心态 6 大领域。",
      features: ["🌟 个性化", "🎯 可执行建议", "🌏 文化融合", "✨ 每日更新", "🔮 古老智慧", "🌈 现代科技"],
      cta: "✨ 获取洞见",
      stats: [
        { value: "3,456", label: "独特组合" },
        { value: "6", label: "关注领域" },
        { value: "24", label: "建议模板/领域" },
      ],
    },
    {
      title: "钢铁前线 · 像素坦克大战",
      href: "tank-battle-pixel.html",
      icon: "🎮",
      badge: "⭐ 全新发布",
      featured: true,
      theme: ["#ff6b35", "#f7931e"],
      description:
        "回归简约街机本质的坦克大战版本。像素风主战场、纯原生 JavaScript、基地防守与轻量 AI，同样能打出足够紧张的战斗节奏。",
      features: ["🎯 基地防守", "🧱 可破坏地形", "👾 像素风格", "🤖 轻量 AI", "⌨️ 键盘即玩", "🪶 简洁实现"],
      cta: "🎮 开始游戏",
      stats: [
        { value: "1", label: "核心战场" },
        { value: "60 FPS", label: "流畅运行" },
        { value: "0", label: "外部依赖" },
      ],
    },
    {
      title: "贪吃蛇",
      href: "snake_game.html",
      icon: "🐍",
      theme: ["#06ffa5", "#00b277"],
      description: "经典贪吃蛇游戏，简洁优雅的设计，流畅的操作体验。",
      features: ["经典玩法", "高分记录"],
      cta: "🎮 开始游戏",
    },
    {
      title: "恐龙像素百科",
      href: "dino-pixel-encyclopedia.html",
      icon: "🦖",
      theme: ["#4ecdc4", "#2a9d8f"],
      description: "互动式恐龙百科全书，精美的像素艺术，丰富的恐龙知识。",
      features: ["像素风格", "知识学习"],
      cta: "📖 浏览百科",
    },
    {
      title: "像素武器库",
      href: "armory-pixel-arsenal.html",
      icon: "🔫",
      theme: ["#718dff", "#4361ee"],
      description: "展示各种像素风格武器，炫酷的视觉效果，详细的武器信息。",
      features: ["像素艺术", "武器展示"],
      cta: "⚔️ 查看武器",
    },
    {
      title: "恐龙博物馆",
      href: "dinosaur_museum.html",
      icon: "🏛️",
      theme: ["#ffd60a", "#e85d04"],
      description: "虚拟恐龙博物馆，沉浸式的展览体验，学习古生物知识。",
      features: ["3D 展示", "教育内容"],
      cta: "🦕 参观博物馆",
    },
    {
      title: "星环逃逸",
      href: "stellar-escape.html",
      icon: "☄️",
      theme: ["#38bdf8", "#8b5cf6"],
      description:
        "在逐渐失控的陨石风暴中存活下来。护盾能硬吃风险弹道，冲刺能切开死线，晶体则决定你能坚持多久。",
      features: ["生存街机", "护盾与冲刺", "高分追逐"],
      cta: "☄️ 进入战区",
    },
    {
      title: "回声矩阵",
      href: "echo-matrix.html",
      icon: "🧠",
      theme: ["#fbbf24", "#f472b6"],
      description:
        "记忆和节奏混合在一起的霓虹挑战。每轮多一个步骤，同时还要在限时内完成整段输入。",
      features: ["记忆挑战", "限时压力", "连击计分"],
      cta: "🧠 开始演算",
    },
    {
      title: "霓虹潜行",
      href: "neon-heist.html",
      icon: "🕶️",
      badge: "🆕 新增",
      theme: ["#34d399", "#f59e0b"],
      description:
        "回合制潜入小品。每移动一步，巡逻无人机也会同步推进一步，必须在有限生命内拿齐核心，并用 EMP 与诱饵算准撤离窗口。",
      features: ["潜行解谜", "回合推进", "EMP 冻结", "诱饵错位"],
      cta: "🕶️ 开始潜入",
    },
    {
      title: "轨道营救",
      href: "orbit-rescue.html",
      icon: "🛰️",
      badge: "🆕 新增",
      theme: ["#67e8f9", "#a78bfa"],
      description:
        "在不断旋转的碎片环带之间抢回救生舱。每动一步，所有环带也会同步换位，还得把停滞脉冲留给最危险的返航窗口。",
      features: ["轨道谜局", "回合推进", "脉冲冻结", "救援撤离"],
      cta: "🛰️ 开始回收",
    },
    {
      title: "潮汐信使",
      href: "tide-courier.html",
      icon: "⛵",
      badge: "🆕 新增",
      theme: ["#38bdf8", "#fb923c"],
      description:
        "港湾潮道会在每回合同步拖拽小艇和驳船。你得抢回漂流货箱，踩到换流浮标后反转整片水道，再从灯塔码头完成极限投递。",
      features: ["潮道漂移", "回合策略", "换流反转", "港湾投递"],
      cta: "⛵ 开始出航",
    },
    {
      title: "晶洞爆破",
      href: "cavern-blast.html",
      icon: "🧨",
      badge: "🆕 新增",
      theme: ["#2ee6c6", "#ff8a3d"],
      description:
        "像素风回合制爆破地城。你要一边埋雷、一边引怪，把碎岩炸成通路，把追击虫群炸成积分，再带着 3 枚晶体冲向升降台。",
      features: ["像素爆破", "地城走位", "雷芯节奏", "虫群追击"],
      cta: "🧨 下井开炸",
    },
    {
      title: "磁场工坊",
      href: "magnet-forge.html",
      icon: "🧲",
      badge: "🆕 新增",
      theme: ["#22d3ee", "#fbbf24"],
      description:
        "像素风磁力推箱谜局。你既要顶着磁芯电池找角度，也要用脉冲把远处磁芯拖近一格，再赶在巡检火花贴身前点亮 3 座反应座。",
      features: ["磁力推箱", "像素工坊", "脉冲牵引", "巡检追击"],
      cta: "🧲 启动工坊",
    },
    {
      title: "余烬搬运",
      href: "ember-shift.html",
      icon: "🌋",
      badge: "🆕 新增",
      theme: ["#fb7185", "#f97316"],
      description:
        "像素火线推箱谜局。你要把水桶顶进火点封死余烬走廊，再用泡沫技能抢出一条撤离路径。",
      features: ["火线调度", "推箱封点", "回合撤离"],
      cta: "🌋 进入火线",
    },
    {
      title: "裂轨列调",
      href: "rail-rift.html",
      icon: "🚆",
      badge: "🆕 新增",
      theme: ["#60a5fa", "#fbbf24"],
      description:
        "像素轨道调度小品。沿断裂峡谷边缘抢收补给片，用跃轨窗口避开最危险的轨障区段。",
      features: ["轨道走位", "补给收集", "跃轨保命"],
      cta: "🚆 发车调度",
    },
    {
      title: "符文守卫",
      href: "glyph-keeper.html",
      icon: "🗿",
      badge: "🆕 新增",
      theme: ["#8b5cf6", "#38bdf8"],
      description:
        "像素符文追逐战。边点亮散落符文，边躲暗影逼近，用专注屏障拖住最危险的一回合。",
      features: ["符文收集", "暗影追逐", "专注冻结"],
      cta: "🗿 守住石门",
    },
    {
      title: "像素果园",
      href: "pixel-orchard.html",
      icon: "🍎",
      badge: "🆕 新增",
      theme: ["#22c55e", "#facc15"],
      description:
        "在像素果园里抢收成熟果子，边躲乌鸦边规划回仓路线，哨声用得好能一口气带走最后一筐。",
      features: ["果园采收", "乌鸦压迫", "惊鸟技能"],
      cta: "🍎 开始采收",
    },
    {
      title: "信号冲刺",
      href: "signal-sprint.html",
      icon: "⚡",
      badge: "🆕 新增",
      theme: ["#06b6d4", "#2563eb"],
      description:
        "像素滑行冲刺关卡。靠惯性连吃芯片，利用短冲技能清掉贴脸闸门，把一整段节奏跑顺。",
      features: ["惯性滑行", "芯片连吃", "冲刺破门"],
      cta: "⚡ 冲刺起跑",
    },
    {
      title: "金库推箱",
      href: "vault-pusher.html",
      icon: "💰",
      badge: "🆕 新增",
      theme: ["#fbbf24", "#a855f7"],
      description:
        "经典推箱节奏配上巡逻探灯。把金条箱推上称重点，再卡着烟幕窗口摸到出口。",
      features: ["推箱关卡", "探灯追击", "烟幕潜入"],
      cta: "💰 潜入金库",
    },
    {
      title: "彗灯拾星",
      href: "comet-lantern.html",
      icon: "🌠",
      badge: "🆕 新增",
      theme: ["#0f172a", "#f59e0b"],
      description:
        "提着灯在夜场里收彗尘、躲黑影。闪灯脉冲能清出安全圈，但最关键的还是回收路线判断。",
      features: ["夜巡拾星", "黑影追踪", "闪灯脉冲"],
      cta: "🌠 点亮提灯",
    },
    {
      title: "霜轨货运",
      href: "frostbite-freight.html",
      icon: "❄️",
      badge: "🆕 新增",
      theme: ["#67e8f9", "#94a3b8"],
      description: "整个月台都在打滑。利用货箱挡位、临时制动和冰面惯性，把 3 个货箱送进停靠位。",
      features: ["冰面惯性", "货运推箱", "制动布局"],
      cta: "❄️ 开始发运",
    },
    {
      title: "苔径侦查",
      href: "moss-mission.html",
      icon: "🌿",
      badge: "🆕 新增",
      theme: ["#4ade80", "#bef264"],
      description: "温室潜行路线题。收回 6 枚露芽样本，灯苞脉冲负责清开贴脸孢子藤，再沿门口撤离。",
      features: ["温室潜行", "样本收集", "清场脉冲"],
      cta: "🌿 进入温室",
    },
    {
      title: "窑火押运",
      href: "kiln-caravan.html",
      icon: "🏺",
      badge: "🆕 新增",
      theme: ["#fb923c", "#facc15"],
      description: "锻烧推箱谜局。把 3 辆陶坯车推上窑位，用冷扇清掉火星，再从窑门一线撤走。",
      features: ["窑位推箱", "火星压迫", "冷扇清场"],
      cta: "🏺 开始押运",
    },
    {
      title: "浮码漂移",
      href: "dock-drift.html",
      icon: "🛟",
      badge: "🆕 新增",
      theme: ["#22d3ee", "#38bdf8"],
      description: "顺潮滑行的码头推箱局。你和货箱都会一直漂到挡板，抛锚窗口决定整局节奏。",
      features: ["潮板滑行", "泊位推箱", "抛锚冻结"],
      cta: "🛟 登上浮码",
    },
    {
      title: "冠林侦察",
      href: "canopy-scout.html",
      icon: "🌲",
      badge: "🆕 新增",
      theme: ["#84cc16", "#bef264"],
      description: "树冠潜行路线题。收回 6 枚风种信标，枝剪脉冲负责清掉最堵的蔓刺。",
      features: ["树冠潜行", "信标回收", "枝剪清场"],
      cta: "🌲 进入树冠",
    },
    {
      title: "琥珀长廊",
      href: "amber-aisle.html",
      icon: "🟠",
      badge: "🆕 新增",
      theme: ["#f59e0b", "#fcd34d"],
      description: "化石馆推箱小局。把 3 个封样箱推进展台，再用拍灯脉冲抢出返程窗口。",
      features: ["展馆推箱", "甲虫压迫", "拍灯清场"],
      cta: "🟠 开始布展",
    },
    {
      title: "极光突围",
      href: "aurora-breach.html",
      icon: "🌌",
      badge: "🆕 新增",
      theme: ["#38bdf8", "#a78bfa"],
      description: "雪原回收关卡。收回 5 枚极核样本，再用极光静场冻结最危险的一回合。",
      features: ["雪原回收", "风暴追击", "静场冻结"],
      cta: "🌌 冲出风暴",
    },
    {
      title: "礁环守卫",
      href: "reef-keeper.html",
      icon: "🛡️",
      badge: "🆕 新增",
      theme: ["#5eead4", "#60a5fa"],
      description: "守礁推箱局。把 4 个珊瑚环压上潮锚，潮钟负责冻结近处海流，帮你抢到最后的站位。",
      features: ["守礁推箱", "潮钟冻结", "窄道卡位"],
      cta: "🛡️ 守住礁环",
    },
    {
      title: "兰园守卫",
      href: "orchid-guard.html",
      icon: "🌺",
      badge: "🆕 新增",
      theme: ["#86efac", "#f472b6"],
      description: "温室花圃推箱守卫。把花架推进花床基座，用花雾拖住虫群，再赶在护盾耗尽前撤出兰园。",
      features: ["温室推箱", "虫群追击", "花雾冻结"],
      cta: "🌺 守住花圃",
    },
    {
      title: "沙讯回收",
      href: "signal-dunes.html",
      icon: "🏜️",
      badge: "🆕 新增",
      theme: ["#fbbf24", "#fb7185"],
      description: "沙海滑行回收关。沿沙脊一路滑到停点，收回 6 处信标，再用沙幕清掉贴脸幻影。",
      features: ["沙脊滑行", "信标回收", "沙幕清场"],
      cta: "🏜️ 进入沙海",
    },
    {
      title: "潮涌码头",
      href: "volt-pier.html",
      icon: "⚓",
      badge: "🆕 新增",
      theme: ["#7dd3fc", "#fbbf24"],
      description: "港口电力防线。把电容箱推上闸位，用断路器压住浪涌，再从灯塔码头安全撤离。",
      features: ["港口推箱", "浪涌扩散", "断路冻结"],
      cta: "⚓ 接管码头",
    },
    {
      title: "相位花园",
      href: "phase-garden.html",
      icon: "🪻",
      badge: "🆕 新增",
      featured: true,
      theme: ["#67e8f9", "#a3e635"],
      description: "相位门会把你甩进另一侧花廊。先开闸、再清场、再回收样本，路线感很强。",
      features: ["相位门路线", "孢体扩散", "净场脉冲"],
      cta: "🪻 进入花园",
    },
    {
      title: "镜库折返",
      href: "mirror-vault.html",
      icon: "🪞",
      badge: "🆕 新增",
      theme: ["#a78bfa", "#fb923c"],
      description: "镜门只送人不送箱。要先换边，再从正确角度把镜匣压进基座，推箱节奏很刁钻。",
      features: ["镜门换边", "多步推箱", "镜封冻结"],
      cta: "🪞 接管镜库",
    },
    {
      title: "断路车场",
      href: "breaker-yard.html",
      icon: "🛤️",
      badge: "🆕 新增",
      theme: ["#38bdf8", "#fb923c"],
      description: "先抬闸门，再顶着扩散电弧推断路箱。路线和节奏都比普通推箱更紧。",
      features: ["抬闸改路", "电弧扩散", "检修位推箱"],
      cta: "🛤️ 进入车场",
    },
    {
      title: "余烬闸门",
      href: "ember-gate.html",
      icon: "🔥",
      badge: "🆕 新增",
      theme: ["#fb923c", "#facc15"],
      description: "闸门抬起后才是真正的火线。收芯片、清火点、抢出口三件事会挤在一条走廊里。",
      features: ["熔门开闭", "火点扩散", "清灰脉冲"],
      cta: "🔥 冲入火线",
    },
    {
      title: "裂隙中继",
      href: "rift-relay.html",
      icon: "🌀",
      badge: "🆕 新增",
      theme: ["#60a5fa", "#c084fc"],
      description: "滑道会把你一路送到停点，再用裂口换边补路线。停点判断做得很有手感。",
      features: ["滑行停点", "裂口换边", "相位清场"],
      cta: "🌀 接入中继",
    },
    {
      title: "风暴锁港",
      href: "storm-lock.html",
      icon: "⛈️",
      badge: "🆕 新增",
      featured: true,
      theme: ["#7dd3fc", "#c084fc"],
      description: "开门、换边、推箱、撤离必须连成一条链。是这批新页里战术感最重的一页。",
      features: ["锁港推箱", "闸门换边", "浪涌扩散"],
      cta: "⛈️ 攻坚锁港",
    },
    {
      title: "云塔换轨",
      href: "skyline-switch.html",
      icon: "☁️",
      badge: "🆕 新增",
      theme: ["#7dd3fc", "#facc15"],
      description: "滑行停点、开闸和换轨门连在一起。路线看似开阔，真正难点是每次滑行后落在哪里。",
      features: ["云轨滑行", "开闸换轨", "风剪清场"],
      cta: "☁️ 接管云塔",
    },
    {
      title: "齿轮库房",
      href: "gear-vault.html",
      icon: "⚙️",
      badge: "🆕 新增",
      theme: ["#fbbf24", "#7dd3fc"],
      description: "换向舱只送人不送箱，必须先找角度再推机芯箱。开门、推箱、冻结窗口都要算清楚。",
      features: ["机芯推箱", "齿轮开门", "换向舱绕位"],
      cta: "⚙️ 进入库房",
    },
    {
      title: "雾港航标",
      href: "harbor-haze.html",
      icon: "🌫️",
      badge: "🆕 新增",
      theme: ["#67e8f9", "#c084fc"],
      description: "雾闸、回声门和巡航影挤在窄码头里。先开门，再换边收回航标，最后抢进灯塔出口。",
      features: ["雾港开闸", "回声门换边", "雾灯清场"],
      cta: "🌫️ 接管雾港",
    },
    {
      title: "晶流导管",
      href: "crystal-conduit.html",
      icon: "💎",
      badge: "🆕 新增",
      theme: ["#93c5fd", "#5eead4"],
      description: "导管门只送人不送晶匣。你要先踩稳压板，再绕位推箱，把 3 段晶流重新接通。",
      features: ["晶匣推箱", "稳压开门", "凝滞控场"],
      cta: "💎 接通导管",
    },
    {
      title: "月锁回廊",
      href: "lunar-lock.html",
      icon: "🌙",
      badge: "🆕 新增",
      theme: ["#a78bfa", "#fde68a"],
      description: "月轨会把你一路滑到停点。踩开月锁门、借跃迁门换边、用月辉脉冲清出撤离窗口。",
      features: ["月轨滑行", "跃迁门换边", "月辉清场"],
      cta: "🌙 解开月锁",
    },
    {
      title: "烬渠渡工",
      href: "cinder-canal.html",
      icon: "🔥",
      badge: "🆕 新增",
      theme: ["#f97316", "#38bdf8"],
      description: "烬渠会把你一路滑到停点。踩开水闸、借回声涵洞换边、用冷雾清掉余烬浪，最后带着火芯撤离。",
      features: ["烬渠滑行", "开闸换边", "冷雾清场"],
      cta: "🔥 接管烬渠",
    },
    {
      title: "回声集市",
      href: "echo-bazaar.html",
      icon: "🎪",
      badge: "🆕 新增",
      theme: ["#c084fc", "#f59e0b"],
      description: "夜市摊位被巡音影打乱。回声门只送人不送箱，必须先开门换边，再把货箱推回摊位。",
      features: ["集市推箱", "回声门绕位", "静音控场"],
      cta: "🎪 整理集市",
    },
    {
      title: "雾线修补",
      href: "mist-mender.html",
      icon: "🌫️",
      badge: "🆕 新增",
      theme: ["#7dd3fc", "#a7f3d0"],
      description: "雾轨会把你一路滑到停点。踩开雾闸、借折光门换边，回收雾芯并用净灯清掉贴脸雾影。",
      features: ["雾轨滑行", "折光门换边", "净灯清场"],
      cta: "🌫️ 修补雾线",
    },
    {
      title: "铜轨换桥",
      href: "copper-crossing.html",
      icon: "🟧",
      badge: "🆕 新增",
      theme: ["#f59e0b", "#5eead4"],
      description: "旧港铜轨推箱局。先踩开桥闸，再穿换桥门绕到箱子背面，把 3 个铜箱压上桥座。",
      features: ["桥闸开路", "换桥绕位", "铜箱推送"],
      cta: "🟧 接管铜轨",
    },
    {
      title: "电容信使",
      href: "capacitor-courier.html",
      icon: "🔋",
      badge: "🆕 新增",
      theme: ["#22d3ee", "#a3e635"],
      description: "电站推箱攻坚页。先踩开断路闸，再把电容箱送上导流座，用绝缘脉冲清掉贴身电弧。",
      features: ["断路开闸", "电容推箱", "绝缘清场"],
      cta: "🔋 接管电站",
    },
    {
      title: "棱镜中继",
      href: "prism-relay.html",
      icon: "🔺",
      badge: "🆕 新增",
      theme: ["#67e8f9", "#f9a8d4"],
      description: "光路推箱新关卡。踩开光闸，把棱镜块推上中继座，再用折光脉冲清掉贴身光痕。",
      features: ["光闸开路", "棱镜推箱", "折光清场"],
      cta: "🔺 校准棱镜",
    },
    {
      title: "辉苔林廊",
      href: "glow-grove.html",
      icon: "🌿",
      badge: "🆕 新增",
      theme: ["#86efac", "#5eead4"],
      description: "林廊推箱新关卡。踩开林闸，把辉苔箱推上辉苔座，再用苔灯脉冲清掉贴身孢影。",
      features: ["林闸开路", "辉苔推箱", "苔灯清场"],
      cta: "🌿 点亮林廊",
    },
    {
      title: "太阳哨站",
      href: "solar-sentry.html",
      icon: "☀️",
      badge: "🆕 新增",
      theme: ["#fbbf24", "#f97316"],
      description: "高速巡检型回收关卡。先收回 4 颗光核，再用日冕脉冲扫掉碎片，为最后的回航窗口留路。",
      features: ["光核回收", "清场脉冲", "轨道巡检"],
      cta: "☀️ 接管阵列",
    },
    {
      title: "箱线回路",
      href: "crate-circuit.html",
      icon: "📦",
      badge: "🆕 新增",
      theme: ["#22d3ee", "#14b8a6"],
      description: "机房推箱新变体。把 3 个电路箱推到节点上，再卡着断流窗口穿过闸门。",
      features: ["机房推箱", "节点点亮", "断流冻结"],
      cta: "📦 开始接线",
    },
    {
      title: "暗礁打捞",
      href: "reef-raider.html",
      icon: "🪸",
      badge: "🆕 新增",
      theme: ["#22c55e", "#0ea5e9"],
      description: "海床打捞路线题。收回 6 枚遗物，声呐脉冲负责压住潮流，再沿右下出口撤离。",
      features: ["海床潜行", "遗物打捞", "声呐冻结"],
      cta: "🪸 下潜回收",
    },
    {
      title: "炉火佯动",
      href: "forge-feint.html",
      icon: "⚒️",
      badge: "🆕 新增",
      theme: ["#fb7185", "#f97316"],
      description: "锻点推箱谜局。推动 3 块钢胚压住锻点，用冷锤冻结火星，挤出一条侧门路线。",
      features: ["锻点推箱", "火星压迫", "冷锤冻结"],
      cta: "⚒️ 进入锻炉",
    },
    {
      title: "棱镜巡线",
      href: "prism-patrol.html",
      icon: "🔶",
      badge: "🆕 新增",
      theme: ["#a78bfa", "#38bdf8"],
      description: "收束节奏很强的采集关。沿着光廊拿满 5 枚棱镜，用锁光停住威胁，再干净撤离。",
      features: ["棱镜采集", "锁光停顿", "短线撤离"],
      cta: "🔶 开始巡线",
    },
    {
      title: "冰川换道",
      href: "glacier-switch.html",
      icon: "🧊",
      badge: "🆕 新增",
      theme: ["#67e8f9", "#2563eb"],
      description: "会滑行的冰面推箱版。靠雪楔清掉贴脸冰刺，把货箱送上停靠位后再滑进出口。",
      features: ["冰面滑行", "推箱换道", "雪楔清障"],
      cta: "🧊 切入冰道",
    },
    {
      title: "荆棘小径",
      href: "thorn-trail.html",
      icon: "🌿",
      badge: "🆕 新增",
      theme: ["#84cc16", "#f97316"],
      description: "慢节奏林径采集。目标是 7 颗露芽，修枝刀能临时切开藤刺，非常考验绕行判断。",
      features: ["林径采集", "藤刺扩散", "修枝清场"],
      cta: "🌿 穿过荆棘",
    },
    {
      title: "中继冲刺",
      href: "relay-rush.html",
      icon: "📡",
      badge: "🆕 新增",
      theme: ["#06b6d4", "#8b5cf6"],
      description: "高速滑行信道局。沿直线吃下 6 个中继节点，再靠稳频波压住干扰，冲回终端塔。",
      features: ["滑行信道", "节点冲刺", "稳频冻结"],
      cta: "📡 开始冲线",
    },
    {
      title: "琉光升塔",
      href: "lumen-lift.html",
      icon: "💡",
      badge: "🆕 新增",
      theme: ["#38bdf8", "#fbbf24"],
      description: "补光塔主题推箱页。把棱镜箱送上光台，聚光脉冲负责给暗影踩刹车。",
      features: ["补光推箱", "暗影压迫", "聚光冻结"],
      cta: "💡 点亮塔心",
    },
    {
      title: "矿场追标",
      href: "quarry-quest.html",
      icon: "⛏️",
      badge: "🆕 新增",
      theme: ["#f59e0b", "#84cc16"],
      description: "矿区推石撤离关。把 3 块矿石推进标记槽，再卡着定锚窗口从北侧井口带走样本。",
      features: ["矿道推箱", "标记封存", "定锚冻结"],
      cta: "⛏️ 下井清点",
    },
    {
      title: "八字映射实验室",
      href: "bazi-insights.html",
      icon: "☯️",
      badge: "🆕 新站点",
      theme: ["#e9d5c0", "#b65d3b"],
      description:
        "输入出生日期、时间和关注点，基于规则映射生成结构化的五行偏向、性格侧重与行动建议。",
      features: ["结构化解读", "五行偏向", "行动建议"],
      cta: "☯️ 生成解读",
    },
    {
      title: "Mind Lab 智力测试",
      href: "mind-lab.html",
      icon: "🧩",
      badge: "🆕 新站点",
      theme: ["#58d5ff", "#2563eb"],
      description: "8 道轻量逻辑题，覆盖数列、条件推理和模式识别，3 到 5 分钟就能完成一次状态测试。",
      features: ["多题测试", "即时计分", "结果分段"],
      cta: "🧩 开始测试",
    },
    {
      title: "Focus Weave 专注编排器",
      href: "focus-weave.html",
      icon: "🧵",
      badge: "🆕 新应用",
      theme: ["#73f0ff", "#f7b267"],
      description: "根据时间、能量、任务类型和打断强度，生成一份可直接执行的短时专注编排。",
      features: ["时间轴建议", "防失焦规则", "一键再生成"],
      cta: "🧵 生成编排",
    },
    {
      title: "Decision Compass 决策罗盘",
      href: "decision-compass.html",
      icon: "🧭",
      badge: "🆕 新应用",
      theme: ["#98f5ff", "#f7b267"],
      description: "根据紧急度、可逆性和把握度生成决策建议，明确现在做、先试探还是先补信息。",
      features: ["决策模式", "风险边界", "检查点输出"],
      cta: "🧭 生成判断",
    },
    {
      title: "Meeting Weave 会议编排器",
      href: "meeting-weave.html",
      icon: "🪢",
      badge: "🆕 新应用",
      theme: ["#98f5ff", "#665df0"],
      description: "根据会议目标、人数和时长生成更紧凑的会议结构、主持规则和会后收口建议。",
      features: ["时间分段", "主持规则", "会后动作"],
      cta: "🪢 编排会议",
    },
    {
      title: "Priority Canvas 优先级画布",
      href: "priority-canvas.html",
      icon: "🗂️",
      badge: "🆕 新应用",
      theme: ["#f7b267", "#98f5ff"],
      description: "综合影响、投入、期限和依赖，给任务定位到先做、计划做、顺手做或放后做。",
      features: ["优先分", "画布定位", "下一步动作"],
      cta: "🗂️ 生成画布",
    },
    {
      title: "俄罗斯方块",
      href: "tetris.html",
      icon: "🧱",
      badge: "🆕 新增",
      theme: ["#00e5ff", "#7c4dff"],
      description: "经典俄罗斯方块，7 种标准方块、幽灵提示、逐级加速，支持键盘和触屏操控。",
      features: ["经典玩法", "逐级加速", "高分记录"],
      cta: "🧱 开始游戏",
    },
    {
      title: "扫雷",
      href: "minesweeper.html",
      icon: "💣",
      badge: "🆕 新增",
      theme: ["#22c55e", "#15803d"],
      description: "经典扫雷游戏，三种难度等级，首次点击安全机制，最佳时间记录。",
      features: ["三种难度", "安全首击", "计时排名"],
      cta: "💣 开始游戏",
    },
    {
      title: "2048",
      href: "2048.html",
      icon: "🔢",
      badge: "🆕 新增",
      theme: ["#edc22e", "#f59563"],
      description: "经典滑块益智游戏，合并数字方块达到 2048。支持键盘和触摸滑动操作。",
      features: ["益智策略", "触摸操作", "最佳分数"],
      cta: "🔢 开始游戏",
    },
    {
      title: "像素飞鸟",
      href: "flappy-bird.html",
      icon: "🐦",
      badge: "🆕 新增",
      theme: ["#facc15", "#f97316"],
      description: "经典飞翔闯关游戏，点击或按空格控制小鸟穿越管道，看你能飞多远。",
      features: ["一键操作", "无限关卡", "高分记录"],
      cta: "🐦 开始飞翔",
    },
  ];

  const STORAGE_KEYS = {
    favorites: "democodex-menu-favorites",
    recent: "democodex-menu-recent",
  };

  const RECENT_LIMIT = 6;
  const GRID_RENDER_BATCH = 18;
  const interactiveHrefs = new Set([
    "daily-insights.html",
    "bazi-insights.html",
    "mind-lab.html",
    "focus-weave.html",
    "decision-compass.html",
    "meeting-weave.html",
    "priority-canvas.html",
  ]);
  const showcaseHrefs = new Set([
    "dino-pixel-encyclopedia.html",
    "armory-pixel-arsenal.html",
    "dinosaur_museum.html",
  ]);
  const classicHrefs = new Set([
    "snake_game.html",
    "tetris.html",
    "minesweeper.html",
    "2048.html",
    "flappy-bird.html",
  ]);
  const strategyHrefs = new Set([
    "neon-heist.html",
    "orbit-rescue.html",
    "tide-courier.html",
    "cavern-blast.html",
    "magnet-forge.html",
    "ember-shift.html",
    "rail-rift.html",
    "glyph-keeper.html",
    "pixel-orchard.html",
    "signal-sprint.html",
    "vault-pusher.html",
    "comet-lantern.html",
    "frostbite-freight.html",
    "moss-mission.html",
    "kiln-caravan.html",
    "dock-drift.html",
    "canopy-scout.html",
    "amber-aisle.html",
    "aurora-breach.html",
    "reef-keeper.html",
    "orchid-guard.html",
    "signal-dunes.html",
    "volt-pier.html",
    "phase-garden.html",
    "mirror-vault.html",
    "breaker-yard.html",
    "ember-gate.html",
    "rift-relay.html",
    "storm-lock.html",
    "skyline-switch.html",
    "gear-vault.html",
    "harbor-haze.html",
    "crystal-conduit.html",
    "lunar-lock.html",
    "cinder-canal.html",
    "echo-bazaar.html",
    "mist-mender.html",
    "copper-crossing.html",
    "capacitor-courier.html",
    "prism-relay.html",
    "glow-grove.html",
    "solar-sentry.html",
    "crate-circuit.html",
    "reef-raider.html",
    "forge-feint.html",
    "prism-patrol.html",
    "glacier-switch.html",
    "thorn-trail.html",
    "relay-rush.html",
    "lumen-lift.html",
    "quarry-quest.html",
  ]);

  const categoryCatalog = [
    { id: "all", label: "全部作品", duration: "随时开玩", mood: "主入口视角" },
    { id: "strategy", label: "策略谜局", duration: "4 到 10 分钟", mood: "紧张但清晰" },
    { id: "arcade", label: "街机动作", duration: "2 到 8 分钟", mood: "节奏更快" },
    { id: "classic", label: "经典复刻", duration: "3 到 12 分钟", mood: "熟悉即上手" },
    { id: "interactive", label: "互动内容", duration: "3 到 6 分钟", mood: "轻量探索" },
    { id: "showcase", label: "科普展示", duration: "2 到 5 分钟", mood: "适合慢慢看" },
  ];

  const categoryById = new Map(categoryCatalog.map((item) => [item.id, item]));
  const sortOptions = ["recommended", "recent", "quick", "name"];
  const preparedCards = cards.map((card, index) => prepareCard(card, index));
  const featuredCount = preparedCards.filter((card) => card.featured).length;
  const urlStateApi = typeof window !== "undefined" ? window.DemoCodexMenuUrlState : null;
  const urlStateOptions = {
    allowedCategories: categoryCatalog.map((item) => item.id),
    allowedSorts: sortOptions,
    allowedSpotlights: preparedCards.map((card) => card.href),
    defaultCategory: "all",
    defaultSort: "recommended",
  };
  const initialUrlState = urlStateApi
    ? urlStateApi.parseMenuViewFromSearch(window.location.search, urlStateOptions)
    : { query: "", category: "all", sort: "recommended", spotlightHref: null };
  const defaultSpotlightHref = getDefaultSpotlight(preparedCards).href;

  const elements = {
    grid: document.getElementById("games-grid"),
    total: document.getElementById("menu-total"),
    featured: document.getElementById("menu-featured"),
    visible: document.getElementById("menu-visible"),
    subtitle: document.getElementById("menu-subtitle"),
    randomPick: document.getElementById("menu-random-pick"),
    share: document.getElementById("menu-share-view"),
    shareFeedback: document.getElementById("menu-share-feedback"),
    reset: document.getElementById("menu-reset"),
    spotlightLabel: document.getElementById("menu-spotlight-label"),
    spotlightTitle: document.getElementById("menu-spotlight-title"),
    spotlightDescription: document.getElementById("menu-spotlight-description"),
    spotlightTags: document.getElementById("menu-spotlight-tags"),
    spotlightMeta: document.getElementById("menu-spotlight-meta"),
    spotlightLink: document.getElementById("menu-spotlight-link"),
    search: document.getElementById("menu-search"),
    sort: document.getElementById("menu-sort"),
    favoritesToggle: document.getElementById("menu-favorites-toggle"),
    categoryChips: document.getElementById("menu-category-chips"),
    resultsSummary: document.getElementById("menu-results-summary"),
    activeFilters: document.getElementById("menu-active-filters"),
    loadMoreWrap: document.getElementById("menu-load-more-wrap"),
    loadMore: document.getElementById("menu-load-more"),
  };

  if (Object.values(elements).some((element) => !element)) {
    return;
  }

  const state = {
    query: initialUrlState.query,
    category: initialUrlState.category,
    sort: initialUrlState.sort,
    onlyFavorites: false,
    favorites: new Set(loadStoredList(STORAGE_KEYS.favorites)),
    recent: loadStoredList(STORAGE_KEYS.recent),
    spotlightHref: initialUrlState.spotlightHref || defaultSpotlightHref,
    spotlightMode: initialUrlState.spotlightHref ? "shared" : "auto",
    renderLimit: GRID_RENDER_BATCH,
  };

  bindEvents();
  render();

  function prepareCard(card, index) {
    const categoryId = deriveCategoryId(card.href);
    const categoryInfo = categoryById.get(categoryId);
    const freshness = card.badge ? 1 : 0;
    const searchText = normalizeText(
      [card.title, card.description, card.cta, categoryInfo.label, ...card.features].join(" ")
    );

    return {
      ...card,
      index,
      categoryId,
      categoryLabel: categoryInfo.label,
      durationLabel: categoryInfo.duration,
      moodLabel: categoryInfo.mood,
      durationWeight: getDurationWeight(categoryId),
      freshness,
      searchText,
    };
  }

  function bindEvents() {
    elements.search.addEventListener("input", (event) => {
      state.query = event.target.value;
      state.spotlightMode = "auto";
      resetRenderLimit();
      render();
    });

    elements.sort.addEventListener("change", (event) => {
      state.sort = event.target.value;
      state.spotlightMode = "auto";
      resetRenderLimit();
      render();
    });

    elements.favoritesToggle.addEventListener("click", () => {
      state.onlyFavorites = !state.onlyFavorites;
      state.spotlightMode = "auto";
      resetRenderLimit();
      render();
    });

    elements.randomPick.addEventListener("click", () => {
      const visibleCards = getVisibleCards();
      if (visibleCards.length === 0) {
        return;
      }

      const nextCard = visibleCards[Math.floor(Math.random() * visibleCards.length)];
      state.spotlightHref = nextCard.href;
      state.spotlightMode = "random";
      render();
      elements.spotlightLink.focus();
    });

    elements.share.addEventListener("click", async () => {
      await copyCurrentView();
    });

    elements.reset.addEventListener("click", () => {
      resetFilters();
    });

    elements.loadMore.addEventListener("click", () => {
      state.renderLimit += GRID_RENDER_BATCH;
      render();
    });

    document.addEventListener("keydown", (event) => {
      if (event.key === "/" && document.activeElement !== elements.search) {
        event.preventDefault();
        elements.search.focus();
        elements.search.select();
      }

      if (event.key === "Escape" && document.activeElement === elements.search && state.query) {
        event.preventDefault();
        state.query = "";
        elements.search.value = "";
        resetRenderLimit();
        render();
      }
    });
  }

  function render() {
    const focusKey = document.activeElement?.getAttribute("data-menu-focus-key");
    const visibleCards = getVisibleCards();
    syncControls(visibleCards);
    renderHero(visibleCards);
    renderCategories();
    renderActiveFilters();
    renderSpotlight(visibleCards);
    renderGrid(visibleCards);
    renderLoadMore(visibleCards);
    syncLocationState();
    setShareFeedback(getDefaultShareFeedback());
    if (focusKey) {
      const replacement = [...document.querySelectorAll("[data-menu-focus-key]")]
        .find((control) => control.getAttribute("data-menu-focus-key") === focusKey && !control.disabled);
      if (replacement) {
        replacement.focus({ preventScroll: true });
      } else {
        // Removing a filtered favorite or clearing filters removes the old control.
        (focusKey.startsWith("favorite:") ? elements.favoritesToggle : elements.search).focus();
      }
    }
  }

  function syncControls(visibleCards) {
    elements.search.value = state.query;
    elements.sort.value = state.sort;
    elements.favoritesToggle.setAttribute("aria-pressed", String(state.onlyFavorites));
    elements.favoritesToggle.textContent = state.onlyFavorites ? "显示全部" : "只看收藏";
    elements.reset.disabled = !hasActiveFilters();
    elements.randomPick.disabled = visibleCards.length === 0;
  }

  function renderHero(visibleCards) {
    elements.total.textContent = String(preparedCards.length);
    elements.featured.textContent = String(featuredCount);
    elements.visible.textContent = String(visibleCards.length);
    elements.resultsSummary.textContent = buildSummary(visibleCards);
    elements.subtitle.textContent = buildSubtitle(visibleCards);
  }

  function renderCategories() {
    const fragment = document.createDocumentFragment();

    for (const category of categoryCatalog) {
      const button = document.createElement("button");
      const count = countCardsForCategory(category.id);
      button.className = "menu-chip";
      button.type = "button";
      button.setAttribute("aria-pressed", String(state.category === category.id));
      button.setAttribute("data-menu-focus-key", `category:${category.id}`);
      button.disabled = count === 0;
      button.addEventListener("click", () => {
        state.category = category.id;
        state.spotlightMode = "auto";
        render();
      });

      const label = document.createElement("span");
      label.textContent = category.label;

      const badge = document.createElement("span");
      badge.className = "menu-chip__count";
      badge.textContent = String(count);

      button.append(label, badge);
      fragment.appendChild(button);
    }

    elements.categoryChips.replaceChildren(fragment);
  }

  function renderActiveFilters() {
    const fragment = document.createDocumentFragment();
    const activeBits = [];

    if (state.category !== "all") {
      activeBits.push(`分类：${categoryById.get(state.category).label}`);
    }

    if (state.query.trim()) {
      activeBits.push(`搜索：${state.query.trim()}`);
    }

    if (state.onlyFavorites) {
      activeBits.push("只看收藏");
    }

    if (state.sort !== "recommended") {
      activeBits.push(`排序：${getSortLabel(state.sort)}`);
    }

    for (const bit of activeBits) {
      const pill = document.createElement("span");
      pill.className = "menu-filter-pill";
      pill.textContent = bit;
      fragment.appendChild(pill);
    }

    if (activeBits.length > 0) {
      const clearButton = document.createElement("button");
      clearButton.className = "menu-clear-filters";
      clearButton.type = "button";
      clearButton.setAttribute("data-menu-focus-key", "clear-filters");
      clearButton.textContent = "清空筛选";
      clearButton.addEventListener("click", () => {
        resetFilters();
      });
      fragment.appendChild(clearButton);
    }

    elements.activeFilters.replaceChildren(fragment);
  }

  function renderSpotlight(visibleCards) {
    const spotlightCard = resolveSpotlightCard(visibleCards);

    if (!spotlightCard) {
      elements.spotlightLabel.textContent = "暂时没找到";
      elements.spotlightTitle.textContent = "没有匹配结果";
      elements.spotlightDescription.textContent = "换个关键词，或者清空筛选后再随机挑一页。";
      elements.spotlightMeta.textContent = "试试：策略、经典、像素、测试、知识";
      elements.spotlightTags.replaceChildren();
      elements.spotlightLink.textContent = "回到全部作品";
      elements.spotlightLink.href = "#menu-browse-title";
      elements.spotlightLink.onclick = () => {
        resetFilters();
      };
      return;
    }

    state.spotlightHref = spotlightCard.href;
    elements.spotlightLabel.textContent = getSpotlightLabel(spotlightCard);
    elements.spotlightTitle.textContent = spotlightCard.title;
    elements.spotlightDescription.textContent = spotlightCard.description;
    elements.spotlightMeta.textContent = `${spotlightCard.categoryLabel} · ${spotlightCard.durationLabel} · ${spotlightCard.moodLabel}`;
    elements.spotlightLink.textContent = spotlightCard.cta;
    elements.spotlightLink.href = spotlightCard.href;
    elements.spotlightLink.onclick = () => {
      recordVisit(spotlightCard.href);
    };

    const tags = spotlightCard.features.slice(0, 4).map((feature) => {
      const tag = document.createElement("span");
      tag.className = "menu-spotlight__tag";
      tag.textContent = feature;
      return tag;
    });
    elements.spotlightTags.replaceChildren(...tags);
  }

  function renderGrid(visibleCards) {
    const fragment = document.createDocumentFragment();
    const renderedCards = visibleCards.slice(0, state.renderLimit);

    if (visibleCards.length === 0) {
      fragment.appendChild(createEmptyState());
    } else {
      renderedCards.forEach((card, index) => {
        fragment.appendChild(createCard(card, index, shouldStretchCard(card)));
      });
    }

    elements.grid.replaceChildren(fragment);
    elements.grid.setAttribute("aria-busy", "false");
  }

  function renderLoadMore(visibleCards) {
    const hidden = visibleCards.length <= state.renderLimit;
    elements.loadMoreWrap.hidden = hidden;
    if (hidden) {
      elements.loadMore.textContent = "已经全部展开";
      return;
    }

    const remaining = visibleCards.length - state.renderLimit;
    const nextBatch = Math.min(GRID_RENDER_BATCH, remaining);
    elements.loadMore.textContent = `继续展开 ${nextBatch} 个`;
  }

  function createCard(card, index, featuredLayout) {
    const article = document.createElement("article");
    article.className = `menu-card${featuredLayout ? " menu-card--featured" : ""}${
      card.href === state.spotlightHref ? " menu-card--spotlighted" : ""
    }`;
    article.style.setProperty("--card-start", card.theme[0]);
    article.style.setProperty("--card-end", card.theme[1]);
    article.style.setProperty("--card-delay", `${Math.min(index, 8) * 60}ms`);

    const favoriteButton = document.createElement("button");
    favoriteButton.className = "menu-card__favorite";
    favoriteButton.type = "button";
    favoriteButton.textContent = "★";
    favoriteButton.setAttribute("aria-pressed", String(state.favorites.has(card.href)));
    favoriteButton.setAttribute("data-menu-focus-key", `favorite:${card.href}`);
    favoriteButton.setAttribute(
      "aria-label",
      state.favorites.has(card.href) ? `取消收藏 ${card.title}` : `收藏 ${card.title}`
    );
    favoriteButton.addEventListener("click", (event) => {
      event.preventDefault();
      event.stopPropagation();
      toggleFavorite(card.href);
    });

    const link = document.createElement("a");
    link.className = "menu-card__link";
    link.href = card.href;
    link.setAttribute("aria-label", `${card.title}，${card.categoryLabel}`);
    link.addEventListener("click", () => {
      recordVisit(card.href);
    });

    const banner = document.createElement("div");
    banner.className = "menu-card__banner";
    banner.setAttribute("aria-hidden", "true");
    banner.textContent = card.icon;

    const content = document.createElement("div");
    content.className = "menu-card__content";

    const topLine = document.createElement("div");
    topLine.className = "menu-card__topline";

    const category = document.createElement("span");
    category.className = "menu-card__category";
    category.textContent = card.categoryLabel;
    topLine.appendChild(category);

    if (card.badge) {
      const badge = document.createElement("span");
      badge.className = "menu-card__badge";
      badge.textContent = card.badge;
      topLine.appendChild(badge);
    }

    if (state.recent.includes(card.href)) {
      const signal = document.createElement("span");
      signal.className = "menu-card__signal";
      signal.textContent = "最近玩过";
      topLine.appendChild(signal);
    } else if (state.favorites.has(card.href)) {
      const signal = document.createElement("span");
      signal.className = "menu-card__signal";
      signal.textContent = "已收藏";
      topLine.appendChild(signal);
    }

    const title = document.createElement("h3");
    title.className = "menu-card__title";
    title.textContent = card.title;

    const description = document.createElement("p");
    description.className = "menu-card__description";
    description.textContent = card.description;

    const micro = document.createElement("div");
    micro.className = "menu-card__micro";
    for (const text of [card.durationLabel, card.moodLabel, card.featured ? "精选路线" : "直接可玩"]) {
      const item = document.createElement("span");
      item.className = "menu-card__micro-item";
      item.textContent = text;
      micro.appendChild(item);
    }

    const features = document.createElement("div");
    features.className = "menu-card__features";
    for (const feature of card.features) {
      const tag = document.createElement("span");
      tag.className = "menu-card__tag";
      tag.textContent = feature;
      features.appendChild(tag);
    }

    content.append(topLine, title, description, micro, features);

    if (Array.isArray(card.stats) && card.stats.length > 0) {
      const stats = document.createElement("dl");
      stats.className = "menu-card__stats";

      for (const stat of card.stats) {
        const item = document.createElement("div");
        item.className = "menu-card__stat";

        const value = document.createElement("dt");
        value.className = "menu-card__stat-value";
        value.textContent = stat.value;

        const label = document.createElement("dd");
        label.className = "menu-card__stat-label";
        label.textContent = stat.label;

        item.append(value, label);
        stats.appendChild(item);
      }

      content.appendChild(stats);
    }

    const cta = document.createElement("span");
    cta.className = "menu-card__cta";
    cta.textContent = card.cta;
    content.appendChild(cta);

    link.append(banner, content);
    article.append(favoriteButton, link);
    return article;
  }

  function createEmptyState() {
    const wrapper = document.createElement("div");
    wrapper.className = "menu-empty";

    const title = document.createElement("h3");
    title.textContent = "这次筛得太狠了";

    const description = document.createElement("p");
    description.textContent =
      "当前没有作品同时满足这些条件。试着减少关键词、切回全部分类，或者直接点一次“随机挑一页”。";

    const button = document.createElement("button");
    button.className = "menu-clear-filters";
    button.type = "button";
    button.setAttribute("data-menu-focus-key", "clear-filters");
    button.textContent = "清空筛选";
    button.addEventListener("click", () => {
      resetFilters();
    });

    wrapper.append(title, description, button);
    return wrapper;
  }

  function deriveCategoryId(href) {
    if (interactiveHrefs.has(href)) {
      return "interactive";
    }

    if (showcaseHrefs.has(href)) {
      return "showcase";
    }

    if (classicHrefs.has(href)) {
      return "classic";
    }

    if (strategyHrefs.has(href)) {
      return "strategy";
    }

    return "arcade";
  }

  function getDurationWeight(categoryId) {
    switch (categoryId) {
      case "showcase":
        return 2;
      case "interactive":
        return 3;
      case "arcade":
        return 4;
      case "strategy":
        return 5;
      case "classic":
        return 6;
      default:
        return 99;
    }
  }

  function loadStoredList(key) {
    try {
      const raw = window.localStorage.getItem(key);
      if (!raw) {
        return [];
      }

      const parsed = JSON.parse(raw);
      return Array.isArray(parsed) ? parsed.filter((item) => typeof item === "string") : [];
    } catch {
      return [];
    }
  }

  function saveStoredList(key, values) {
    try {
      window.localStorage.setItem(key, JSON.stringify(values));
    } catch {
      // Ignore storage quota issues; the menu still works without persistence.
    }
  }

  function normalizeText(value) {
    return String(value || "").replace(/\s+/g, " ").trim().toLowerCase();
  }

  function getVisibleCards() {
    const query = normalizeText(state.query);
    const filteredCards = preparedCards.filter((card) => {
      if (state.onlyFavorites && !state.favorites.has(card.href)) {
        return false;
      }

      if (state.category !== "all" && card.categoryId !== state.category) {
        return false;
      }

      if (query && !card.searchText.includes(query)) {
        return false;
      }

      return true;
    });

    return sortCards(filteredCards);
  }

  function sortCards(visibleCards) {
    const nextCards = [...visibleCards];

    switch (state.sort) {
      case "recent":
        nextCards.sort((a, b) => getRecentRank(a.href) - getRecentRank(b.href) || compareRecommended(a, b));
        break;
      case "quick":
        nextCards.sort((a, b) => a.durationWeight - b.durationWeight || compareRecommended(a, b));
        break;
      case "name":
        nextCards.sort((a, b) => a.title.localeCompare(b.title, "zh-Hans-CN"));
        break;
      default:
        nextCards.sort(compareRecommended);
        break;
    }

    return nextCards;
  }

  function compareRecommended(a, b) {
    return (
      Number(b.featured) - Number(a.featured) ||
      b.freshness - a.freshness ||
      a.durationWeight - b.durationWeight ||
      a.index - b.index
    );
  }

  function getRecentRank(href) {
    const index = state.recent.indexOf(href);
    return index === -1 ? Number.MAX_SAFE_INTEGER : index;
  }

  function countCardsForCategory(categoryId) {
    const query = normalizeText(state.query);

    return preparedCards.filter((card) => {
      if (state.onlyFavorites && !state.favorites.has(card.href)) {
        return false;
      }

      if (categoryId !== "all" && card.categoryId !== categoryId) {
        return false;
      }

      if (query && !card.searchText.includes(query)) {
        return false;
      }

      return true;
    }).length;
  }

  function buildSummary(visibleCards) {
    const bits = [`显示 ${visibleCards.length} / ${preparedCards.length} 个作品`];

    if (state.category !== "all") {
      bits.push(categoryById.get(state.category).label);
    }

    if (state.query.trim()) {
      bits.push(`命中“${state.query.trim()}”`);
    }

    if (state.onlyFavorites) {
      bits.push(`收藏 ${state.favorites.size} 个`);
    }

    if (state.sort !== "recommended") {
      bits.push(`按${getSortLabel(state.sort)}排序`);
    }

    return `${bits.join(" · ")}。`;
  }

  function buildSubtitle(visibleCards) {
    if (visibleCards.length === 0) {
      return "没有找到匹配项。换个关键词，或者清空筛选后重新开始。";
    }

    if (!hasActiveFilters()) {
      return `${preparedCards.length} 个精选页面，覆盖像素策略、经典街机、互动内容与展示型实验。`;
    }

    const leadCard = visibleCards[0];
    return `当前筛出 ${visibleCards.length} 个结果，第一推荐是「${leadCard.title}」，属于 ${leadCard.categoryLabel}，适合 ${leadCard.durationLabel} 的一轮体验。`;
  }

  function resolveSpotlightCard(visibleCards) {
    if (visibleCards.length === 0) {
      return null;
    }

    const current = visibleCards.find((card) => card.href === state.spotlightHref);
    if (current) {
      return current;
    }

    state.spotlightMode = "auto";

    const fromRecent = visibleCards.find((card) => state.recent.includes(card.href));
    if (fromRecent) {
      return fromRecent;
    }

    return getDefaultSpotlight(visibleCards);
  }

  function getDefaultSpotlight(visibleCards) {
    return visibleCards.find((card) => card.href === "magnet-forge.html") ||
      visibleCards.find((card) => card.featured) ||
      visibleCards[0];
  }

  function getSpotlightLabel(card) {
    if (state.spotlightMode === "random") {
      return "随机点名";
    }

    if (state.spotlightMode === "shared") {
      return "共享视图";
    }

    if (state.onlyFavorites && state.favorites.has(card.href)) {
      return "你的收藏";
    }

    if (state.recent[0] === card.href) {
      return "继续上次那页";
    }

    if (card.featured) {
      return "编辑精选";
    }

    if (state.query.trim()) {
      return "搜索结果中的高匹配项";
    }

    return "今日推荐";
  }

  function getSortLabel(sortId) {
    switch (sortId) {
      case "recent":
        return "最近打开";
      case "quick":
        return "短平快优先";
      case "name":
        return "名称";
      default:
        return "编辑推荐";
    }
  }

  function shouldStretchCard(card) {
    return (
      card.featured &&
      state.category === "all" &&
      !state.query.trim() &&
      !state.onlyFavorites &&
      state.sort === "recommended"
    );
  }

  function toggleFavorite(href) {
    if (state.favorites.has(href)) {
      state.favorites.delete(href);
    } else {
      state.favorites.add(href);
    }

    saveStoredList(STORAGE_KEYS.favorites, [...state.favorites]);
    render();
  }

  function recordVisit(href) {
    state.recent = [href, ...state.recent.filter((item) => item !== href)].slice(0, RECENT_LIMIT);
    saveStoredList(STORAGE_KEYS.recent, state.recent);
  }

  function resetFilters() {
    state.query = "";
    state.category = "all";
    state.sort = "recommended";
    state.onlyFavorites = false;
    state.spotlightMode = "auto";
    state.spotlightHref = defaultSpotlightHref;
    resetRenderLimit();
    render();
  }

  function resetRenderLimit() {
    state.renderLimit = GRID_RENDER_BATCH;
  }

  function hasActiveFilters() {
    return state.category !== "all" || Boolean(state.query.trim()) || state.onlyFavorites || state.sort !== "recommended";
  }

  function getDefaultShareFeedback() {
    return hasShareableView()
      ? "当前视图链接已同步到地址栏，可直接收藏或复制。"
      : "当前是默认合集视图。";
  }

  function hasShareableView() {
    return Boolean(state.query.trim()) || state.category !== "all" || state.sort !== "recommended" || state.spotlightMode !== "auto";
  }

  function setShareFeedback(message, tone = "neutral") {
    elements.shareFeedback.textContent = message;

    if (tone === "neutral") {
      delete elements.shareFeedback.dataset.tone;
      return;
    }

    elements.shareFeedback.dataset.tone = tone;
  }

  function getShareableSpotlightHref() {
    return state.spotlightMode === "auto" ? null : state.spotlightHref;
  }

  function buildShareSearch() {
    if (!urlStateApi) {
      return "";
    }

    return urlStateApi.buildMenuViewSearch(
      {
        query: state.query,
        category: state.category,
        sort: state.sort,
        spotlightHref: getShareableSpotlightHref(),
      },
      urlStateOptions
    );
  }

  function syncLocationState() {
    if (!urlStateApi || !window.history || typeof window.history.replaceState !== "function") {
      return;
    }

    const nextUrl = new URL(window.location.href);
    nextUrl.search = buildShareSearch();

    const nextRelative = `${nextUrl.pathname}${nextUrl.search}${nextUrl.hash}`;
    const currentRelative = `${window.location.pathname}${window.location.search}${window.location.hash}`;

    if (nextRelative !== currentRelative) {
      window.history.replaceState(null, "", nextRelative);
    }
  }

  function buildShareUrl() {
    const nextUrl = new URL(window.location.href);
    nextUrl.search = buildShareSearch();
    return nextUrl.toString();
  }

  async function copyCurrentView() {
    try {
      await writeClipboardText(buildShareUrl());
      setShareFeedback("当前视图链接已复制。", "success");
    } catch {
      setShareFeedback("当前浏览器不允许自动复制，但地址栏里的链接已经是最新视图。", "warning");
    }
  }

  async function writeClipboardText(value) {
    if (navigator.clipboard && typeof navigator.clipboard.writeText === "function") {
      await navigator.clipboard.writeText(value);
      return;
    }

    const textarea = document.createElement("textarea");
    textarea.value = value;
    textarea.setAttribute("readonly", "true");
    textarea.style.position = "fixed";
    textarea.style.opacity = "0";
    textarea.style.pointerEvents = "none";
    document.body.appendChild(textarea);
    textarea.select();

    const copied = typeof document.execCommand === "function" && document.execCommand("copy");
    textarea.remove();

    if (!copied) {
      throw new Error("Clipboard copy is not available.");
    }
  }
})();
