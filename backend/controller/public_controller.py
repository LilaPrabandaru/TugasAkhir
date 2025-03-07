from flask_restful import Resource
import json
from flask import request, session
from model.public import Public
from config import MONGO_PESANAN_COLLECTION

public_model = Public()
class GetMenu(Resource):
    def get(self):
        result = public_model.findAllMenu()
        if result['status']:
            return result['data'], 200
        else:
            return {'message': 'Menu Not Found!'}, 404
        
class AddPesananUser(Resource):
    def post(self):
        try:
            data = request.get_json()
            required_fields = ["Nama_Pelanggan", "Tanggal", "Waktu", "Detail", "total_harga"]
            if not all(field in data for field in required_fields):
                return {"message": "Missing required fields"}, 400

            # Create order in database
            result = public_model.addPesanan(data)

            if result["status"]:
                # Create Midtrans transaction
                payment_url = public_model.create_midtrans_transaction(
                    order_id=result["order_id"],
                    total_amount=data["total_harga"]
                )

                return {
                    "status": result["status"],
                    "message": result["message"],
                    "order_id": result["order_id"],
                    "payment_url": payment_url  # Include payment URL in response
                }, 201
            else:
                return {"message": result["message"]}, 500
        except Exception as e:
            print(f"Error in AddPesanan: {e}")
            return {"message": "An unexpected error occurred"}, 500
        
class GetAllPesananUser(Resource):
    def get(self):
        try:
            # Retrieve the email from the query parameters or headers
            email = request.args.get('email')  # Alternatively, use request.headers.get('Email')

            if not email:
                return {"message": "Email is required"}, 400

            # Fetch orders for the specific email
            result = public_model.getAllPesananByEmail(email)

            if result['status']:
                return result['data'], 200
            else:
                return {"message": "No orders found for this user"}, 404
        except Exception as e:
            print(f"Error in GetAllPesananUser: {e}")
            return {"message": "An unexpected error occurred"}, 500
        
class UpdatePaymentStatus(Resource):
    def put(self, pesanan_id):
        try:
            data = request.get_json()
            
            if "status" not in data:
                return {"message": "Missing status"}, 400

            # Use the updated model method
            result = public_model.updatePaymentStatus(
                order_id=pesanan_id,
                status=data["status"]
            )

            if result["status"]:
                return {"message": result["message"]}, 200
            else:
                return {"message": result["message"]}, 404
        except Exception as e:
            print(f"Error in UpdatePaymentStatus: {e}")
            return {"message": "An unexpected error occurred"}, 500
        
class MidtransNotification(Resource):
    def post(self):
        try:
            # Receive raw data from Midtrans
            raw_data = request.data.decode('utf-8')
            notification_data = json.loads(raw_data)
            print(f"Received Midtrans Notification: {notification_data}")  # Debugging log

            # Verify signature
            signature = hmac.new(
                'SB-Mid-server-X_RYyIKttvuQ_YFn0EmKCTql'.encode(),
                f"{notification_data['order_id']}{notification_data['status_code']}{notification_data['gross_amount']}".encode(),
                hashlib.sha512
            ).hexdigest()

            if signature != notification_data['signature_key']:
                print("Invalid Signature")  # Debugging log
                return {"message": "Invalid signature"}, 401

            # Extract order details
            order_id = notification_data['order_id']
            transaction_status = notification_data['transaction_status']
            print(f"Processing Order {order_id} with Status: {transaction_status}")  # Debugging log

            # Map Midtrans transaction_status to your application's Status field
            if transaction_status in ['capture', 'settlement']:
                public_model.updatePaymentStatus(order_id, 'Paid')
            elif transaction_status == 'pending':
                public_model.updatePaymentStatus(order_id, 'Pending')
            else:
                public_model.updatePaymentStatus(order_id, 'Failed')

            return {"message": "Notification processed"}, 200
        except Exception as e:
            print(f"Midtrans notification error: {e}")  # Debugging log
            return {"message": "Error processing notification"}, 500
        
class GetOrderStatus(Resource):
    def get(self, order_id):
        try:
            print(f"Fetching order status for order_id: {order_id}")  # Debugging log

            # Fetch the order from the database
            filter_query = {"_id": order_id}
            success, order = public_model.connection.find_status(
                collection_name=MONGO_PESANAN_COLLECTION,
                filter=filter_query
            )

            print(f"Database query result - Success: {success}, Order: {order}")  # Debugging log

            if not success or not order:
                return {"message": "Order not found"}, 404

            return {"status": order.get("Status")}, 200
        except Exception as e:
            print(f"Error fetching order status: {e}")  # Debugging log
            return {"message": "An unexpected error occurred"}, 500