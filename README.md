# transformer_vis

This is an UC Berkeley MEng DSS Capstone project during 2018-2019.

Focusing on the interpretation of Transformer model on summarization task.

## Installation

1. rinokeras: [GitHub](https://github.com/CannyLab/rinokeras) [docs](https://rinokeras.readthedocs.io/en/latest/index.html)
2. Python == 3.6
3. tensorflow-gpu == 1.9.0
4. cuda == 9.0

## Prepare Data

The data is stored as a `json` in folder `static/data/`. In our demo, the dimension is:

- input tokens (article): 400
- output tokens (summary): 100
- \# of layer: 10
- \# of head: 8

The json data is stored like:

```
{
 "article": ['..', '..'],				  	# tokens in input article
 "summary": ['..', '..'],				  	# tokens in output summary
 "cross_attn": [[[[...], [...]]]]		# 10 * 8 * 400 * 100 matrix
}
```

## Setup for Visualization

**TransVis** uses jQuery to load data from local folder so a **server** is needed. Thus we use Flask as backend server:

```bash
$ cd TransVis
$ python run.py
```

Then open your browser and enter: `localhost: 5000` to visit the website.

## Reference

- paper: [Attention Is All You Need](https://arxiv.org/pdf/1706.03762)
- [Harvard nlp group blog](http://nlp.seas.harvard.edu/2018/04/03/attention.html)
- [The illustrated Transformer](http://jalammar.github.io/illustrated-transformer/) by Jay Alammar