from model import Database
from bson import ObjectId
from config import MONGO_DB, MONGO_MENU_COLLECTION
import random
import string

class Menu:
    def __init__(self):
        self.connection = Database(MONGO_DB)

    def generateId(self):
        randomString = ''.join(random.choices(string.digits, k=4))
        generatedId = f"MN{randomString}"
        filter = {'_id': generatedId}
        _, data = self.connection.find(collection_name=MONGO_MENU_COLLECTION, filter=filter)
        if data is None:
            return generatedId
        return self.generateId()

    def findMenu(self, menu_id):
        filter = menu_id
        result = self.connection.find_one(collection_name=MONGO_MENU_COLLECTION, filter=filter)
        print(result)
        return result

    def findAllMenu(self):
        result = {'status': False, 'data': None, 'message': ''}
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
    
    def insertMenu(self, data):
        result = {'status': False, 'data': None, 'message': ''}

        valid_kategori = ["Ayam", "Steak Original & Crispy", "Spesial Nasi Goreng", "Pelengkap", "Minuman Es/Panas", "Menu Baru"]
        valid_tipe = ["Makanan", "Minuman"]

        if data['Kategori'] not in valid_kategori:
            result = {'status': False, 'message': 'Invalid Category'}
            return result
        
        if data['Tipe'] not in valid_tipe:
            result = {'status': False, 'message': 'Invalid Type (Must be food or drink)'}
            return result

        data['_id'] = self.generateId()
        statusInsert, dataInsert = self.connection.insert(collection_name=MONGO_MENU_COLLECTION, value=data)

        if statusInsert == False:
            result['message'] = 'An Error Occurred While Inserting Menu Data'
        
        if statusInsert == True and dataInsert != None:
            result['status'] = True
            result['data'] = data
            result['message'] = 'Successfully Insert Menu Data'
        return result
    
    def updateMenu(self, menu_id, data):
        result = {'status': False, 'data': None, 'message': ''}
        filter = {'_id': menu_id}
        value = {'$set': data}

        statusUpdate, dataUpdate = self.connection.update(collection_name=MONGO_MENU_COLLECTION, filter=filter, value=value, upsert=False)

        if dataUpdate.get('modified_count', 0) == 0:
            result['message'] = 'No Data Changes'
        elif not statusUpdate:
            result['message'] = 'An Error Occurred While Updating Menu Data'

        if statusUpdate and dataUpdate.get('modified_count', 0) != 0:
            result['status'] = True
            result['data'] = data
            result['message'] = 'Successfully Updated Menu Data'
        return result
    
    def deleteMenu(self, menu_id):
        result = {'status': False, 'data': None, 'message': ''}
        filter = {'_id': menu_id}
        status, _ = self.connection.delete(collection_name=MONGO_MENU_COLLECTION, filter=filter)

        if status:
            result['status'] = True
            result['message'] = "Successfully Deleted Menu Data"
        else:
            result['message'] = "An Error Occurred While Deleting Menu Data"
        return result
