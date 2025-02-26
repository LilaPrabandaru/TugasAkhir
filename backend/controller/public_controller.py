from flask_restful import Resource
from flask_jwt_extended import jwt_required
import json

class GetUser(Resource):
    @jwt_required()
    def get(self):
        return {"message": "Berhasil masuk ke tampilan User"}, 200
    
class UserDashboard(Resource):
    @jwt_required()
    def get(self):
        # Misalnya, ambil data dari database atau hitung statistik
        dashboard_data = {
            "total_orders": 42,
            "pending_orders": 5,
            "user_rank": "Gold",
            "recent_activity": [
                {"id": 1, "activity": "Ordered a Latte"},
                {"id": 2, "activity": "Reviewed a Cappuccino"},
            ]
        }
        print(dashboard_data)
        return {"message": "User Dashboard Data", "data": dashboard_data}, 200
