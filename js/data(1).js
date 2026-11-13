/* ============================================================================
 * USI-Brain 可视化 — 数据层
 * 数据来源：《USI-Brain: Enhancing Underwater Spatial Intelligence via
 *   Spatial Data-Driven Vision-Language Modeling》(匿名投稿) 及补充材料
 * 所有数值均从论文正文 + 补充材料表格逐字转写，未做任何虚构。
 * ==========================================================================*/

/* ---------- 全局实体 → 颜色槽位映射（颜色值见 css 中的 --series-N） ---------- */
/* 槽位顺序固定，保证相邻色盲安全；USI-Brain 永远占用 slot 1（蓝色，高亮）。 */
window.ENTITY_COLOR = {
  'USI-Brain (ours)':           1,
  'Qwen3-VL-8B':                2,
  'Qwen3-VL-8B-Instruct':       2,
  'NAUTILUS (Qwen2.5-VL)':      3,
  'Nautilus-7B':                3,
  'NAUTILUS (LLaVA-1.5)':       4,
  'Qwen3-VL-30B-Instruct':      4,
  'Qwen2.5-VL-7B':              5,
  'OceanGPT-7B':                5,
  'Gemini-2.5-Flash':           6,
  'InternVL-3.5-24B':           6,
  'GLM-4.1V-9B':                7,
  'Qwen2.5-VL-72B':             7,
  'GLM-4.5V-106B':              8,
  'GPT-5.4':                    3,
  'Gemini':                     4,
  'Qwen3-VL-30B':               5,
};

/* 高亮实体（ours） */
window.OURS = 'USI-Brain (ours)';

/* ---------- 概览 KPI ---------- */
window.KPIS = [
  { value: '4.27M',  label: '数据引擎生成的高质量 VQA 对', note: '跨五大能力组' },
  { value: '6,525',  label: 'USI-Bench 诊断基准 QA 对',    note: 'held-out，五大能力组对齐' },
  { value: '+9.99',  label: '平均领先最强对手（百分点）',   note: '32 项外部指标等权归一后' },
  { value: '87.5%',  label: '外部基准「第一 / 并列第一」率', note: '27/32 新纪录 + 1/32 并列' },
  { value: '+6.37',  label: '相对 Qwen3-VL-8B-Instruct 平均增益', note: '绝对百分点' },
  { value: '+10.6',  label: 'USI-Bench 上超基线幅度',      note: '百分点' },
];

/* ---------- 五大能力组 ---------- */
window.CAPABILITIES = [
  { id: 1, en: 'Object Grounding & Understanding', zh: '物体定位与理解',   icon: '🎯', desc: '在退化水下图像中定位、指代并理解目标物体。' },
  { id: 2, en: '2D Relations & Layout',             zh: '2D 关系与布局',   icon: '🧭', desc: '理解物体的二维空间关系、相对位置与画面布局。' },
  { id: 3, en: '3D Depth & Stratification',         zh: '3D 深度与分层',   icon: '🌊', desc: '推断相对深度、前后遮挡与水层分层结构。' },
  { id: 4, en: 'Degradation-Aware Perception',      zh: '退化感知',        icon: '🌫️', desc: '在色偏、散射、模糊、低光等退化下保持感知鲁棒。' },
  { id: 5, en: 'Ecological Reasoning',              zh: '生态推理',        icon: '🪸', desc: '场景级生态理解：物种、基质、污染与灾情判断。' },
];

/* ---------- 五阶段数据引擎流水线 ---------- */
window.PIPELINE = [
  { stage: 1, zh: '水下图像增强', en: 'Hybrid Underwater Enhancement (HUE)',   desc: '标准化可见性，统一视觉输入，恢复退化图像的几何证据。', tag: 'HUE' },
  { stage: 2, zh: '2D 空间 QA 生成', en: '2D Spatial-QA Generation',           desc: '从标注图像生成 2D 关系、布局、定位类问答监督。',         tag: '2D QA' },
  { stage: 3, zh: '几何辅助 3D QA 生成', en: 'Geometry-Assisted 3D QA',        desc: '利用深度先验 + 重建线索，生成深度、分层、遮挡类监督。', tag: '3D QA' },
  { stage: 4, zh: '能力级组织', en: 'Capability-Level Organization',            desc: '将监督归入五大能力组，形成结构化课程。',               tag: '组织' },
  { stage: 5, zh: '专家过滤', en: 'Expert Filtering',                          desc: '过滤低质量样本，产出 4.27M 高质量 VQA 对。',           tag: '过滤' },
];

