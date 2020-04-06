import pymongo

client = pymongo.MongoClient(
    "mongodb+srv://dbreader:dbreader@courseapi-ujwvo.mongodb.net/nyu?retryWrites=true&w=majority")
db = client["nyu"]

professors = db['professors'].find({})
for professor in professors:
	# TODO
	# If a professor has a middle name, we can try to delete the middle name
	print(professor['name'])