from model import Database
from bson import ObjectId
from config import MONGO_DB, MONGO_MENU_COLLECTION, MONGO_PESANAN_COLLECTION, MIDTRANS_CLIENT_KEY, MIDTRANS_SERVER_KEY
import random, string
import midtransclient

class Public :
    def __init__(self):
        self.connection = Database(MONGO_DB)
        # Initialize Midtrans client
        self.midtrans_snap = midtransclient.Snap(
            server_key=MIDTRANS_SERVER_KEY,
            client_key=MIDTRANS_CLIENT_KEY,
            is_production=False  # Use 'is_production' instead of 'environment'
        )
        
    def generateId(self):
        randomString = ''.join(random.choices(string.digits, k=4))
        generatedId = f"PB{randomString}"
        filter = {'_id': generatedId}
        # Pass the filter argument to find()
        _, data = self.connection.find(collection_name=MONGO_MENU_COLLECTION, filter=filter)
        if data is None:
            return generatedId
        return self.generateId()
    
    def findMenu(self, menu_id):
        filter = {'_id': menu_id}  # Ensure menu_id is used as a filter
        result = self.connection.find_one(collection_name=MONGO_MENU_COLLECTION, filter=filter)
        print(result)
        return result
    
    def findAllMenu(self):
        result = {'status': False, 'data': None, 'message': ''}
        # Pass an empty filter {} to findMany()
        status, data = self.connection.findMany(collection_name=MONGO_MENU_COLLECTION, filter={})
        
        result['status'] = status
        result['data'] = data
        
        if len(data) == 0:
            result['message'] = 'Menu Not Found'
        elif not status:
            result['message'] = 'An Error Occurred While Retrieving Menu Data'
        
        if status and len(data) != 0:
            for item in result['data']:
                item['_id'] = str(item['_id'])
            result['status'] = True
            result['message'] = 'Successfully Retrieved Menu Data'
        return result
    
    def addPesanan(self, pesanan_data):
        try:
            # Generate a unique ID for the order
            randomString = ''.join(random.choices(string.digits, k=4))
            generatedId = f"ODR{randomString}"

            # Prepare the document to be inserted
            pesanan_document = {
                "_id": generatedId,
                "Nama_Pelanggan": pesanan_data.get("Nama_Pelanggan"),
                "Tanggal": pesanan_data.get("Tanggal"),
                "Waktu": pesanan_data.get("Waktu"),
                "Detail": pesanan_data.get("Detail", []),
                "Status": "Not Paid",  # Default status is "Not Paid"
                "total harga": pesanan_data.get("total_harga", 0)
            }

            # Insert the document into the Pesanan collection
            self.connection.insert_one(collection_name=MONGO_PESANAN_COLLECTION, document=pesanan_document)
            return {"status": True, "message": "Order successfully added", "order_id": generatedId}
        except Exception as e:
            print(f"Error adding order: {e}")
            return {"status": False, "message": "An error occurred while adding the order"}
        
    def getAllPesananByEmail(self, email):
        try:
            # Filter orders by email
            filter = {"Nama_Pelanggan": email}  # Assuming the 'email' field exists in your database schema
            status, data = self.connection.findMany(collection_name=MONGO_PESANAN_COLLECTION, filter=filter)

            result = {'status': status, 'data': data, 'message': ''}

            if len(data) == 0:
                result['message'] = 'No orders found for this user'
            elif not status:
                result['message'] = 'An error occurred while retrieving orders'
            else:
                for item in result['data']:
                    item['_id'] = str(item['_id'])  # Convert ObjectId to string
                result['status'] = True
                result['message'] = 'Successfully retrieved orders for the user'

            return result
        except Exception as e:
            print(f"Error fetching orders by email: {e}")
            return {"status": False, "message": "An unexpected error occurred"}
        
    def updatePaymentStatus(self, order_id, status):
        try:
            filter_query = {"_id": order_id}  # Match the order by its ID
            update_data = {"$set": {"Status": status}}  # Update the "Status" field
            
            # Use the new update_one method
            success, result = self.connection.update_one(
                collection_name=MONGO_PESANAN_COLLECTION,
                filter_query=filter_query,
                update_data=update_data
            )
            
            if success and result.get("modified_count", 0) > 0:
                return {"status": True, "message": "Payment status updated successfully"}
            else:
                return {"status": False, "message": "Order not found or status unchanged"}
        except Exception as e:
            print(f"Error updating payment status: {e}")
            return {"status": False, "message": "An unexpected error occurred"}
        
    def create_midtrans_transaction(self, order_id, total_amount):
        try:
            param = {
                "transaction_details": {
                    "order_id": order_id,
                    "gross_amount": total_amount
                },
                "payment_type": "qris",  # Or "qris" for QRIS
                "qris": {
                    "enable_callback": True,
                    "callback_url": "https://05f1-139-255-192-106.ngrok-free.app/midtrans-notification-handler"
                }
            }
            transaction = self.midtrans_snap.create_transaction(param)
            print(transaction)
            return transaction['redirect_url']
        except Exception as e:
            print("========MASUK SINI ERRORNYA=======")
            print("SERVER_KEY:", MIDTRANS_SERVER_KEY)
            print(f"Midtrans error: {e}")
            return None