/* ---------- 关键方法组件 ---------- */
window.METHOD = [
  { key: 'HUE', zh: 'HUE 混合水下增强',       en: 'Hybrid Underwater Enhancement', desc: '在数据侧统一可见性、恢复边界与几何证据。' },
  { key: 'UPR', zh: 'UPR 先验引导校正器',     en: 'Underwater Prior-guided Rectifier', desc: '在特征空间对水下先验做校正，提升推理时鲁棒性。' },
  { key: 'Backbone', zh: '底座模型',          en: 'Qwen3-VL-8B',                desc: '以 Qwen3-VL-8B 为底座，特征空间 + 几何辅助监督微调。' },
];

/* ---------- 表 4：外部基准总体概况 ---------- */
window.SUMMARY = [
  { bench: 'NautData',                 zh: 'NautData',   newBest: 7,  jointBest: 0,  total: 7,  margin: 2.77 },
  { bench: 'UWBench VQA',              zh: 'UWBench VQA',newBest: 6,  jointBest: 0,  total: 8,  margin: 24.41 },
  { bench: 'UWBench Object Referring', zh: 'UWBench 指称',newBest: 5, jointBest: 0,  total: 5,  margin: 7.80 },
  { bench: 'MarineEval',               zh: 'MarineEval', newBest: 9,  jointBest: 1,  total: 12, margin: 5.50 },
];

/* ---------- 表 5：NautData（已统一到百分比，论文同款处理） ---------- */
/* 指标：Image Caption METEOR / Region Caption METEOR / VQA Acc /
 *        Grounding PR@0.5 / Grounding mIoU / Detection mAP / Detection mAP@0.5 */
window.NAUTDATA = {
  title: 'NautData 公开测试集',
  note: 'METEOR 与 VQA Acc 已按论文同款规则乘以 100 统一到百分比刻度。',
  metrics: ['图像描述\nMETEOR', '区域描述\nMETEOR', 'VQA\n准确率', '定位\nPR@0.5', '定位\nmIoU', '检测\nmAP', '检测\nmAP@0.5'],
  series: [
    { name: 'NAUTILUS (LLaVA-1.5)',  data: [20.8, 19.1, 36.5, 52.2, 46.2, 11.1, 20.9] },
    { name: 'NAUTILUS (Qwen2.5-VL)', data: [22.3, 19.9, 38.1, 58.8, 53.8, 25.8, 45.3] },
    { name: 'Qwen3-VL-8B',           data: [8.9,  9.7,  0.8,  45.2, 43.9, 14.8, 24.0] },
    { name: 'USI-Brain (ours)',      data: [24.5, 20.6, 47.8, 59.4, 56.4, 27.9, 46.8] },
  ],
};

/* ---------- 表 6：UWBench VQA 分类别 ---------- */
window.UWBENCH_VQA = {
  title: 'UWBench VQA 分类别',
  note: '官方 UWBench 测试集同协议评测；USI-Brain 在多数类别大幅领先，在几何/形状类（Position/Shape）落后。',
  metrics: ['数量与\n存在性', '推理与\n比较', '水质与\n能见度', '物体属性\n与特征', '基质与\n材质', '位置与\n空间关系', '颜色纹理\n与图案', '形状尺寸\n与形态'],
  series: [
    { name: 'Gemini-2.5-Flash', data: [1.47,  26.14, 40.77, 24.37, 47.58, 61.55, 45.26, 71.42] },
    { name: 'Qwen2.5-VL-7B',    data: [49.91, 23.24, 35.54, 24.37, 42.24, 55.66, 38.95, 64.42] },
    { name: 'GLM-4.1V-9B',      data: [2.33,  26.97, 39.94, 28.12, 47.17, 61.27, 45.02, 71.98] },
    { name: 'GLM-4.5V-106B',    data: [8.73,  29.05, 40.22, 27.50, 49.85, 62.48, 48.78, 72.52] },
    { name: 'USI-Brain (ours)', data: [92.72, 85.11, 82.50, 78.09, 72.45, 56.73, 56.33, 52.79] },
  ],
};

/* ---------- 表 7：UWBench Object Referring ---------- */
window.OBJ_REF = {
  title: 'UWBench 物体指称',
  note: '前四项为官方定位指标，末项 CLAIR 为补充裁判式开放质量分；USI-Brain 五项全领先。',
  metrics: ['Acc@IoU0.5', 'Acc@IoU0.7', 'mIoU', 'Cum IoU', 'CLAIR'],
  series: [
    { name: 'Qwen2.5-VL-7B',         data: [37.15, 11.76, 32.77, 33.69, 87.28] },
    { name: 'Qwen2.5-VL-72B',        data: [90.90, 74.71, 77.90, 81.50, 88.76] },
    { name: 'InternVL-3.5-24B',      data: [84.76, 64.14, 71.99, 76.98, 88.99] },
    { name: 'Qwen3-VL-30B-Instruct', data: [94.40, 80.38, 80.18, 51.67, 88.58] },
    { name: 'GLM-4.5V-106B',         data: [89.21, 75.38, 79.26, 80.51, 88.63] },
    { name: 'USI-Brain (ours)',      data: [96.80, 94.25, 91.05, 92.07, 90.27] },
  ],
};

