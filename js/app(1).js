/* ============================================================================
 * USI-Brain 可视化 — 应用逻辑（海洋主题 / 下划页 / 模型对比）
 * 依赖：echarts.min.js（本地 vendor）、data.js
 * ==========================================================================*/
(function () {
  'use strict';

  /* ---------- 工具 ---------- */
  const $ = (sel, root) => (root || document).querySelector(sel);
  const $$ = (sel, root) => Array.from((root || document).querySelectorAll(sel));

  function cssVar(name) {
    return getComputedStyle(document.documentElement).getPropertyValue(name).trim();
  }
  function seriesColor(name) {
    const slot = window.ENTITY_COLOR[name] || 1;
    return cssVar('--series-' + slot);
  }
  function isOurs(name) { return name === window.OURS; }
  function escapeHtml(s) {
    return String(s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  }

  /* ---------- 图表注册表 ---------- */
  const charts = {};
  function buildOption(key, option) { charts[key] = { el: document.getElementById(key), option }; }
  function renderChart(key) {
    const entry = charts[key];
    if (!entry || !entry.el) return;
    if (entry.el.offsetParent === null) return;
    let inst = echarts.getInstanceByDom(entry.el);
    if (!inst) inst = echarts.init(entry.el);
    inst.setOption(entry.option, true);
    inst.resize();
  }
  function renderAll() { Object.keys(charts).forEach(renderChart); }

  function axisStyle() {
    return {
      axisLine: { lineStyle: { color: cssVar('--baseline') } },
      axisTick: { show: false },
      axisLabel: { color: cssVar('--text-muted'), fontSize: 11 },
      splitLine: { lineStyle: { color: cssVar('--gridline') } },
    };
  }

  function fmt(v) {
    if (v == null) return '—';
    return Math.abs(v) >= 100 ? String(Math.round(v)) : String(Math.round(v * 100) / 100);
  }

  function groupedBarOption(cfg) {
    const color = cfg.series.map((s) => seriesColor(s.name));
    return {
      color,
      tooltip: {
        trigger: 'axis',
        axisPointer: { type: 'shadow' },
        backgroundColor: cssVar('--card-solid'),
        borderColor: cssVar('--border'),
        textStyle: { color: cssVar('--text-primary'), fontSize: 12 },
        formatter: function (params) {
          const rows = params.slice().sort((a, b) => b.value - a.value).map((p) => {
            const star = isOurs(p.seriesName) ? ' ★' : '';
            return `<span style="display:inline-block;width:9px;height:9px;border-radius:2px;background:${p.color};margin-right:6px"></span>${p.seriesName}${star}：<b>${fmt(p.value)}</b>`;
          });
          return `<div style="font-weight:600;margin-bottom:4px">${params[0].name}</div>` + rows.join('<br/>');
        },
      },
      legend: {
        textStyle: { color: cssVar('--text-secondary'), fontSize: 12 },
        bottom: 0,
        formatter: (name) => (isOurs(name) ? name + ' ★' : name),
      },
      grid: { left: 8, right: 16, top: 30, bottom: 46, containLabel: true },
      xAxis: {
        type: 'category', data: cfg.metrics, ...axisStyle(),
        axisLabel: { color: cssVar('--text-secondary'), fontSize: 11, interval: 0 },
      },
      yAxis: {
        type: 'value', max: cfg.max, ...axisStyle(),
        axisLabel: { color: cssVar('--text-muted'), fontSize: 11 },
      },
      series: cfg.series.map((s) => ({
        name: s.name, type: 'bar', data: s.data, barMaxWidth: 20,
        itemStyle: {
          borderRadius: isOurs(s.name) ? [4, 4, 0, 0] : [3, 3, 0, 0],
          ...(isOurs(s.name) ? { borderColor: cssVar('--text-primary'), borderWidth: 1 } : {}),
        },
        emphasis: { itemStyle: { opacity: 0.9 } },
      })),
    };
  }

  function buildAllOptions() {
    const sum = window.SUMMARY;
    buildOption('chart-summary-rate', {
      tooltip: {
        trigger: 'axis', axisPointer: { type: 'shadow' },
        backgroundColor: cssVar('--card-solid'), borderColor: cssVar('--border'),
        textStyle: { color: cssVar('--text-primary'), fontSize: 12 },
        formatter: (p) => {
          const it = sum[p[0].dataIndex];
          return `<b>${it.zh}</b><br/>新纪录 ${it.newBest}/${it.total} · 并列 ${it.jointBest}<br/>第一/并列率：<b>${(100 * (it.newBest + it.jointBest) / it.total).toFixed(1)}%</b>`;
        },
      },
      grid: { left: 8, right: 60, top: 16, bottom: 26, containLabel: true },
      xAxis: { type: 'value', ...axisStyle(), axisLabel: { color: cssVar('--text-muted'), fontSize: 11 } },
      yAxis: { type: 'category', data: sum.map((s) => s.zh), ...axisStyle(), axisLabel: { color: cssVar('--text-secondary'), fontSize: 12 } },
      series: [
        { name: '新纪录', type: 'bar', stack: 't', data: sum.map((s) => s.newBest), barWidth: 18, itemStyle: { color: cssVar('--series-1') } },
        { name: '并列第一', type: 'bar', stack: 't', data: sum.map((s) => s.jointBest), barWidth: 18, itemStyle: { color: cssVar('--series-4') } },
        {
          name: '剩余', type: 'bar', stack: 't', data: sum.map((s) => s.total - s.newBest - s.jointBest),
          barWidth: 18, itemStyle: { color: cssVar('--gridline') }, tooltip: { show: false },
          label: {
            show: true, position: 'right', color: cssVar('--text-secondary'), fontSize: 11,
            formatter: (p) => { const it = sum[p.dataIndex]; return `${it.newBest + it.jointBest}/${it.total}`; },
          },
        },
      ],
      legend: { show: false },
    });

    buildOption('chart-summary-margin', {
      tooltip: {
        trigger: 'axis', axisPointer: { type: 'shadow' },
        backgroundColor: cssVar('--card-solid'), borderColor: cssVar('--border'),
        textStyle: { color: cssVar('--text-primary'), fontSize: 12 },
        formatter: (p) => `<b>${p[0].name}</b><br/>平均领先：<b>+${p[0].value} 点</b>`,
      },
      grid: { left: 8, right: 60, top: 16, bottom: 26, containLabel: true },
      xAxis: { type: 'value', ...axisStyle(), axisLabel: { color: cssVar('--text-muted'), fontSize: 11 } },
      yAxis: { type: 'category', data: sum.map((s) => s.zh), ...axisStyle(), axisLabel: { color: cssVar('--text-secondary'), fontSize: 12 } },
      series: [{
        name: '平均领先（点）', type: 'bar', data: sum.map((s) => s.margin), barWidth: 18,
        itemStyle: { color: cssVar('--series-1'), borderRadius: [0, 4, 4, 0] },
        label: { show: true, position: 'right', color: cssVar('--text-secondary'), fontSize: 11, formatter: (p) => '+' + p.value },
      }],
    });

    buildOption('chart-nautdata', groupedBarOption({ metrics: window.NAUTDATA.metrics, series: window.NAUTDATA.series, max: 100 }));
    buildOption('chart-uwbench', groupedBarOption({ metrics: window.UWBENCH_VQA.metrics, series: window.UWBENCH_VQA.series, max: 100 }));
    buildOption('chart-objref', groupedBarOption({ metrics: window.OBJ_REF.metrics, series: window.OBJ_REF.series, max: 100 }));
    buildOption('chart-marineeval', groupedBarOption({ metrics: window.MARINEEVAL.metrics, series: window.MARINEEVAL.series, max: 100 }));
    buildOption('chart-usibench', groupedBarOption({ metrics: window.USIBENCH.metrics, series: window.USIBENCH.series, max: 100 }));
  }

  /* ---------- 静态内容 ---------- */
  function renderOverview() {
    $('#kpi-grid').innerHTML = window.KPIS.map((k) => `
      <div class="kpi">
        <div class="value">${k.value}</div>
        <div class="label">${k.label}</div>
        <div class="note">${k.note}</div>
      </div>`).join('');

    $('#cap-grid').innerHTML = window.CAPABILITIES.map((c) => `
      <div class="cap">
        <div class="cap-icon">${c.icon}</div>
        <div class="cap-zh">${c.id}. ${c.zh}</div>
        <div class="cap-en">${c.en}</div>
        <div class="cap-desc">${c.desc}</div>
      </div>`).join('');

    $('#pipeline').innerHTML = window.PIPELINE.map((s) => `
      <div class="pipe-step">
        <div class="num">${s.stage}</div>
        <div class="zh">${s.zh}</div>
        <div class="en">${s.en}</div>
        <div class="desc">${s.desc}</div>
        <span class="tag">${s.tag}</span>
      </div>`).join('');

    $('#method-grid').innerHTML = window.METHOD.map((m) => `
      <div class="method-card">
        <div class="key">${m.key}</div>
        <div class="zh">${m.zh}</div>
        <div class="en">${m.en}</div>
        <div class="desc">${m.desc}</div>
      </div>`).join('');
  }

  function renderTables() {
    const defs = [
      { key: 'nautdata', data: window.NAUTDATA },
      { key: 'uwbench', data: window.UWBENCH_VQA },
      { key: 'objref', data: window.OBJ_REF },
      { key: 'marineeval', data: window.MARINEEVAL },
      { key: 'usibench', data: window.USIBENCH },
    ];
    defs.forEach((d) => {
      const host = $('#table-' + d.key);
      if (!host) return;
      const head = `<tr><th>方法</th>${d.data.metrics.map((m) => `<th>${m.replace(/\n/g, ' ')}</th>`).join('')}</tr>`;
      const rows = d.data.series.map((s) => {
        const cls = isOurs(s.name) ? ' class="ours"' : '';
        const sw = seriesColor(s.name);
        return `<tr${cls}><td><span class="swatch" style="background:${sw}"></span>${s.name}${isOurs(s.name) ? '<span class="ours-tag">ours</span>' : ''}</td>${s.data.map((v) => `<td>${fmt(v)}</td>`).join('')}</tr>`;
      }).join('');
      host.innerHTML = `<table class="data">${head}${rows}</table>`;
    });
  }

  /* ---------- 海洋气泡 ---------- */
  function spawnBubbles() {
    const host = $('#ocean-bg');
    if (!host) return;
    for (let i = 0; i < 14; i++) {
      const b = document.createElement('div');
      b.className = 'bubble';
      const size = 6 + Math.random() * 26;
      b.style.width = b.style.height = size + 'px';
      b.style.left = Math.random() * 100 + 'vw';
      b.style.animationDuration = (14 + Math.random() * 18) + 's';
      b.style.animationDelay = (Math.random() * 20) + 's';
      host.appendChild(b);
    }
  }

  /* ---------- 滚动高亮（scrollspy） ---------- */
  function initScrollSpy() {
    const links = $$('.nav a');
    const map = {};
    links.forEach((a) => { map[a.getAttribute('href').slice(1)] = a; });
    const sections = ['overview', 'method', 'results', 'compare'].map((id) => document.getElementById(id));
    const obs = new IntersectionObserver((entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) {
          links.forEach((a) => a.classList.remove('active'));
          const a = map[e.target.id];
          if (a) a.classList.add('active');
        }
      });
    }, { rootMargin: '-40% 0px -55% 0px' });
    sections.forEach((s) => s && obs.observe(s));
  }

  /* ---------- 极简 markdown（安全：先转义再渲染，不做链接） ---------- */
  function inlineMd(s) {
    return s
      .replace(/`([^`]+)`/g, '<code>$1</code>')
      .replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>')
      .replace(/(^|[^*])\*([^*\s][^*]*)\*/g, '$1<em>$2</em>');
  }
  function renderMarkdown(src) {
    if (!src) return '';
    const lines = String(src).replace(/\r\n?/g, '\n').split('\n');
    let html = '', inCode = false, codeBuf = [], inUl = false, inOl = false;
    const closeLists = () => { if (inUl) { html += '</ul>'; inUl = false; } if (inOl) { html += '</ol>'; inOl = false; } };

    for (const raw of lines) {
      const line = raw.replace(/\s+$/, '');
      if (line.trim().startsWith('```')) {
        if (inCode) { html += '<pre><code>' + codeBuf.join('\n') + '</code></pre>'; codeBuf = []; inCode = false; }
        else { closeLists(); inCode = true; }
        continue;
      }
      if (inCode) { codeBuf.push(escapeHtml(line)); continue; }

      const t = line.trim();
      if (!t) { closeLists(); continue; }

      const h = t.match(/^(#{1,4})\s+(.*)$/);
      if (h) { closeLists(); html += `<h${h[1].length}>${inlineMd(escapeHtml(h[2]))}</h${h[1].length}>`; continue; }
      if (t.startsWith('> ')) { closeLists(); html += `<blockquote>${inlineMd(escapeHtml(t.slice(2)))}</blockquote>`; continue; }
      if (/^(-{3,}|\*{3,})$/.test(t)) { closeLists(); html += '<hr/>'; continue; }
      if (/^[-*+]\s+/.test(t)) { if (!inUl) { closeLists(); html += '<ul>'; inUl = true; } html += `<li>${inlineMd(escapeHtml(t.replace(/^[-*+]\s+/, '')))}</li>`; continue; }
      if (/^\d+[.)]\s+/.test(t)) { if (!inOl) { closeLists(); html += '<ol>'; inOl = true; } html += `<li>${inlineMd(escapeHtml(t.replace(/^\d+[.)]\s+/, '')))}</li>`; continue; }

      closeLists();
      html += `<p>${inlineMd(escapeHtml(t))}</p>`;
    }
    if (inCode) html += '<pre><code>' + codeBuf.join('\n') + '</code></pre>';
    closeLists();
    return html;
  }

  /* ---------- 知识库问答（作为离线「伪模型」） ---------- */
  function kbAnswer(query) {
    const q = query.toLowerCase().trim();
    const GENERIC = ['什么', '结果', '数据', '多少', '怎么', '如何', '怎么样', '哪些', '哪个', '为什么', '介绍'];
    let best = null, bestScore = 0;
    for (const e of window.KB) {
      let score = 0;
      for (const kw of e.keywords) {
        const k = kw.toLowerCase();
        if (!k) continue;
        if (q.includes(k) || (q.length <= k.length && k.includes(q))) score += GENERIC.includes(k) ? 1 : k.length;
      }
      if (score > bestScore) { bestScore = score; best = e; }
    }
    return (best && bestScore >= 2) ? best.answer : window.KB_FALLBACK;
  }

  /* ---------- 模型对比（多模型来源） ---------- */
  const KB_VALUE = 'kb';
  const CARD_COUNT = 3;

  const DEFAULT_PROVIDERS = [
    { label: '本地 USI-Brain', baseUrl: 'http://localhost:8000/v1', apiKey: '', models: ['USI-Brain'], protocol: 'openai' },
    { label: 'MoreCode 中转站', baseUrl: 'http://www.1314mc.net:3333/v1', apiKey: '', models: ['gpt-5.4', 'glm-5-turbo', 'gemini-3.1-pro'], protocol: 'openai' },
    { label: 'MoreCode · Claude', baseUrl: 'http://www.1314mc.net:3333', apiKey: '', models: ['claude-sonnet-4-6', 'claude-opus-4-6'], protocol: 'anthropic' },
  ];

  const state = {
    providers: [],
    lastQuestion: '',
    pendingImage: null,
  };

  function loadCfg() {
    const normalize = (arr) => arr.map((p) => ({ ...p, protocol: p.protocol === 'anthropic' ? 'anthropic' : 'openai' }));
    try {
      const saved = JSON.parse(localStorage.getItem('usi-providers') || 'null');
      if (Array.isArray(saved) && saved.length) { state.providers = normalize(saved); return; }
    } catch (e) {}
    // 从旧的单端点配置迁移（如有）
    try {
      const old = JSON.parse(localStorage.getItem('usi-model-v2') || 'null');
      if (old && (old.baseUrl || old.apiKey)) {
        state.providers = normalize([
          JSON.parse(JSON.stringify(DEFAULT_PROVIDERS[0])),
          { label: 'MoreCode 中转站', baseUrl: old.baseUrl || DEFAULT_PROVIDERS[1].baseUrl, apiKey: old.apiKey || '', models: (Array.isArray(old.models) && old.models.length ? old.models : DEFAULT_PROVIDERS[1].models.slice()), protocol: 'openai' },
        ]);
        return;
      }
    } catch (e) {}
    state.providers = normalize(JSON.parse(JSON.stringify(DEFAULT_PROVIDERS)));
  }

  // 展平所有来源的模型 -> [{ value, label }]（下拉只显示模型名，不显示来源前缀）
  function allModelOptions() {
    const opts = [{ value: KB_VALUE, label: '📚 论文知识库（离线）' }];
    state.providers.forEach((p, pi) => {
      (p.models || []).forEach((m) => {
        opts.push({ value: pi + '::' + m, label: m });
      });
    });
    return opts;
  }

  function parseModelValue(value) {
    if (value === KB_VALUE) return { kind: 'kb' };
    const i = String(value).indexOf('::');
    if (i < 0) return { kind: 'kb' };
    const pi = Number(value.slice(0, i));
    const model = value.slice(i + 2);
    const provider = state.providers[pi];
    if (!provider) return { kind: 'kb' };
    return { kind: 'api', provider, model };
  }

  function defaultSelections() {
    const apiOpts = allModelOptions().filter((o) => o.value !== KB_VALUE);
    const picks = [];
    const usi = apiOpts.find((o) => /usi|qwen|vl|vision/i.test(o.value));
    if (usi) picks.push(usi.value);
    for (const o of apiOpts) { if (picks.length >= CARD_COUNT) break; if (!picks.includes(o.value)) picks.push(o.value); }
    while (picks.length < CARD_COUNT) picks.push(KB_VALUE);
    return picks;
  }

  function buildCompareCards() {
    const grid = $('#compare-grid');
    grid.innerHTML = '';
    for (let i = 0; i < CARD_COUNT; i++) {
      const card = document.createElement('div');
      card.className = 'model-card';
      card.dataset.idx = i;
      card.innerHTML = `
        <div class="model-card-head">
          <select class="model-select" data-idx="${i}"></select>
          <button class="regenerate" data-idx="${i}" title="重新生成">↻</button>
        </div>
        <div class="model-answer" data-idx="${i}"><div class="placeholder">输入问题后点击「对比生成」</div></div>
        <div class="model-meta"><span class="model-name" data-idx="${i}">—</span><span class="latency" data-idx="${i}"></span></div>`;
      grid.appendChild(card);
    }
    populateSelects();
    const defaults = defaultSelections();
    const selects = $$('.model-select');
    selects.forEach((s, i) => {
      if (defaults[i] && [...s.options].some((o) => o.value === defaults[i])) s.value = defaults[i];
      updateMeta(s.dataset.idx);
    });
    $$('.model-select').forEach((s) => { s.onchange = () => updateMeta(s.dataset.idx); });
    $$('.regenerate').forEach((b) => { b.onclick = () => generateCard(Number(b.dataset.idx), true); });
  }

  function populateSelects() {
    const options = allModelOptions();
    $$('.model-select').forEach((s) => {
      const cur = s.value;
      s.innerHTML = options.map((o) => `<option value="${escapeHtml(o.value)}">${escapeHtml(o.label)}</option>`).join('');
      if ([...s.options].some((o) => o.value === cur)) s.value = cur;
    });
  }

  function updateMeta(idx) {
    const val = $(`.model-select[data-idx="${idx}"]`).value;
    const parsed = parseModelValue(val);
    const name = parsed.kind === 'kb' ? '论文知识库' : parsed.model;
    $(`.model-name[data-idx="${idx}"]`).textContent = name;
  }

  function cleanApiKey(key) {
    // 去掉可能导致 fetch 报错的非 ISO-8859-1 字符（中文、全角空格等）
    return String(key || '').replace(/[^\x00-\xFF]/g, '').trim();
  }

  // pinggy 免费隧道：给请求加 X-Pinggy-No-Screen: 1 头即可绕过浏览器拦截页（无需 cookie）
  function isPinggy(provider) { return /pinggy/i.test(provider.baseUrl || ''); }

  async function callAnthropic(provider, model, question, imageDataUrl) {
    const baseUrl = (provider.baseUrl || '').replace(/\/+$/, '');
    if (!baseUrl) throw new Error('该模型来源未配置 Base URL（Ctrl+F 打开配置）');
    const content = [];
    if (question.trim()) content.push({ type: 'text', text: question });
    if (imageDataUrl) {
      const m = imageDataUrl.match(/^data:([^;]+);base64,(.+)$/);
      if (m) content.push({ type: 'image', source: { type: 'base64', media_type: m[1], data: m[2] } });
    }
    const url = baseUrl + '/v1/messages';
    const res = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': cleanApiKey(provider.apiKey),
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({ model, max_tokens: 2048, messages: [{ role: 'user', content }] }),
    });
    const text = await res.text();
    let data = null; try { data = JSON.parse(text); } catch (e) { data = null; }
    if (!data) {
      const isHtml = /^\s*<!doctype|<html/i.test(text);
      throw new Error(isHtml ? '返回网页(HTML)而非 JSON —— Base URL 指向了网站首页' : '返回内容不是 JSON：' + text.slice(0, 160));
    }
    if (!res.ok) {
      const msg = data.error ? (data.error.message || JSON.stringify(data.error)) : text;
      throw new Error('HTTP ' + res.status + '：' + String(msg).slice(0, 260));
    }
    const reply = (data.content || []).filter((b) => b.type === 'text').map((b) => b.text).join('\n');
    if (!reply) throw new Error('响应中未找到文本内容：' + text.slice(0, 200));
    return reply;
  }

  async function callModel(provider, model, question, imageDataUrl) {
    if (provider.protocol === 'anthropic') return callAnthropic(provider, model, question, imageDataUrl);

    let content;
    if (imageDataUrl) {
      // 附了图就一律发送（多模态格式）；纯文本模型会由服务端返回错误，如实显示
      content = [];
      if (question.trim()) content.push({ type: 'text', text: question });
      content.push({ type: 'image_url', image_url: { url: imageDataUrl } });
    } else {
      content = question.trim() || '你好';
    }
    const baseUrl = (provider.baseUrl || '').replace(/\/+$/, '');
    if (!baseUrl) throw new Error('该模型来源未配置 Base URL（Ctrl+F 打开配置）');
    const apiKey = cleanApiKey(provider.apiKey);
    const url = baseUrl + '/chat/completions';
    const res = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(apiKey ? { Authorization: 'Bearer ' + apiKey } : {}),
        ...(isPinggy(provider) ? { 'X-Pinggy-No-Screen': '1' } : {}),
      },
      body: JSON.stringify({ model, messages: [{ role: 'user', content }], stream: false }),
    });

    const text = await res.text();
    let data = null;
    try { data = JSON.parse(text); } catch (e) { data = null; }

    if (!data) {
      const isHtml = /^\s*<!doctype|<html/i.test(text);
      throw new Error(isHtml
        ? '返回的是网页(HTML)而非 JSON —— 该来源的 Base URL 指向了网站首页，请改为 API 地址（OpenAI 协议通常以 /v1 结尾）'
        : '返回内容不是 JSON：' + text.slice(0, 160));
    }
    if (!res.ok) {
      const msg = data.error ? (data.error.message || data.error.code || JSON.stringify(data.error)) : text;
      throw new Error('HTTP ' + res.status + '：' + String(msg).slice(0, 260));
    }
    const reply = data.choices && data.choices[0] && data.choices[0].message && data.choices[0].message.content;
    if (reply == null) throw new Error('响应中未找到 choices[0].message.content，返回：' + text.slice(0, 200));
    return reply;
  }

  async function generateCard(idx, fromRegenerate) {
    const card = $(`.model-card[data-idx="${idx}"]`);
    const answerEl = $(`.model-answer[data-idx="${idx}"]`);
    const latencyEl = $(`.latency[data-idx="${idx}"]`);
    const select = $(`.model-select[data-idx="${idx}"]`);
    const parsed = parseModelValue(select.value);
    const question = fromRegenerate && state.lastQuestion ? state.lastQuestion : $('#compare-question').value;

    if (!question.trim() && !state.pendingImage) {
      answerEl.innerHTML = '<div class="placeholder">请先在上方输入问题</div>';
      return;
    }
    state.lastQuestion = question;

    card.classList.add('running');
    updateMeta(idx);
    answerEl.innerHTML = '<div class="placeholder"><span class="spinner"></span>正在生成…</div>';
    latencyEl.textContent = '';

    const t0 = performance.now();
    try {
      let reply;
      if (parsed.kind === 'kb') {
        reply = kbAnswer(question);
      } else {
        reply = await callModel(parsed.provider, parsed.model, question, state.pendingImage);
      }
      const ms = Math.round(performance.now() - t0);
      answerEl.innerHTML = '<div class="md">' + renderMarkdown(reply) + '</div>';
      latencyEl.textContent = parsed.kind === 'kb' ? '本地 · ' + ms + ' ms' : ms + ' ms';
    } catch (err) {
      answerEl.innerHTML = '<div class="error-text">' + escapeHtml(err.message || err) + '</div>';
      latencyEl.textContent = '';
    } finally {
      card.classList.remove('running');
    }
  }

  function sendAll() {
    const q = $('#compare-question').value;
    state.lastQuestion = q;
    for (let i = 0; i < CARD_COUNT; i++) generateCard(i, false);
  }

  /* ---------- 配置弹窗（Ctrl+F 打开） ---------- */
  function renderProviderList() {
    const host = $('#provider-list');
    host.innerHTML = '';
    state.providers.forEach((p, pi) => {
      const row = document.createElement('div');
      row.className = 'provider-row';
      row.dataset.pidx = pi;
      const protocol = p.protocol === 'anthropic' ? 'anthropic' : 'openai';
      row.innerHTML = `
        <div class="p-head">
          <input class="p-label" placeholder="来源名称，如「本地 USI」" value="${escapeHtml(p.label || '')}" />
          <select class="p-protocol" title="协议">
            <option value="openai"${protocol === 'openai' ? ' selected' : ''}>OpenAI 协议</option>
            <option value="anthropic"${protocol === 'anthropic' ? ' selected' : ''}>Anthropic 协议</option>
          </select>
          <button class="p-remove" title="删除">✕</button>
        </div>
        <div class="p-grid">
          <input class="p-base" placeholder="Base URL" value="${escapeHtml(p.baseUrl || '')}" />
          <input class="p-key" type="password" placeholder="API Key（可空）" value="${escapeHtml(p.apiKey || '')}" />
        </div>
        <input class="p-models" placeholder="模型名（逗号分隔），如 USI-Brain, gpt-5.4" value="${escapeHtml((p.models || []).join(', '))}" />`;
      host.appendChild(row);
    });
    $$('.p-remove', host).forEach((b) => {
      b.onclick = () => { state.providers.splice(Number(b.closest('.provider-row').dataset.pidx), 1); renderProviderList(); };
    });
  }

  function collectProviders() {
    return $$('.provider-row', $('#provider-list')).map((r) => ({
      label: r.querySelector('.p-label').value.trim() || '未命名来源',
      protocol: r.querySelector('.p-protocol').value || 'openai',
      baseUrl: r.querySelector('.p-base').value.trim(),
      apiKey: r.querySelector('.p-key').value.trim(),
      models: r.querySelector('.p-models').value.split(/[,，]/).map((s) => s.trim()).filter(Boolean),
    })).filter((p) => p.baseUrl || p.models.length);
  }

  function openCfgModal() {
    renderProviderList();
    $('#cfg-modal').hidden = false;
  }
  function closeCfgModal() { $('#cfg-modal').hidden = true; }

  function saveProviders() {
    state.providers = collectProviders();
    try { localStorage.setItem('usi-providers', JSON.stringify(state.providers)); } catch (e) {}
    populateSelects();
    closeCfgModal();
  }

  function initCfgModal() {
    $('#cfg-close').onclick = closeCfgModal;
    $('#cfg-cancel').onclick = closeCfgModal;
    $('#cfg-save').onclick = saveProviders;
    $('#add-provider').onclick = () => { state.providers.push({ label: '新来源', baseUrl: '', apiKey: '', models: [] }); renderProviderList(); };
    $('#cfg-modal').addEventListener('click', (e) => { if (e.target === $('#cfg-modal')) closeCfgModal(); });
  }

  function initCompare() {
    loadCfg();
    buildCompareCards();
    initCfgModal();

    $('#compare-send').onclick = sendAll;
    $('#compare-question').addEventListener('keydown', (e) => {
      if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) { e.preventDefault(); sendAll(); }
    });
    $('#compare-question').addEventListener('input', (e) => {
      e.target.style.height = 'auto';
      e.target.style.height = Math.min(Math.max(e.target.scrollHeight, 250), 420) + 'px';
    });

    $('#attach-btn').onclick = () => $('#image-file').click();
    $('#image-file').onchange = (e) => {
      const f = e.target.files[0];
      if (!f) return;
      const r = new FileReader();
      r.onload = () => {
        state.pendingImage = r.result;
        $('#img-preview').innerHTML = `<img src="${r.result}" /><button id="img-remove">✕ 移除</button>`;
        $('#img-remove').onclick = () => { state.pendingImage = null; $('#img-preview').innerHTML = ''; };
      };
      r.readAsDataURL(f);
      e.target.value = '';
    };
  }

  /* ---------- 初始化 ---------- */
  function init() {
    renderOverview();
    buildAllOptions();
    renderTables();
    renderAll();
    spawnBubbles();
    initScrollSpy();
    initCompare();

    // Ctrl+F / Cmd+F 打开配置弹窗；Esc 关闭
    document.addEventListener('keydown', (e) => {
      if ((e.ctrlKey || e.metaKey) && (e.key === 'f' || e.key === 'F')) {
        e.preventDefault();
        openCfgModal();
      } else if (e.key === 'Escape') {
        closeCfgModal();
      }
    });

    let resizeTimer;
    window.addEventListener('resize', () => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(renderAll, 150);
    });
  }

  document.addEventListener('DOMContentLoaded', init);
})();
