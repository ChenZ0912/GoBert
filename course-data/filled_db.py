import pymongo
import csv

client = pymongo.MongoClient(
    "mongodb+srv://kaixuan:happycoding@courseapi-ujwvo.mongodb.net/nyu?retryWrites=true&w=majority")
db = client["nyu"]

courses = []
sections = []
teaches = []
professors = []
# course_id,course_name,section_id,session,days/times,dates,instructor,status
with open("course_num_fall.csv", 'r') as f:
    reader = csv.reader(f, quotechar='¥', delimiter=',', quoting=csv.QUOTE_ALL, skipinitialspace=True)
    next(reader)
    for row in reader:
        
        if len(row) == 9:
            print(row)
            row[1] += row.pop(3).split("Topic:")[1]
        
        temp = row[1].split("-", 2)
        # print(temp)
        course_id = temp[0] + temp[1].rstrip()
        course_title = temp[2].lstrip()
        
        temp = row[2].split(" (")
        class_no = temp[1][:-1]
        term = "Spring 2020"

        days_times = row[4].split(": ")[1]
        dates = row[5].split(": ")[1]
        session = row[3].split(": ")[1]
        status = row[7].split(": ")[1]

        instructors = row[6].split(": ")[1].split(", ")

        curr_course = {
            'courseID': course_id,
            'courseTitle': course_title,
            'numRate': 0,
            'score': 0
        }
        if curr_course not in courses:
            courses.append(curr_course)

        for instructor in instructors:

            curr_prof = {
                'name': instructor,
                'score': 0,
                'numRate': 0
            }

            if curr_prof not in professors:
                professors.append(curr_prof)

            curr_sec = {
                'courseID': course_id,
                'courseTitle': course_title,
                'classNo': class_no,
                'term': term,
                'daystimes': days_times,
                'dates': dates,
                'session': session,
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

            

db['sections'].drop()
db['courses'].drop()
db['teaches'].drop()
db['professors'].drop()
db['sections'].insert_many(sections)
db['courses'].insert_many(courses)
db['teaches'].insert_many(teaches)
db['professors'].insert_many(professors)
