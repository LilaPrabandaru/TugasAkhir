from model import Database
from config import MONGO_DB, MONGO_KARYAWAN_COLLECTION
from bson import ObjectId
import random
import string

class Karyawan:
    def __init__(self):
        self.connection = Database(MONGO_DB)

    def generateId(self):
        randomString = ''.join(random.choices(string.digits, k=4))
        generatedId = f"EMP{randomString}"
        filter = {'_id': generatedId}
        _, data = self.connection.find(collection_name=MONGO_KARYAWAN_COLLECTION, filter=filter)
        if data is None:
            return generatedId
        return self.generateId()
    
    def findKaryawan(self, karyawan_id):
        result = {'status': False, 'data': None, 'message': ''}
        filter = {'_id': karyawan_id}
        data = self.connection.find_one(collection_name=MONGO_KARYAWAN_COLLECTION, filter=filter)

        if data:
            result['status'] = True
            result['data'] = data
            result['message'] = 'Successfully Retrieved Employee Data'
        else:
            result['message'] = 'Employee Not Found'

        return result

    def findAllKaryawan(self):
        result = {'status': False, 'data': None, 'message': ''}
        status, data = self.connection.findMany(collection_name=MONGO_KARYAWAN_COLLECTION, filter={})

        result['status'] = status
        result['data'] = data

        if len(data) == 0:
            result['message'] = 'Employee Not Found'
        elif not status:
            result['message'] = 'An Error Occurred While Retrieving Employee Data'

        if status and len(data) != 0:
            for item in result['data']:
                item['_id'] = str(item['_id'])

            result['status'] = True
            result['message'] = 'Successfully Retrieved All Employee Data'

        return result
    
    def insertKaryawan(self, data):
        result = {'status': False, 'data': None, 'message': ''}

        data['_id'] = self.generateId()
        statusInsert, dataInsert = self.connection.insert(collection_name=MONGO_KARYAWAN_COLLECTION, value=data)
        if not statusInsert:
            result['message'] = "An Error Occurred While Inserting Employee Data"
            return result

        if statusInsert and dataInsert is not None:
            result['status'] = True
            result['message'] = "Successfully Entered Employee Data"
            result['data'] = data
        return result
    
    def updateKaryawan(self, karyawan_id, data):
        result = {'status': False, 'data': None, 'message': ''}
        filter = {'_id': karyawan_id}
        value = {'$set': data}

        statusUpdate, dataUpdate = self.connection.update(collection_name=MONGO_KARYAWAN_COLLECTION, filter=filter, value=value, upsert=False)

        if dataUpdate.get('modified_count', 0) == 0:
            result['message'] = "No Data Changes"
        elif not statusUpdate:
            result['message'] = "An Error Occurred While Updating Employee Data"

        if statusUpdate and dataUpdate.get('modified_count', 0) != 0:
            result['status'] = True
            result['data'] = data
            result['message'] = "Successfully Updated Employee Data"
        return result
    
    def deleteKaryawan(self, karyawan_id):
        result = {'status': False, 'data': None, 'message': ''}
        filter = {'_id': karyawan_id}
        status, _ = self.connection.delete(collection_name=MONGO_KARYAWAN_COLLECTION, filter=filter)

        if status:
            result['status'] = True
            result['message'] = "Successfully Deleted Employee Data"
        else:
            result['message'] = "An Error Occurred While Deleting Employee Data"

        return result
