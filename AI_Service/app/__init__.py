from flask import Flask
from app.routes.emailRoutes import email
from app.routes.AIRoutes import AI_service
from app.routes.MLroutes import ML_service

def create_app():
    app = Flask(__name__)
    app.config['UPLOAD_FOLDER'] = 'uploads'
    app.register_blueprint(email,url_prefix="/api/service/email")
    app.register_blueprint(AI_service,url_prefix="/api/service/AI")
    app.register_blueprint(ML_service,url_prefix="/api/service/ML")
    return app