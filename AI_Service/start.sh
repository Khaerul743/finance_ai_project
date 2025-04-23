#!/bin/bash
source venv/Scripts/activate
export FLASK_APP=app.main:app
export FLASK_DEBUG=1
export FLASK_ENV=development
export FLASK_RUN_PORT=5000
flask run