/* ---------- 表 8：MarineEval ---------- */
window.MARINEEVAL = {
  title: 'MarineEval 测试集',
  note: '统一三裁判协议（Gemini-3-Pro-Preview / GPT-5.5 / Claude Opus 4.7），全部为百分比；USI-Brain 9/12 领先 + 1 并列。',
  metrics: ['数量\n估计', '视觉\n定位', '空间\n关系', '深度\n判断', '指令\n功能', '身份\n行为', '性状\n抽取', '威胁\n判定', '污染\n定位', '灾情\n诊断', '物种\n理解', '海洋技术\n理解'],
  series: [
    { name: 'Nautilus-7B',   data: [11.00, 33.00, 7.00,  24.00, 60.00, 36.00, 77.00, 15.00, 33.00, 94.00, 27.70, 60.00] },
    { name: 'OceanGPT-7B',   data: [20.00, 20.00, 2.00,  0.00,  28.00, 1.00,  33.00, 0.00,  31.00, 85.00, 18.00, 28.00] },
    { name: 'Qwen3-VL-8B',   data: [34.00, 84.00, 14.00, 29.00, 66.00, 63.00, 87.00, 32.00, 40.00, 93.00, 51.80, 71.00] },
    { name: 'USI-Brain (ours)', data: [46.00, 93.00, 29.00, 31.00, 77.00, 69.00, 89.00, 51.00, 37.00, 94.00, 43.83, 72.00] },
  ],
};

