"""
Gunicorn settings for Testly.
"""

bind = '0.0.0.0:8000'
workers = 2
errorlog = '-'
accesslog = '-'
loglevel = 'info'
preload_app = True
proc_name = 'testly'
