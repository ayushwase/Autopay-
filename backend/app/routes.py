from flask import Blueprint, request, jsonify, current_app
from app import db
from app.models import User, Payment
from sqlalchemy.orm import joinedload
from datetime import datetime

api = Blueprint('api', __name__)

# ----------------------------------------------------
# User API Routes
# ----------------------------------------------------
@api.route('/user/<int:user_id>', methods=['GET'])
def get_user_data(user_id):
    user = User.query.filter_by(id=user_id).first()
    if user:
        failed_payments_count = Payment.query.filter_by(user_id=user.id, status='FAILED').count()
        user_data = {
            'id': user.id,
            'name': user.name,
            'bankName': user.bank_name,
            'balance': user.balance,
            'failed_payments_count': failed_payments_count
        }
        return jsonify(user_data), 200
    return jsonify({'message': 'User not found'}), 404

# ----------------------------------------------------
# Payments API Routes
# ----------------------------------------------------
@api.route('/payments/<int:user_id>', methods=['GET'])
def get_user_payments(user_id):
    payments = Payment.query.filter_by(user_id=user_id).order_by(Payment.due_date.desc()).all()
    payments_data = []
    for payment in payments:
        payments_data.append({
            'id': payment.id,
            'payee': payment.payee,  # <--- इथे 'payee' असे अपडेट केले आहे
            'amount': float(payment.amount),
            'due_date': payment.due_date.strftime('%Y-%m-%d'), # <--- इथे 'due_date' असे अपडेट केले आहे
            'method': payment.method, # <--- नवीन: 'method' फील्ड ऍड केले आहे
            'status': payment.status,
            'created_at': payment.created_at.strftime('%Y-%m-%d %H:%M:%S') # <--- नवीन: 'created_at' फील्ड ऍड केले आहे
        })
    return jsonify(payments_data), 200

@api.route('/schedule-payment', methods=['POST'])
def schedule_payment():
    data = request.get_json()
    if not data:
        return jsonify({'message': 'No input data provided'}), 400

    print(f"Received data for schedule-payment: {data}")
    print(f"Value of 'due_date' field: {data.get('due_date')}")


    user = User.query.filter_by(id=1).first()
    if not user:
        return jsonify({'message': 'User ID 1 not found'}), 404

    try:
        due_date_str = data.get('due_date')
        if not due_date_str:
            return jsonify({'message': 'Payment date (due_date) is required'}), 400

        try:
            parsed_date = datetime.strptime(due_date_str, '%Y-%m-%d').date()
        except ValueError as ve:
            return jsonify({'message': f'Invalid date format for "{due_date_str}". Expected YYYY-MM-DD.', 'error': str(ve)}), 400

        payment_method = data.get('method', 'Other')

        new_payment = Payment(
            user_id=user.id,
            payee=data['payee'],
            amount=data['amount'],
            due_date=parsed_date,
            status='SCHEDULED',
            method=payment_method
        )
        db.session.add(new_payment)
        db.session.commit()
        return jsonify({'message': 'Payment scheduled successfully', 'payment_id': new_payment.id}), 201
    except KeyError as ke:
        db.session.rollback()
        print(f"Missing data key during scheduling: {ke}")
        return jsonify({'message': f"Missing data: {str(ke)}. Make sure 'payee', 'amount', and 'due_date' are provided."}), 400
    except Exception as e:
        db.session.rollback()
        print(f"An unexpected error occurred during scheduling: {e}")
        return jsonify({'message': 'An unexpected error occurred during scheduling', 'error': str(e)}), 500

# ----------------------------------------------------
# Automatic Payment Processing (Scheduler & Manual Trigger)
# ----------------------------------------------------

@api.route('/process-due-payments', methods=['POST'])
def process_due_payments_route():
    return process_due_payments(current_app)

def process_due_payments(app):
    print(f"[{datetime.now()}] Attempting to process due payments...")

    with app.app_context():
        today = datetime.now().date()

        payments_to_process = Payment.query.options(joinedload(Payment.user)).filter(
            Payment.status == 'SCHEDULED',
            Payment.due_date <= today
        ).all()

        processed_count = 0
        failed_count = 0

        for payment in payments_to_process:
            user = payment.user
            if user and user.balance >= payment.amount:
                user.balance -= payment.amount
                payment.status = 'PAID'
                processed_count += 1
                print(f"Processed payment ID {payment.id} for user {user.name}. New balance: {user.balance}")
            else:
                payment.status = 'FAILED'
                failed_count += 1
                print(f"Failed to process payment ID {payment.id} for user {user.name}. Insufficient balance or user not found.")

        try:
            db.session.commit()
            print(f"[{datetime.now()}] Payment processing complete. Processed: {processed_count}, Failed: {failed_count}")
            return jsonify({'message': 'Payments processed successfully', 'processed': processed_count, 'failed': failed_count}), 200
        except Exception as e:
            db.session.rollback()
            print(f"[{datetime.now()}] Error committing payments: {e}")
            return jsonify({'message': 'Error processing payments', 'error': str(e)}), 500