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
    
    def find_status(self, collection_name, filter):
        try:
            collection = self.db[collection_name]
            document = collection.find_one(filter)
            if document:
                return True, document  # Success: True, Data: document
            else:
                return False, None  # Success: False, Data: None
        except Exception as e:
            print(f"Error in find_one: {e}")
            return False, None
    
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
    
    def insert_one(self, collection_name, document):
        """
        Insert a single document into a collection.
        :param collection_name: Name of the collection.
        :param document: Document to insert.
        :return: Inserted ID or None.
        """
        try:
            collection = self.db[collection_name]
            result = collection.insert_one(document)
            return result.inserted_id
        except Exception as e:
            print(f"Error in insert_one: {e}")
            return None
    
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
    
    def update_one(self, collection_name, filter_query, update_data, upsert=False):
        """
        Update a single document in the collection.
        
        :param collection_name: Name of the collection
        :param filter_query: Query to find the document to update
        :param update_data: Update operations (e.g., {"$set": {...}})
        :param upsert: If True, insert new document if none match
        :return: Tuple (success: bool, result: dict)
        """
        try:
            collection = self.db[collection_name]
            result = collection.update_one(
                filter=filter_query,
                update=update_data,
                upsert=upsert
            )
            
            return True, {
                "matched_count": result.matched_count,
                "modified_count": result.modified_count,
                "upserted_id": result.upserted_id
            }
        except errors.PyMongoError as pymongo_err:
            print(f"MongoDB error during update: {pymongo_err}")
            return False, {"error": str(pymongo_err)}
        except Exception as e:
            print(f"General error during update: {e}")
            return False, {"error": str(e)}
    
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