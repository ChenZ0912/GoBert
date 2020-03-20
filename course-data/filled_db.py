import pymongo
import csv

client = pymongo.MongoClient(
    "mongodb+srv://kaixuan:happycoding@courseapi-ujwvo.mongodb.net/nyu?retryWrites=true&w=majority")
db = client["nyu"]


with open("course_num.csv", 'r') as f:
    reader = csv.reader(f)
    for row in reader:
        