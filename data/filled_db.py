import pymongo
import csv
import json
import re
client = pymongo.MongoClient(
    "mongodb+srv://kaixuan:happycoding@courseapi-ujwvo.mongodb.net/nyu?retryWrites=true&w=majority")
db = client["nyu"]

courses = []
sections = []
teaches = []
professors = []

def tokenize(query):
    return ' '.join(re.sub('[^A-Za-z0-9 ]+', '', query).split())

def dewhitespace(query):
    return ''.join(query.split())

# course_id,course_name,section_id,session,days/times,dates,instructor,status
# course_id,course_name,section,topic,session,daystimes,dates,instructor,status
def getData(filename):
    print('getting data from', filename)
    with open(filename, 'r') as f:
        reader = csv.DictReader(f, quotechar='¥', delimiter=',', quoting=csv.QUOTE_ALL, skipinitialspace=True)
        header = next(reader)

        for row in reader:

            temp = row['course_name'].split("-", 2)
            # print(temp)
            course_id = temp[0] + temp[1].rstrip()
            course_title = temp[2].lstrip()+ " " + row['topic']

            temp = row['section'].split(" (")
            t = temp[0].split('-')[1]
            section = temp[0]

            course_title = course_title + " " + t
            class_no = temp[1][:-1]
            if 'fall' in filename:
                term = "Fall 2019"
            else:
                term = "Spring 2020"

            days_times = row['days/times']
            dates = row['dates']
            session = row['session']
            status = row['status']

            instructors = row['instructor'].split(", ")

            curr_course = {
                'courseID': course_id,
                'courseTitle': course_title
            }
            if curr_course not in courses:
                courses.append(curr_course)

            for instructor in instructors:

                curr_prof = {
                    'name': instructor,
                    'firstname': instructor.split(' ')[0],
                    'lastname': instructor.split(' ')[-1]
                }

                if curr_prof not in professors:
                    professors.append(curr_prof)

                curr_sec = {
                    'courseID': course_id,
                    'courseTitle': course_title,
                    'classNo': class_no,
                    'term': term,
                    'dt': days_times,
                    'dates': dates,
                    'session': session,
                    'section': section,
                    'professor': instructor,
                    'status': status
                }

                sections.append(curr_sec)

                curr_teach = {
                    'courseID': course_id,
                    'courseTitle': course_title,
                    'professor': instructor
                }

                if curr_teach not in teaches:
                    teaches.append(curr_teach)

rmp = {}
notFoundCount = 0
totalCount = 0
def getRMP(filename):
    global notFoundCount
    global totalCount
    print('getting data from', filename)
    with open(filename, 'r') as f:
        data = json.load(f)
        for rating in data:
            if rating['wouldTakeAgain'] == "":
                wouldTakeAgain = "N/A"
            else:
                wouldTakeAgain = rating['wouldTakeAgain'] + "%"

            if rating['score'] == 'N/A':
                rating['score'] = '0'
        
            if rating['levelOfDifficulty'] == '':
                rating['levelOfDifficulty'] = '0'
            rating['numRate'] = 0

            rmp[rating['name']] = {
                "name": rating['name'],
                "rscore": float(rating['score']),
                "rnumRate": int(rating['numRate']),
                "department": rating['department'],
                "wouldTakeAgain": wouldTakeAgain,
                "levelOfDifficulty": float(rating['levelOfDifficulty']),
                "tags": rating['tags']
            }

            # print(rmp[rating['name']])

    print('combine data from rmp')

    
    for name in rmp:
        fname = name.split(' ')[0]
        lname = name.split(' ')[-1]

        rating = rmp[name]
        found = False
        for prof in professors:
            if prof['firstname'] == fname and prof['lastname'] == lname:
                prof["rscore"] = rating['rscore']
                prof["rnumRate"] = rating['rnumRate']
                prof["department"] = rating['department']
                prof["wouldTakeAgain"] = rating['wouldTakeAgain']
                prof["levelOfDifficulty"] = rating['levelOfDifficulty']
                prof["tags"] = rating['tags']
                
                found = True
                break


        if not found:
            notFoundCount += 1
            # print(name)
        # print(name, prof['name'])
        totalCount += 1


for course in courses:
    course['numRate'] = 0
    course['score'] = 0

for prof in professors:
    prof['numRate'] = 0
    prof['score'] = 0


getData("course_num_fall.csv")
getData("course_num_spring.csv")
getData("course_num_fall_2020.csv")

getRMP("rmp/RMPdata.json")

# print(professors)
print(notFoundCount, totalCount)

# _total = tokenize(course_id + " " + course_title)
# 'numRate': 0,
# 'score': 0,
# '_total': _total,
# '_total_concat': dewhitespace(_total)



# 'score': 0,
# 'numRate': 0
# 'rscore': 0,
# 'rnumRate': 0,
# 'rtags': [],
# 'department': '',
# 'wouldTakeAgain': '',
# 'levelOfDifficulty': ''

db['sections'].drop()
db['courses'].drop()
db['teaches'].drop()
db['professors'].drop()
db['sections'].insert_many(sections)
db['courses'].insert_many(courses)
db['teaches'].insert_many(teaches)
db['professors'].insert_many(professors)
