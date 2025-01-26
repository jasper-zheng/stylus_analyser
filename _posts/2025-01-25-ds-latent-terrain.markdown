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

The tablet interface captures the spatial location of the stylus's pen tip on the canvas as a pair of coordinates $$(x, y)$$, and the pressure applied on the canvas as $$p$$. We designed a mapping model called *Latent Terrain* (hereby referred to as the terrain). A terrain is a set of one-to-one mapping between a given pair of $$(x, y)$$ to an 8-dimensional latent vector $$z$$. Therefore, a 2D canvas can be rendered as a plane of latent vectors tiled on each pixel location. When the stylus moves on the canvas, the terrain immediately retrieves a latent vector $$z$$ corresponding to the stylus' $$(x, y)$$. 

We used two algorithmic strategies to generate two terrains, respectively: a Variational AutoEncoder (VAE) (Kingma and Welling, 2013) and a Fourier-Compositional Pattern Producing Networks (Fourier-CPPN) (Tesfaldet et al., 2019). A terrain is fixed after it was generated. For the Fourier-CPPN model, we followed the steps below to obtain a latent terrain, illustrated in the figure below.

<img src="../../../../../media/illustrate.png" width="512px">

1. We selected $$18$$ audio fragments with sample rate $$44,100hz$$ from the training dataset. These audio fragments should cover a diverse range of pitches, timbral qualities, and playing techniques. Each audio snippet was trimmed to have a length of $$151,552$$ samples, and encoded into a sequence of latent vectors using RAVE's encoder. Given that RAVE has a compression ratio $$2,048:1$$, each audio snippet was compressed into a sequence of $$151,552/2,048=74$$ latent vectors. Now, we have $$18\times 74=1332$$ latent vectors.
2. We places the $$18$$ sequences of latent vectors into $$18$$ slightly curved lines, tiled them into a stack of lines (two sequences are shown in the figure above). Then we placed this stack of lines on a 2D plane to cover the entire canvas. Now, each latent vector was assigned a coordinate $$(x, y)$$ corresponding to its spatial location on the canvas. In this step, the current spatial arrangement of the latent vectors is arbitrary and can have a high degree of freedom, which we suggest as a broad design space to explore in future work. 
3. The spatial coordinates $$(x, y)$$ and the latent vector paired with them are used as training data to train a Fourier-CPPN model, which is a supervised learning algorithm that learns to predict a latent vector $$z$$ given a pair of $$(x, y)$$ coordinates.