/* ---------- 对话知识库（离线可用的论文问答） ---------- */
window.KB = [
  {
    id: 'intro',
    title: 'USI-Brain 是什么',
    keywords: ['是什么', '介绍', '简介', '干啥', '什么', 'who', 'intro', '是什么模型', '介绍一下'],
    answer: 'USI-Brain 是首个面向**水下空间智能**的视觉语言模型（VLM）。它用 Qwen3-VL-8B 作为底座，通过一个五阶段的水下空间数据引擎产出的 427 万条高质量 VQA 对进行微调，并用 UPR 做特征空间校正。它擅长在水下退化场景中做物体定位、2D/3D 空间推理、退化感知与生态推理。',
  },
  {
    id: 'contributions',
    title: '三大贡献',
    keywords: ['贡献', '创新', '做了什么', 'contribution', '亮点', 'novel'],
    answer: '论文有三大贡献：\n1. **首个水下空间数据引擎**——五阶段流水线，把异构的水下资源（语义 QA、密集标注、增强、深度）转成结构化监督，产出 4.27M 条 QA；\n2. **USI-Brain 模型**——基于 Qwen3-VL-8B，用「增强感知 + 几何辅助」监督训练；\n3. **USI-Bench 基准**——6,525 条 held-out QA，对齐五大能力组，用于诊断性评测。',
  },
  {
    id: 'backbone',
    title: '底座模型',
    keywords: ['底座', '骨干', 'backbone', '基座', 'qwen', 'Qwen', '8B', '权重', '用什么模型'],
    answer: '底座是 **Qwen3-VL-8B**（你所说的「QwenVL-8B」）。论文相对 Qwen3-VL-8B-Instruct 报告了 +6.37 点的平均绝对增益，在 USI-Bench 上超基线 +10.6 点。目前只有训练好的权重，没有全部训练代码。',
  },
  {
    id: 'engine',
    title: '数据引擎（五阶段）',
    keywords: ['数据引擎', '引擎', '流水线', 'pipeline', '五阶段', '阶段', '数据', '4.27', '427', '多少数据'],
    answer: '五阶段流水线：\n① 水下图像增强（HUE，统一可见性）→ ② 2D 空间 QA 生成 → ③ 几何辅助 3D QA 生成（深度先验 + 重建线索）→ ④ 能力级组织（归入五大能力组）→ ⑤ 专家过滤。最终产出 **4.27M** 条高质量 VQA 对。',
  },
  {
    id: 'hue',
    title: 'HUE 是什么',
    keywords: ['HUE', '增强', 'enhancement', '混合增强'],
    answer: 'HUE（Hybrid Underwater Enhancement，混合水下增强）是数据引擎第一步，负责标准化水下图像的可见性，恢复因波长衰减、后向散射、色偏、悬浮颗粒、低光照而丢失的边界与几何证据。',
  },
  {
    id: 'upr',
    title: 'UPR 是什么',
    keywords: ['UPR', '校正', 'rectifier', '先验', '特征'],
    answer: 'UPR（Underwater Prior-guided Rectifier，水下先验引导校正器）在**特征空间**对模型做校正，提升推理时的特征鲁棒性。它把「监督构建（HUE + 几何提升）」与「模型侧特征纠偏（UPR）」解耦。',
  },
  {
    id: 'capabilities',
    title: '五大能力组',
    keywords: ['能力', '五大', 'capability', '能力组', '覆盖', '维度'],
    answer: '五大能力组：\n① 物体定位与理解（Object Grounding & Understanding）\n② 2D 关系与布局（2D Relations & Layout）\n③ 3D 深度与分层（3D Depth & Stratification）\n④ 退化感知（Degradation-Aware Perception）\n⑤ 生态推理（Ecological Reasoning）',
  },
  {
    id: 'bench',
    title: 'USI-Bench 基准',
    keywords: ['bench', '基准', '测试', '6525', '6,525', '评测', 'benchmark'],
    answer: 'USI-Bench 是论文提出的诊断性基准，含 **6,525** 条 held-out QA，与五大能力组对齐，覆盖 grounding、空间推理、退化感知、场景级生态理解。',
  },
  {
    id: 'overall',
    title: '总体结果',
    keywords: ['总体', '结果', '总结果', '多少', '提升', 'overall', '9.99', '87.5', '87.5%'],
    answer: '外部基准总体：**27/32 指标新纪录 + 1/32 并列第一，第一/并列第一率达 87.5%**；所有指标归一为百分比等权后，平均领先最强对手 **+9.99 点**。相对 Qwen3-VL-8B-Instruct 平均增益 +6.37 点。',
  },
  {
    id: 'nautdata',
    title: 'NautData 结果',
    keywords: ['nautdata', 'nautilus', 'caption', '描述', '检测', 'grounding', '定位'],
    answer: 'NautData 上 USI-Brain 7/7 全领先，平均领先 +2.77 点。亮点：VQA 准确率 47.8%（Qwen3-VL-8B 仅 0.8%），定位 PR@0.5 达 59.4，检测 mAP 27.9，全面超越 NAUTILUS 与 Qwen3-VL-8B。',
  },
  {
    id: 'uwbench_vqa',
    title: 'UWBench VQA 结果',
    keywords: ['uwbench', 'vqa', '问答', '数量', '存在', '推理', '属性'],
    answer: 'UWBench VQA 上 USI-Brain 6/8 领先，平均领先 +24.41 点（增益最猛的基准）。数量/存在性 92.72、推理/比较 85.11、水质/能见度 82.50、物体属性 78.09，远超 Gemini / GLM 等大模型。但「位置/空间关系」（56.73）与「形状/尺寸」（52.79）落后于 GLM-4.5V。',
  },
  {
    id: 'objref',
    title: '物体指称结果',
    keywords: ['指称', 'referring', 'refer', 'iou', 'claim', '定位精度'],
    answer: 'UWBench 物体指称上 USI-Brain **5/5 全领先**，平均 +7.80 点：Acc@IoU0.5 = 96.80、Acc@IoU0.7 = 94.25（严格 IoU 阈值下增益最大）、mIoU 91.05、Cum IoU 92.07、CLAIR 90.27。',
  },
  {
    id: 'marineeval',
    title: 'MarineEval 结果',
    keywords: ['marineeval', 'marine', '海洋', '威胁', '物种', '污染', '灾情'],
    answer: 'MarineEval 上 USI-Brain 9/12 领先 + 1 并列（灾情诊断 94 与 Nautilus-7B 并列），平均 +5.50 点。强项：视觉定位 93、性状抽取 89、指令功能 77、身份行为 69、海洋技术理解 72。弱项：污染定位 37（低于 Qwen3-VL-8B 的 40）、物种理解 43.83（低于 51.80）。',
  },
  {
    id: 'weakness',
    title: '弱点与不足',
    keywords: ['弱点', '不足', '差', '落后', '失败', '缺陷', '缺点', 'limitation', '哪里差'],
    answer: '论文承认的不足主要在**粗粒度几何/形状类**：UWBench 的「位置/空间关系」「形状/尺寸」落后于 GLM-4.5V-106B；MarineEval 的「污染定位」「物种理解」落后于 Qwen3-VL-8B。也即：USI-Brain 在语义/退化/属性类极强，但在纯几何形态与部分生态专类上仍有差距。',
  },
  {
    id: 'compare_baselines',
    title: '对比的方法',
    keywords: ['对比', '基线', 'baseline', '比较', '对手', '哪些模型'],
    answer: '对比对象覆盖三类：\n• 水下专用模型：NAUTILUS（LLaVA-1.5 / Qwen2.5-VL）、Nautilus-7B、OceanGPT-7B；\n• 通用大模型：Qwen2.5-VL-7B/72B、Qwen3-VL-8B/30B、InternVL-3.5-24B、GLM-4.1V-9B、GLM-4.5V-106B、Gemini-2.5-Flash。',
  },
  {
    id: 'train',
    title: '训练与权重情况',
    keywords: ['训练', '权重', '代码', '复现', '训练代码', 'weight', '怎么训', '模型文件'],
    answer: '当前只有训练好的**权重**，没有全部训练代码。前端展示的是论文已报告的结果；如需跑真实推理，需要把权重用 vLLM / SGLang 等服务框架拉起，再在右上角「模型接入」里配置一个 OpenAI 兼容接口。',
  },
  {
    id: 'greet',
    title: '问候',
    keywords: ['你好', 'hello', 'hi', '在吗', '嗨', 'hey'],
    answer: '你好！我是 USI-Brain 论文助手。你可以问我：模型是什么、三大贡献、数据引擎、五大能力组、各基准结果（NautData / UWBench / MarineEval）、弱点在哪等。也可以点右下角「模型接入」把真实权重接进来对话。',
  },
  {
    id: 'help',
    title: '帮助',
    keywords: ['帮助', 'help', '能问什么', '会什么', '功能', '怎么用', '指令'],
    answer: '我可以回答论文相关内容：\n• 概述：USI-Brain 是什么 / 三大贡献\n• 方法：数据引擎五阶段、HUE、UPR、五大能力组\n• 结果：总体 +9.99 点、NautData、UWBench VQA、物体指称、MarineEval\n• 局限：哪里落后\n你也可以直接问数字，如「USI-Bench 多少条」「领先多少」。',
  },
];

