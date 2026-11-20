<div align="center">

<h1>🌊 USI-Brain</h1>

<h3>
  Enhancing Underwater Spatial Intelligence<br>
  via Spatial Data-Driven Vision-Language Modeling
</h3>

<p>
  Understanding objects, geometry, and spatial relationships in the underwater world.
</p>

<p>
  <a href="https://wotwoker.github.io/USI-brain/">
    <img src="https://img.shields.io/badge/Project-Website-087F8C?style=for-the-badge&amp;logo=googlechrome&amp;logoColor=white" alt="Project Website">
  </a>
  <a href="https://arxiv.org/abs/2611.06040">
    <img src="https://img.shields.io/badge/arXiv-2611.06040-B31B1B?style=for-the-badge&amp;logo=arxiv&amp;logoColor=white" alt="Paper on arXiv">
  </a>
  <a href="https://arxiv.org/pdf/2611.06040">
    <img src="https://img.shields.io/badge/Paper-PDF-375A7F?style=for-the-badge&amp;logo=readthedocs&amp;logoColor=white" alt="Paper PDF">
  </a>
</p>

<p>
  <a href="https://github.com/wotwoker/USI-brain">
    <img src="https://img.shields.io/badge/GitHub-Project_Repo-181717?style=for-the-badge&amp;logo=github&amp;logoColor=white" alt="Project Website Repository">
  </a>
  <a href="https://github.com/SKY-Zhu-91/USI-Brain">
    <img src="https://img.shields.io/badge/GitHub-Research_Code-245B78?style=for-the-badge&amp;logo=github&amp;logoColor=white" alt="Research Code Repository">
  </a>
  <a href="https://huggingface.co/USI-Brain">
    <img src="https://img.shields.io/badge/Hugging_Face-Models-FFD21E?style=for-the-badge&amp;logo=huggingface&amp;logoColor=black" alt="Hugging Face">
  </a>
</p>

<p>
  Zhiliang Zhu<sup>1,*,†</sup> ·
  Zhiqiang Zhao<sup>1,*</sup> ·
  Xie'an Jiang<sup>1,*</sup> ·
  Yingxin Lai<sup>2</sup> ·
  Kangye Zheng<sup>1</sup> ·
  Dawei Zhao<sup>1,‡</sup>
</p>

<p>
  <sup>1</sup>Harbin Engineering University
  &nbsp;&nbsp;
  <sup>2</sup>Xiamen University
</p>

<p>
  <sup>*</sup>Equal contribution.
  &nbsp;&nbsp;
  <sup>†</sup>Project leader.
  &nbsp;&nbsp;
  <sup>‡</sup>Corresponding author.
</p>

</div>

---

## Overview

**USI-Brain** is a vision-language model designed for underwater spatial intelligence. It learns to locate and understand objects, reason about 2D and 3D spatial relationships, perceive degraded underwater scenes, and interpret ecological context.

The project introduces a **spatial data engine** that connects enhanced underwater imagery with object-level geometry. Through 2D and geometry-assisted question generation, capability-based organization, and expert filtering, the engine produces **4.27 million spatial QA pairs** for model training.

| Training Data | USI-Bench | Capability Groups | External Evaluation |
| :---: | :---: | :---: | :---: |
| **4.27M** QA pairs | **6,525** held-out QA pairs | **5** capability groups | **28 / 32** best or joint-best metrics |

## 📢 News & Release Schedule

