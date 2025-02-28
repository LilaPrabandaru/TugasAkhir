from model import Database
from bson import ObjectId
from config import MONGO_DB, MONGO_MENU_COLLECTION
import random, string

class Public :
    def __init__(self):
        self.connection = Database(MONGO_DB)
        
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