import pymongo
import json

client = pymongo.MongoClient(
    "mongodb+srv://kaixuan:happycoding@courseapi-ujwvo.mongodb.net/nyu?retryWrites=true&w=majority")
db = client["nyu"]

rmp = []

def getData(filename):
	with open(filename, 'r') as f:
		data = json.load(f)
		for rating in data:
			if rating['wouldTakeAgain'] == "":
				wouldTakeAgain = "N/A"
			else:
				wouldTakeAgain = rating['wouldTakeAgain'] + "%"
			rmp.append(
				{
					"name": rating['name'],
					"firstname": rating['name'].split(" ")[0],
					"lastname": rating['name'].split(" ")[-1],
					"score": rating['score'],
					"department": rating['department'],
					"wouldTakeAgain": wouldTakeAgain,
					"levelOfDifficulty": rating['levelOfDifficulty'],
					"tags": rating['tags']
				}
			)

getData("RMPdata.json")

db['rmp_records'].drop()
db['rmp_records'].insert_many(rmp)