- [x] **2026.11.05** — 📄 Paper released on [arXiv](https://arxiv.org/abs/2611.06040).
- [x] **2026.11.15** — 🤗 Model weights released on [Hugging Face](https://huggingface.co/USI-Brain).
- [ ] **2026.11.24 · Planned** — 💻 Code release in the [USI-Brain code repository](https://github.com/SKY-Zhu-91/USI-Brain).
- [ ] **2026.11.24 · Planned** — 📊 USI-Bench release.

> 🚀 **Coming soon:** Code and USI-Bench are scheduled for release on **November 24, 2026**. Stay tuned!

## ✨ Highlights

- 🧠 **USI-Brain:** an underwater vision-language model adapted from Qwen3-VL-8B-Instruct.
- 🔧 **UPR:** an Underwater Prior-guided Rectifier that applies gated corrections to visual features.
- 📊 **USI-Bench:** 6,525 held-out QA pairs covering five underwater spatial-intelligence capabilities.
- 🏆 **Strong performance:** best or joint-best results on 28 of 32 metrics across NautData, UWBench, and MarineEval.

## 🧭 Five Capability Groups

| | Capability | Focus |
| :---: | :--- | :--- |
| 🎯 | **Object Grounding & Understanding** | Locating objects and understanding their attributes. |
| 📐 | **2D Relations & Layout** | Reasoning about spatial relationships and image-plane layouts. |
| 🧊 | **3D Depth & Stratification** | Understanding relative depth and spatial layering. |
| 🌫️ | **Degradation-aware Perception** | Interpreting underwater scenes affected by visual degradation. |
| 🐠 | **Scene & Ecological Reasoning** | Understanding scene context and ecological relationships. |

## 🏆 Evaluation at a Glance

USI-Brain is evaluated on **USI-Bench** and three external benchmarks: **NautData, UWBench, and MarineEval**.

| Evaluation | Coverage / Reported Result |
| :--- | :--- |
| **USI-Bench** | 6,525 held-out QA pairs covering five underwater spatial-intelligence capabilities. |
| **NautData · UWBench · MarineEval** | Best or joint-best performance on **28 of 32 metrics** across the three benchmarks. |

The **28 / 32** result counts best or joint-best metrics across the external benchmarks; it is not an accuracy or task-success rate.

See the [paper](https://arxiv.org/abs/2611.06040) and [project website](https://wotwoker.github.io/USI-brain/) for detailed comparisons and evaluation settings.

## 👥 Authors

| Author | Affiliation | Contribution / Role |
| :--- | :--- | :--- |
| **Zhiliang Zhu** | Harbin Engineering University | Equal contribution · Project leader |
| **Zhiqiang Zhao** | Harbin Engineering University | Equal contribution |
| **Xie'an Jiang** | Harbin Engineering University | Equal contribution |
| **Yingxin Lai** | Xiamen University | — |
| **Kangye Zheng** | Harbin Engineering University | — |
| **Dawei Zhao** | Harbin Engineering University | Corresponding author |
## 📁 About This Repository

This repository contains the **static project page** for USI-Brain, including the paper, figures, responsive styles, and lightweight browser interactions. The website is implemented with plain HTML, CSS, and JavaScript and is hosted with GitHub Pages.

| Resource | Link |
| :--- | :--- |
| 🌐 Project website | [wotwoker.github.io/USI-brain](https://wotwoker.github.io/USI-brain/) |
| 📄 Paper | [arXiv:2611.06040](https://arxiv.org/abs/2611.06040) |
| 🗂️ Website source | [wotwoker/USI-brain](https://github.com/wotwoker/USI-brain) |
| 💻 Research code | [SKY-Zhu-91/USI-Brain](https://github.com/SKY-Zhu-91/USI-Brain) |
| 🤗 Model weights | [Hugging Face organization](https://huggingface.co/USI-Brain) |

Research code will be released separately in the [USI-Brain code repository](https://github.com/SKY-Zhu-91/USI-Brain). Model weights are available through our [Hugging Face organization](https://huggingface.co/USI-Brain).

## 📝 Citation

If you find USI-Brain useful in your research, please consider citing our paper:

```bibtex
@article{zhu2026usibrain,
  title   = {{USI-Brain}: Enhancing Underwater Spatial Intelligence via Spatial Data-Driven Vision-Language Modeling},
  author  = {Zhu, Zhiliang and Zhao, Zhiqiang and Jiang, Xie'an and Lai, Yingxin and Zheng, Kangye and Zhao, Dawei},
  journal = {arXiv preprint arXiv:2611.06040},
  year    = {2026},
  doi     = {10.48550/arXiv.2611.06040},
  url     = {https://arxiv.org/abs/2611.06040}
}
```
## 📬 Contact

For questions about this project, please contact:

**Zhiliang Zhu** — [zhuzhiliang@hrbeu.edu.cn](mailto:zhuzhiliang@hrbeu.edu.cn)
