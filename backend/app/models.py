# File: backend/app/models.py
from . import db
from datetime import datetime

class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    bank_name = db.Column(db.String(100), nullable=True)
    balance = db.Column(db.Float, nullable=False, default=0.0)
    # payments relationship: 'Payment' model se link kiya hai
    # backref='user' se payment object se uske user ko access kar sakte hain (e.g., payment.user)
    payments = db.relationship('Payment', backref='user', lazy=True)

class Payment(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    # user_id foreign key: 'user' table ke 'id' column se link
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    payee = db.Column(db.String(100), nullable=False)
    amount = db.Column(db.Float, nullable=False)
    due_date = db.Column(db.DateTime, nullable=False)
    status = db.Column(db.String(50), default='Pending') # Status: Pending, Paid, Failed, Cancelled
    method = db.Column(db.String(50))
    created_at = db.Column(db.DateTime, default=datetime.utcnow)