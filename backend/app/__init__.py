# File: backend/app/__init__.py

from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS
from flask_migrate import Migrate
from flask_apscheduler import APScheduler
from flask_mail import Mail # <--- ही लाइन ऍड करा: Flask-Mail चा Mail क्लास इम्पोर्ट करा

# ग्लोबल ऑब्जेक्ट्स इनिशियलाइज करा
db = SQLAlchemy()
migrate = Migrate()
scheduler = APScheduler()
mail = Mail() # <--- ही लाइन ऍड करा: mail ऑब्जेक्ट इनिशियलाइज करा

def create_app():
    app = Flask(__name__)

    # config.py मधून ऍप्लिकेशन कॉन्फिगरेशन लोड करा
    # यात तुमच्या Flask-Mail च्या सेटिंग्स (MAIL_SERVER, MAIL_USERNAME, MAIL_PASSWORD, etc.) असाव्यात.
    app.config.from_pyfile('../config.py') 
    CORS(app)
    
    # ऍपला db, migrate, आणि mail सोबत इनिशियलाइज करा
    db.init_app(app)
    migrate.init_app(app, db)
    mail.init_app(app) # <--- ही लाइन ऍड करा: mail ऑब्जेक्ट ऍपसोबत इनिशियलाइज करा

    # Blueprints इम्पोर्ट आणि रजिस्टर करा
    from .routes import api
    app.register_blueprint(api, url_prefix='/api') # url_prefix इथेच द्यावा, routes.py मध्ये नाही

    # शेड्युलर सेटअप
    if True: # <--- Debug मोडमध्येही scheduler सुरू करण्यासाठी (फक्त टेस्टिंगसाठी)
             # तुम्ही टेस्टिंग पूर्ण झाल्यावर ही अट app.debug किंवा app.testing वर आधारित पुन्हा सेट करू शकता.
        scheduler.init_app(app)
        if not scheduler.running: # scheduler आधीच रन होत नसेल तरच स्टार्ट करा
            scheduler.start()

        from app.routes import process_due_payments
        if not scheduler.get_job('process_due_payments_job'):
            scheduler.add_job(
                id='process_due_payments_job',
                func=process_due_payments,
                args=[app], # 'app' इन्स्टन्स फंक्शनला पास करा
                trigger='interval',
                minutes=1, # दर 1 मिनिटाला प्रोसेस होईल
                max_instances=1
            )

    return app
