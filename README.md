# USI-Brain

**Enhancing Underwater Spatial Intelligence via Spatial Data-Driven Vision-Language Modeling**

[Project Page](https://wotwoker.github.io/USI-brain/) · [Paper](https://arxiv.org/abs/2611.06040)

USI-Brain is a vision-language model designed for underwater spatial intelligence. It learns to locate and understand objects, reason about 2D and 3D spatial relationships, perceive degraded underwater scenes, and interpret ecological context.

The project introduces a spatial data engine that connects enhanced underwater imagery with object-level geometry. Through 2D and geometry-assisted question generation, capability-based organization, and expert filtering, the engine produces **4.27 million spatial QA pairs** for model training.

## Highlights

- **USI-Brain:** an underwater vision-language model adapted from Qwen3-VL-8B-Instruct.
- **UPR:** an Underwater Prior-guided Rectifier that applies gated corrections to visual features.
- **USI-Bench:** 6,525 held-out QA pairs covering five underwater spatial-intelligence capabilities.
- **Strong performance:** best or joint-best results on 28 of 32 metrics across NautData, UWBench, and MarineEval.

## Five Capability Groups

1. Object Grounding & Understanding
2. 2D Relations & Layout
3. 3D Depth & Stratification
4. Degradation-aware Perception
5. Scene & Ecological Reasoning

## Authors

Zhiliang Zhu, Zhiqiang Zhao, Xie'an Jiang, Yingxin Lai, Kangye Zheng, and Dawei Zhao.

Harbin Engineering University · Xiamen University

## About This Repository

This repository contains the static project page for USI-Brain, including the paper, figures, responsive styles, and lightweight browser interactions. The website is implemented with plain HTML, CSS, and JavaScript and is hosted with GitHub Pages.
