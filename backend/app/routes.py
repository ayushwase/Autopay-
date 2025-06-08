# File: backend/app/routes.py
from flask import Blueprint, request, jsonify
from .models import db, Payment, User # Ensure User model is imported
from datetime import datetime, date

api = Blueprint('api', __name__)

# --- Helper Function to Get or Create a Demo User ---
# Yeh function database mein ek demo user banata hai agar koi user exist nahi karta.
# Real world app mein, yahan user authentication se user_id aayegi.
def get_or_create_demo_user():
    user = User.query.first() # Pehla user find karein
    if not user:
        # Agar koi user nahi hai, toh naya demo user banayein
        user = User(name="Prasad", bank_name="Global Bank", balance=250000.0)
        db.session.add(user)
        db.session.commit()
    return user

# --- Basic API Check ---
@api.route('/', methods=['GET'])
def index():
    return jsonify({"message": "API is running"}), 200

# --- User and Account Endpoints ---
@api.route('/user/<int:user_id>', methods=['GET'])
def get_user_info(user_id):
    user = User.query.get(user_id)
    if not user:
        return jsonify({'error': 'User not found'}), 404
        
    # Check for failed payments for this user
    failed_payments = Payment.query.filter_by(user_id=user.id, status='Failed').count()

    return jsonify({
        'id': user.id,
        'name': user.name,
        'bankName': user.bank_name,
        'balance': user.balance,
        'failed_payments_count': failed_payments
    })

# --- Payment Endpoints ---
@api.route('/schedule-payment', methods=['POST'])
def schedule_payment():
    try:
        data = request.json
        # Demo user ko get karein (ya authenticated user ko in a real app)
        demo_user = get_or_create_demo_user()

        payment = Payment(
            user_id=demo_user.id, # Payment ko user se link karein
            payee=data['payee'],
            amount=float(data['amount']), # Ensure amount is converted to float
            due_date=datetime.strptime(data['due_date'], '%Y-%m-%d'), # Ensure date format is correct
            method=data['method'],
            status='Pending' # Default status
        )
        db.session.add(payment)
        db.session.commit()
        return jsonify({'message': 'Payment scheduled successfully'}), 201
    except Exception as e:
        db.session.rollback() # Agar error ho toh database changes rollback karein
        return jsonify({'error': str(e)}), 400 # Return specific error message

@api.route('/payments/<int:user_id>', methods=['GET'])
def get_payments(user_id):
    # Fetch payments for a specific user
    payments = Payment.query.filter_by(user_id=user_id).order_by(Payment.due_date.desc()).all()
    return jsonify([
        {
            'id': p.id,
            'user_id': p.user_id,
            'payee': p.payee,
            'amount': p.amount,
            'due_date': p.due_date.strftime('%Y-%m-%d'),
            'status': p.status,
            'method': p.method,
            'created_at': p.created_at.strftime('%Y-%m-%d %H:%M')
        }
        for p in payments
    ])
    
@api.route('/payment/<int:payment_id>/cancel', methods=['POST'])
def cancel_payment(payment_id):
    payment = Payment.query.get(payment_id)
    if not payment:
        return jsonify({'error': 'Payment not found'}), 404
    
    if payment.status != 'Pending':
        return jsonify({'error': 'Only pending payments can be cancelled'}), 400

    payment.status = 'Cancelled'
    db.session.commit()
    return jsonify({'message': 'Payment cancelled successfully'})

# --- CORE LOGIC: Automatic Payment Processing ---
@api.route('/process-due-payments', methods=['POST'])
def process_due_payments():
    """
    Yeh function saare due payments ko process karega.
    Ek real app mein, yeh function ek scheduler (cron job) se daily run hona chahiye.
    """
    today = date.today()
    # Sirf 'Pending' status wale payments ko process karein jinki due date aaj ya usse pehle ki hai
    due_payments = Payment.query.filter(Payment.status == 'Pending', db.func.date(Payment.due_date) <= today).all()
    
    processed_count = 0
    failed_count = 0

    for payment in due_payments:
        user = payment.user # Payment se linked user ko access karein
        if user.balance >= payment.amount:
            # Payment successful
            user.balance -= payment.amount
            payment.status = 'Paid'
            processed_count += 1
        else:
            # Payment failed due to insufficient balance
            payment.status = 'Failed'
            failed_count += 1
    
    db.session.commit()
    
    return jsonify({
        'message': 'Payment processing complete.',
        'processed': processed_count,
        'failed': failed_count
    })