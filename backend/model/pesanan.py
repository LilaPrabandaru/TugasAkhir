from model import Database
from config import MONGO_DB, MONGO_PESANAN_COLLECTION
import random
import string

class Pesanan:
    def __init__(self):
        self.connection = Database(MONGO_DB)

    def generatedId(self):
        randomString = ''.join(random.choices(string.digits, k=4))
        generatedId = f"ODR{randomString}"
        filter = {'_id': generatedId}
        _, data = self.connection.find(collection_name=MONGO_PESANAN_COLLECTION, filter=filter)
        if data is None:
            return generatedId
        return self.generatedId()
    
    def findPesanan(self, pesanan_id):
        result = {'status': False, 'data': None, 'message': ''}
        filter = {'_id': str(pesanan_id)}
        data = self.connection.findMany(collection_name=MONGO_PESANAN_COLLECTION, filter=filter)

        if data:
            result['status'] = True
            result['data'] = data
            result['message'] = 'Successfully Retrieved Order Data'
        else:
            result['message'] = 'Order Not Found'
        return result
    
    def findAllPesanan(self):
        result = {'status': False, 'data': None, 'message': ''}
        status, data = self.connection.findMany(collection_name=MONGO_PESANAN_COLLECTION, filter={})

        result['status'] = status
        result['data'] = data

        if len(data) == 0:
            result['message'] = 'Order Not Found'
        elif not status:
            result['message'] = 'An Error Occurred While Retrieving Order Data'

        if status and len(data) != 0:
            for item in result['data']:
                item['_id'] = str(item['_id'])
            result['status'] = True
            result['message'] = 'Successfully Retrieved Order Data'
        return result
    
    def findPesananTanggal(self, tanggal):
        result = {'status': False, 'data': None, 'message': ''}

        filter = {'Tanggal': tanggal}
        pesanan_data = self.connection.findMany(collection_name=MONGO_PESANAN_COLLECTION, filter=filter)

        if pesanan_data:
            result['status'] = True
            result['data'] = pesanan_data
            result['message'] = 'Successfully Retrieved Order Data'
        else:
            result['message'] = 'Order Not Found'
        return result

    def insertPesanan(self, data):
        result = {'status': False, 'data': None, 'message': ''}

        data['_id'] = self.generatedId()
        statusInsert, dataInsert = self.connection.insert(collection_name=MONGO_PESANAN_COLLECTION, value=data)

        if statusInsert == False:
            result['message'] = 'An Error Occured While Inserting Order Data'

        if statusInsert == True and dataInsert != None:
            result['status'] = True
            result['data'] = data
            result['message'] = 'Successfully Insert Order Data'
        return result
    
    def updatePesanan(self, pesanan_id, data):
        result = {'status': False, 'data': None, 'message': ''}
        filter = {'_id': pesanan_id}
        value = {'$set': data}

        statusUpdate, dataUpdate = self.connection.update(collection_name=MONGO_PESANAN_COLLECTION, filter=filter, value=value, upsert=False)

        if statusUpdate:
            if dataUpdate.get('modified_count', 0) > 0:
                result['status'] = True
                result['data'] = data
                result['message'] = 'Successfully Update Order Data'
            else:
                result['status'] = False
                result['message'] = 'No Data Changes'
        else:
            result['status'] = False
            result['message'] = 'An Error Occurred While Updating Order Data'
        return result
    
    def deletePesanan(self, pesanan_id):
        result = {'status': False, 'data': None, 'message': ''}
        filter = {'_id': pesanan_id}
        status, _ = self.connection.delete(collection_name=MONGO_PESANAN_COLLECTION, filter=filter)
        
        if status:
            result['status'] = True
            result['message'] = 'Successfully Deleted Order Data'
        else:
            result['message'] = 'An Error Occured While Deleting Order Data'
        return result