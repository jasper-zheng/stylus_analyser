---
layout: post
title:  "Generating Latent Terrains"
date:   2025-01-22 13:15:45 +0000
chapter: Chapter 3.3 
categories: jekyll update
type: Instrument Design
excerpt: We designed a digital musical instrument with a stylus and tablet interface as a research probe. The instrument embeds Latent Terrain, an adapted form of latent space of a neural audio synthesis model, inspired by wave terrain synthesis. One can navigate the latent terrain using gestures afforded by the stylus and tablet...
---

![img](../../../../../media/terrain_embed.png)

The tablet interface captures the spatial location of the stylus's pen tip on the canvas as a pair of coordinates $$(x, y)$$, and the pressure applied on the canvas as $p$. We designed a mapping model called \textit{Latent Terrain} (hereby referred to as the terrain). A terrain is a set of one-to-one mapping between a given pair of $(x, y)$ to an 8-dimensional latent vector $z$. Therefore, a 2D canvas can be rendered as a plane of latent vectors tiled on each pixel location. When the stylus moves on the canvas, the terrain immediately retrieves a latent vector $z$ corresponding to the stylus' $(x, y)$. 

We used two algorithmic strategies to generate two terrains, respectively: a Variational AutoEncoder (VAE) \citep{kingma_auto-encoding_2013} and a Fourier-Compositional Pattern Producing Networks (Fourier-CPPN) \citep{tesfaldet_fourier-cppns_2019}. A terrain is fixed after it was generated. While the technical details and the procedure used for generating the two terrains