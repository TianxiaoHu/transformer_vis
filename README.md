# transformer_vis

## Installation

1. rinokeras: [GitHub](https://github.com/CannyLab/rinokeras) [docs](https://rinokeras.readthedocs.io/en/latest/index.html)
2. Python == 3.6
3. tensorflow-gpu == 1.9.0
4. cuda == 9.0

commands for port mapping and open jupyter notebook local brower(for macOS):

```bash
$ ssh -L 8888:localhost:8888 ubuntu@3[ip-address]
```

## paper and useful websites

- paper: [Attention Is All You Need](https://arxiv.org/pdf/1706.03762)
- [Harvard nlp group blog](http://nlp.seas.harvard.edu/2018/04/03/attention.html)
- [The illustrated Transformer](http://jalammar.github.io/illustrated-transformer/) by Jay Alammar

## Setup for Visualization Tool: TransVis

TransVis uses jQuery to load data from local folder so a **server** is needed. There are two ways to create a local server:

1. Use flask as backend:

   ```bash
   $ cd TransVis
   $ python run.py
   ```

   Then open your browser and enter: `localhost: 5000` to visit the website.

2. Using WebStorm:

   Just install [WebStorm](https://www.jetbrains.com/webstorm/) and open **index.html** from the IDE. It will automatically setup a local server to support the front end.