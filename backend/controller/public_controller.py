from flask_restful import Resource
import json
from flask import request, session
from model.public import Public

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
            # Parse JSON data from the request body
            data = request.get_json()

            # Validate required fields
            required_fields = ["Nama_Pelanggan", "Tanggal", "Waktu", "Detail", "total_harga"]
            if not all(field in data for field in required_fields):
                return {"message": "Missing required fields"}, 400

            # Call the model method to add the order
            result = public_model.addPesanan(data)

            if result["status"]:
                return {"message": result["message"], "order_id": result["order_id"]}, 201
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