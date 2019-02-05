# -*- coding:utf-8 -*-
import os
import numpy as np
from app import app
from flask import render_template, jsonify, request, g, url_for

### return html templates ###

@app.route('/')
def index():
	return render_template('index.html')

@app.route('/visualize')
def get_data():
	test_data = [1, 2, 3]
	return jsonify(test_data)