/* ---------- 对话引擎的兜底回复 ---------- */
window.KB_FALLBACK = '这个问题我暂时没有在论文里找到直接答案。你可以试试问：USI-Brain 是什么、三大贡献、数据引擎五阶段、五大能力组、NautData / UWBench / MarineEval 的结果，或「领先多少」。也可以接入真实模型权重获得更自由的对话。';

/* ---------- 表 3：USI-Bench 主结果（我们的基准） ---------- */
window.USIBENCH = {
  note: '15 个子能力、5 大能力组。相对底座 Qwen3-VL-8B-Instruct，USI-Brain 在 15 个里提升 12 个（增强版 13 个）；最大增益：场景理解 +22.5、描述 +17.0、退化结构感知 +15.7、深度排序 +10.1。',
  metrics: [
    '身份识别', '定位', '计数', '检测',        // 物体定位与理解
    '描述', '关系', '距离',                    // 2D 关系与布局
    '深度', '视角', '排序', '前景背景',        // 3D 深度与分层
    '环境', '结构',                           // 退化感知
    '场景', '生态',                           // 场景与生态
  ],
  series: [
    { name: 'USI-Brain (ours)', data: [73.1, 90.8, 42.4, 55.5, 55.9, 71.4, 69.0, 82.7, 84.8, 82.3, 22.6, 77.8, 62.2, 47.3, 58.8] },
    { name: 'Qwen3-VL-8B-Instruct', data: [64.7, 85.4, 42.9, 47.9, 38.9, 65.8, 69.9, 76.0, 79.1, 72.2, 18.5, 81.2, 46.5, 42.8, 58.4] },
    { name: 'GPT-5.4', data: [50.5, 49.6, 46.3, 8.9, 53.2, 60.5, 75.2, 58.4, 83.3, 76.4, 19.7, 82.7, 80.9, 68.0, 75.0] },
    { name: 'Gemini', data: [50.1, 8.7, 45.0, 0.1, 45.4, 73.0, 77.0, 61.7, 77.2, 80.2, 19.2, 76.5, 83.7, 68.2, 64.7] },
    { name: 'Qwen3-VL-30B', data: [67.6, 86.4, 46.5, 49.4, 31.3, 68.5, 72.6, 77.5, 82.0, 80.9, 19.0, 84.9, 61.1, 43.3, 61.3] },
  ],
};
