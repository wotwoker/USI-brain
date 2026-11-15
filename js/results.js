(() => {
  const chartElement = document.querySelector('#results-chart');
  const tabs = [...document.querySelectorAll('[data-chart]')];
  const titleElement = document.querySelector('#chart-title');
  const noteElement = document.querySelector('#chart-note');
  const chartStatus = document.querySelector('#chart-status');
  const table = document.querySelector('#result-table');
  const tableTitle = document.querySelector('#result-table-title');
  const tableNote = document.querySelector('#result-table-note');

  if (!chartElement || !tabs.length || !chartStatus || !table || !tableTitle || !tableNote) return;

  const datasets = {
    overview: {
      title: 'External benchmark coverage',
      note: 'Best or joint-best score within each paper comparison pool.',
      type: 'overview',
      metrics: ['NautData', 'UWBench VQA', 'UWBench Referring', 'MarineEval'],
      values: [100, 75, 100, 83.3],
      counts: ['7 / 7', '6 / 8', '5 / 5', '10 / 12'],
      soleBest: [7, 6, 5, 9],
      jointBest: [0, 0, 0, 1],
      totals: [7, 8, 5, 12],
      tableNote: 'Sole-best and joint-best counts from the paper comparison pools.',
    },
    usibench: {
      title: 'USI-Bench task-level results',
      note: 'Fifteen held-out tasks spanning five capability groups. Scores are reported as percentages.',
      metrics: ['Identity', 'Grounding', 'Counting', 'Detection', 'Captioning', 'Relation', 'Distance', 'Depth', 'Viewpoint', 'Ordering', 'Foreground / Background', 'Environment', 'Structure', 'Scene', 'Ecology'],
      series: [
        { name: 'USI-Brain + UPR', data: [73.7, 92.1, 44.2, 56.3, 56.2, 72.8, 69.6, 83.8, 84.8, 83.2, 22.7, 78.3, 62.5, 65.3, 59.1] },
        { name: 'USI-Brain', data: [73.1, 90.8, 42.4, 55.5, 55.9, 71.4, 69.0, 82.7, 84.8, 82.3, 22.6, 77.8, 62.2, 47.3, 58.8] },
        { name: 'Qwen3-VL-8B-Instruct', data: [64.7, 85.4, 42.9, 47.9, 38.9, 65.8, 69.9, 76.0, 79.1, 72.2, 18.5, 81.2, 46.5, 42.8, 58.4] },
      ],
    },
    nautdata: {
      title: 'NautData public test set',
      note: 'METEOR and VQA accuracy are scaled to percentage points following the paper.',
      metrics: ['Image Caption', 'Region Caption', 'VQA Accuracy', 'Grounding PR@0.5', 'Grounding mIoU', 'Detection mAP', 'Detection mAP@0.5'],
      series: [
        { name: 'USI-Brain', data: [24.5, 20.6, 47.8, 59.4, 56.4, 27.9, 46.8] },
        { name: 'NAUTILUS (Qwen2.5-VL)', data: [22.3, 19.9, 38.1, 58.8, 53.8, 25.8, 45.3] },
        { name: 'NAUTILUS (LLaVA-1.5)', data: [20.8, 19.1, 36.5, 52.2, 46.2, 11.1, 20.9] },
        { name: 'Qwen3-VL-8B', data: [8.9, 9.7, 0.8, 45.2, 43.9, 14.8, 24.0] },
      ],
    },
    uwbench: {
      title: 'UWBench VQA by category',
      note: 'USI-Brain leads six of eight categories under the official UWBench evaluation protocol.',
      metrics: ['Quantity / Existence', 'Reasoning / Comparison', 'Water Quality / Visibility', 'Object Attributes', 'Substrate / Material', 'Position / Spatial Relation', 'Color / Texture / Pattern', 'Shape / Size / Morphology'],
      series: [
        { name: 'USI-Brain', data: [92.72, 85.11, 82.50, 78.09, 72.45, 56.73, 56.33, 52.79] },
        { name: 'GLM-4.5V-106B', data: [8.73, 29.05, 40.22, 27.50, 49.85, 62.48, 48.78, 72.52] },
        { name: 'GLM-4.1V-9B', data: [2.33, 26.97, 39.94, 28.12, 47.17, 61.27, 45.02, 71.98] },
        { name: 'Qwen2.5-VL-7B', data: [49.91, 23.24, 35.54, 24.37, 42.24, 55.66, 38.95, 64.42] },
        { name: 'Gemini-2.5-Flash', data: [1.47, 26.14, 40.77, 24.37, 47.58, 61.55, 45.26, 71.42] },
      ],
    },
    referring: {
      title: 'UWBench object referring',
      note: 'USI-Brain leads all five localization and open-quality metrics.',
      metrics: ['Acc@IoU0.5', 'Acc@IoU0.7', 'mIoU', 'Cumulative IoU', 'CLAIR'],
      series: [
        { name: 'USI-Brain', data: [96.80, 94.25, 91.05, 92.07, 90.27] },
        { name: 'Qwen3-VL-30B-Instruct', data: [94.40, 80.38, 80.18, 51.67, 88.58] },
        { name: 'Qwen2.5-VL-72B', data: [90.90, 74.71, 77.90, 81.50, 88.76] },
        { name: 'GLM-4.5V-106B', data: [89.21, 75.38, 79.26, 80.51, 88.63] },
        { name: 'InternVL-3.5-24B', data: [84.76, 64.14, 71.99, 76.98, 88.99] },
        { name: 'Qwen2.5-VL-7B', data: [37.15, 11.76, 32.77, 33.69, 87.28] },
      ],
    },
    marine: {
      title: 'MarineEval test set',
      note: 'USI-Brain obtains nine sole-best and one joint-best result across twelve categories.',
      metrics: ['Numerical Estimation', 'Visual Localization', 'Spatial Relation', 'Depth Judgement', 'Instruction / Function', 'Identity / Behavior', 'Property Extraction', 'Threat Judgement', 'Pollution Localization', 'Disaster Diagnosis', 'Species Understanding', 'Marine Technology'],
      series: [
        { name: 'USI-Brain', data: [46, 93, 29, 31, 77, 69, 89, 51, 37, 94, 43.83, 72] },
        { name: 'Qwen3-VL-8B', data: [34, 84, 14, 29, 66, 63, 87, 32, 40, 93, 51.80, 71] },
        { name: 'Nautilus-7B', data: [11, 33, 7, 24, 60, 36, 77, 15, 33, 94, 27.70, 60] },
        { name: 'OceanGPT-7B', data: [20, 20, 2, 0, 28, 1, 33, 0, 31, 85, 18, 28] },
      ],
    },
  };

  const palette = ['#42d1e6', '#8b9cff', '#68e0bd', '#f0b96b', '#6d91b5', '#b27fe7'];
  let activeKey = 'overview';
  let compact = window.matchMedia('(max-width: 720px)').matches;
  let chart = null;

  chartElement.style.width = '100%';
  chartElement.style.height = compact ? '480px' : '510px';

  if (window.echarts) {
    try {
      chart = window.echarts.init(chartElement, null, { renderer: 'canvas' });
    } catch {
      chart = null;
    }
  }

  if (!chart) {
    chartElement.hidden = true;
    chartStatus.hidden = false;
  }

  const sharedTooltip = {
    trigger: 'axis',
    confine: true,
    backgroundColor: 'rgba(3, 12, 25, 0.96)',
    borderColor: 'rgba(85, 207, 231, 0.32)',
    borderWidth: 1,
    padding: [10, 12],
    textStyle: { color: '#edf7ff', fontSize: 14 },
    extraCssText: 'box-shadow: 0 14px 36px rgba(0, 4, 12, 0.42); border-radius: 8px;',
    axisPointer: { type: 'shadow', shadowStyle: { color: 'rgba(66, 209, 230, 0.07)' } },
  };

  const overviewOption = (dataset) => ({
    animationDuration: 650,
    color: palette,
    tooltip: {
      ...sharedTooltip,
      formatter: (items) => {
        const index = items[0].dataIndex;
        return `<strong>${dataset.metrics[index]}</strong><br>${dataset.counts[index]} metrics<br>${dataset.values[index]}% coverage`;
      },
    },
    grid: { left: compact ? 120 : 170, right: compact ? 36 : 80, top: 26, bottom: 48 },
    xAxis: {
      type: 'value',
      max: 100,
      axisLine: { show: false },
      axisTick: { show: false },
      axisLabel: { color: '#9cb1c6', fontSize: 13, formatter: '{value}%' },
      splitLine: { lineStyle: { color: 'rgba(120, 166, 204, 0.14)' } },
    },
    yAxis: {
      type: 'category',
      inverse: true,
      data: dataset.metrics,
      axisLine: { show: false },
      axisTick: { show: false },
      axisLabel: { color: '#d7e4ef', fontWeight: 650, fontSize: compact ? 12 : 14 },
    },
    series: [{
      name: 'Best / joint-best',
      type: 'bar',
      data: dataset.values,
      barWidth: compact ? 20 : 25,
      showBackground: true,
      backgroundStyle: { color: 'rgba(120, 166, 204, 0.11)', borderRadius: 4 },
      itemStyle: {
        color: {
          type: 'linear',
          x: 0,
          y: 0,
          x2: 1,
          y2: 0,
          colorStops: [{ offset: 0, color: '#237f9e' }, { offset: 1, color: '#42d1e6' }],
        },
        borderRadius: [0, 5, 5, 0],
      },
      label: {
        show: true,
        position: 'right',
        color: '#79e5f2',
        fontSize: compact ? 12 : 14,
        fontWeight: 750,
        formatter: (item) => dataset.counts[item.dataIndex],
      },
    }],
  });

  const benchmarkOption = (dataset) => {
    const needsZoom = dataset.metrics.length > (compact ? 5 : 10);
    const end = needsZoom ? (compact ? 42 : 68) : 100;

    return {
      animationDuration: 650,
      color: palette,
      tooltip: { ...sharedTooltip, valueFormatter: (value) => `${Number(value).toFixed(2).replace(/\.00$/, '')}` },
      legend: {
        type: 'scroll',
        top: 12,
        left: 24,
        right: 24,
        itemWidth: 12,
        itemHeight: 7,
        itemGap: 18,
        textStyle: { color: '#afc2d3', fontSize: 13 },
        pageIconColor: '#42d1e6',
        pageIconInactiveColor: '#456078',
        pageTextStyle: { color: '#9cb1c6', fontSize: 13 },
      },
      grid: { left: compact ? 44 : 60, right: compact ? 18 : 32, top: 74, bottom: needsZoom ? 112 : 88 },
      xAxis: {
        type: 'category',
        data: dataset.metrics,
        axisLine: { lineStyle: { color: 'rgba(120, 166, 204, 0.24)' } },
        axisTick: { show: false },
        axisLabel: {
          color: '#a9bdcf',
          fontSize: compact ? 11 : 12,
          interval: 0,
          rotate: compact ? 38 : 24,
          margin: 15,
          formatter: (value) => value.replace(' / ', '\n/ '),
        },
      },
      yAxis: {
        type: 'value',
        min: 0,
        max: 100,
        axisLine: { show: false },
        axisTick: { show: false },
        axisLabel: { color: '#9cb1c6', fontSize: 12 },
        splitLine: { lineStyle: { color: 'rgba(120, 166, 204, 0.14)' } },
      },
      dataZoom: needsZoom ? [
        { type: 'inside', start: 0, end },
        {
          type: 'slider',
          start: 0,
          end,
          bottom: 17,
          height: 14,
          borderColor: 'transparent',
          backgroundColor: 'rgba(120, 166, 204, 0.1)',
          dataBackground: {
            lineStyle: { color: '#49677e' },
            areaStyle: { color: 'rgba(73, 103, 126, 0.22)' },
          },
          selectedDataBackground: {
            lineStyle: { color: '#42d1e6' },
            areaStyle: { color: 'rgba(66, 209, 230, 0.2)' },
          },
          fillerColor: 'rgba(66, 209, 230, 0.18)',
          handleStyle: { color: '#42d1e6', borderColor: '#79e5f2' },
          moveHandleStyle: { color: '#42d1e6' },
          showDetail: false,
        },
      ] : [],
      series: dataset.series.map((series, index) => ({
        ...series,
        type: 'bar',
        barMaxWidth: dataset.series.length > 4 ? 17 : 24,
        itemStyle: { color: palette[index], borderRadius: [3, 3, 0, 0] },
        emphasis: { focus: 'series' },
      })),
    };
  };

  const formatValue = (value) => {
    if (typeof value !== 'number') return String(value);
    return value.toFixed(2).replace(/\.00$/, '').replace(/(\.\d)0$/, '$1');
  };

  const appendCell = (row, value, isHeader = false, scope = '') => {
    const cell = document.createElement(isHeader ? 'th' : 'td');
    if (scope) cell.scope = scope;
    cell.textContent = value;
    row.appendChild(cell);
  };

  const renderTable = (dataset) => {
    const caption = table.querySelector('caption') || table.createCaption();
    const thead = table.tHead || table.createTHead();
    const tbody = table.tBodies[0] || table.createTBody();
    caption.textContent = dataset.title;
    tableTitle.textContent = dataset.title;
    tableNote.textContent = dataset.tableNote || dataset.note;
    thead.replaceChildren();
    tbody.replaceChildren();

    const headerRow = document.createElement('tr');

    if (dataset.type === 'overview') {
      ['Benchmark', 'Sole best', 'Joint best', 'Total', 'Coverage'].forEach((label) => appendCell(headerRow, label, true, 'col'));
      thead.appendChild(headerRow);

      dataset.metrics.forEach((metric, index) => {
        const row = document.createElement('tr');
        appendCell(row, metric, true, 'row');
        appendCell(row, dataset.soleBest[index]);
        appendCell(row, dataset.jointBest[index]);
        appendCell(row, dataset.totals[index]);
        appendCell(row, `${formatValue(dataset.values[index])}%`);
        tbody.appendChild(row);
      });
      return;
    }

    appendCell(headerRow, 'Model', true, 'col');
    dataset.metrics.forEach((metric) => appendCell(headerRow, metric, true, 'col'));
    thead.appendChild(headerRow);

    dataset.series.forEach((series) => {
      const row = document.createElement('tr');
      if (series.name.startsWith('USI-Brain')) row.classList.add('ours-row');
      appendCell(row, series.name, true, 'row');
      series.data.forEach((value) => appendCell(row, formatValue(value)));
      tbody.appendChild(row);
    });
  };

  const render = (key) => {
    const dataset = datasets[key];
    activeKey = key;
    titleElement.textContent = dataset.title;
    noteElement.textContent = dataset.note;
    chartElement.setAttribute('aria-label', `${dataset.title}. ${dataset.note}`);
    renderTable(dataset);

    tabs.forEach((tab) => {
      const selected = tab.dataset.chart === key;
      tab.classList.toggle('active', selected);
      tab.setAttribute('aria-selected', String(selected));
      tab.setAttribute('tabindex', selected ? '0' : '-1');
      if (selected) chartElement.setAttribute('aria-labelledby', tab.id);
    });

    if (chart) {
      try {
        chartElement.hidden = false;
        chartStatus.hidden = true;
        chart.setOption(dataset.type === 'overview' ? overviewOption(dataset) : benchmarkOption(dataset), true);
      } catch {
        chartElement.hidden = true;
        chartStatus.hidden = false;
      }
    }
  };

  tabs.forEach((tab, index) => {
    tab.addEventListener('click', () => render(tab.dataset.chart));
    tab.addEventListener('keydown', (event) => {
      if (event.key !== 'ArrowLeft' && event.key !== 'ArrowRight') return;
      event.preventDefault();
      const direction = event.key === 'ArrowRight' ? 1 : -1;
      const nextIndex = (index + direction + tabs.length) % tabs.length;
      tabs[nextIndex].focus();
      render(tabs[nextIndex].dataset.chart);
    });
  });

  const resize = () => {
    const nextCompact = window.matchMedia('(max-width: 720px)').matches;
    chartElement.style.height = nextCompact ? '480px' : '510px';
    if (chart) chart.resize();
    if (nextCompact !== compact) {
      compact = nextCompact;
      render(activeKey);
    }
  };

  if (chart && 'ResizeObserver' in window) new ResizeObserver(resize).observe(chartElement);
  else if (chart) window.addEventListener('resize', resize, { passive: true });

  render(activeKey);
})();
