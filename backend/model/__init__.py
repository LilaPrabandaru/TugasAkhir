from config import MONGO_URI
from pymongo import MongoClient, errors

class Database:
    def __init__(self, dbname):
        try:
            self.connection = MongoClient(MONGO_URI)
            self.db = self.connection[dbname]
        except errors.ConnectionFailure as conn_fail:
            print(f"Gagal membuat koneksi (connection failure) | {conn_fail}")
        except Exception as error:
            print(f"Gagal membuat koneksi (other) | {error}")

    def find(self, collection_name, filter):
        status = False
        data = None
        try:
            collection = self.db[collection_name]
            resultFind = collection.find_one(filter)
            data = resultFind
            status = True
        except errors.PyMongoError as pymongoError:
            print(f"Gagal find data, error pymongo: {pymongoError}")
        except Exception as err:
            print(f"Gagal find data, other error: {err}")
        return status, data
    
    def find_one(self, collection_name, filter):
        result = {'status': False, 'data': None, 'message': ''}
        try:
            collection = self.db[collection_name]
            resultFind = collection.find_one(filter)
            if resultFind:
                resultFind['_id'] = str(resultFind['_id']) 
                result['status'] = True
                result['data'] = resultFind
                result['message'] = 'Data ditemukan'
            else:
                result['message'] = 'Data tidak ditemukan'
        except errors.PyMongoError as pymongoError:
            print(f"Error pymongo : {pymongoError}")
            result['message'] = 'Terjadi kesalahan saat mengambil data'

        return result
    
    def findMany(self, collection_name, filter):
        status = False
        data = None
        try:
            collection = self.db[collection_name]
            resultFind = collection.find(filter)

            # Konversi ke list
            data = list(resultFind)

            # Debugging Output
            print(f"DEBUG: findMany - Jumlah data ditemukan: {len(data)}")
            for item in data:
                print(f"DEBUG: Data item: {item}")  

            status = True
        except errors.PyMongoError as pymongoError:
            print(f"Gagal find many data, error pymongo: {pymongoError}")
        except Exception as err:
            print(f"Gagal find many data, other error: {err}")
        return status, data
    
    def insert(self, collection_name,  value):
        status = False
        data = None
        try:
            collection = self.db[collection_name]
            resultInsert = collection.insert_one(value)
            data = resultInsert.inserted_id
            status = True
        except errors.PyMongoError as pymongoError:
            print(f"Gagal insert data, error pymongo: {pymongoError}")
        except Exception as err:
            print(f"Gagal insert data, other error: {err}")
        return status, data
    
    def update(self, collection_name, filter, value, upsert):
        status = False
        data = None
        try:
            collection = self.db[collection_name]
            resultUpdate = collection.update_one(filter=filter, update=value, upsert=upsert)
            data = {'modified_count': resultUpdate.modified_count}
            status = True
        except errors.PyMongoError as pymongoError:
            print(f"Gagal update data, error pymongo: {pymongoError}")
        except Exception as err:
            print(f"Gagal update data, other error: {err}")
        return status, data
    
    def delete(self, collection_name, filter):
        status = False
        data = None
        try:
            collection = self.db[collection_name]
            resultDelete = collection.delete_one(filter)
            data = {'deleted_count': resultDelete.deleted_count}
            status = True
        except errors.PyMongoError as pymongoError:
            print(f"Gagal delete data, error pymongo: {pymongoError}")
        except Exception as err:
            print(f"Gagal delete data, other error: {err}")
        return status, data
    
    def count_document(self, collection_name, filter={}):
        try:
            collection = self.get_collection(collection_name)
            return collection.count_document(filter)
        except errors.PyMongoError as pymongoError:
            print(f"Error pymongo: {pymongoError}")
            return 0