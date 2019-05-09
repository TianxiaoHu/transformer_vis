# -*- coding:utf-8 -*-
import os
from app import app
from flask import render_template

### return html templates ###

@app.route('/')
def index():
	return render_template('index.html')


