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
with open("course_num.csv", 'r') as f:
    reader = csv.DictReader(f)
    headers = next(reader, None)
    for row in reader:
        temp = row['course_name'].split("-", 2)
        course_id = temp[0] + temp[1].rstrip()
        course_title = temp[2].lstrip()
        
        temp = row['section_id'].split(" (")
        class_no = temp[1][:-1]
        term = "Spring 2020"

        days_times = row['daystimes'].split(": ")[1]
        dates = row['dates'].split(": ")[1]
        session = row['session'].split(": ")[1]
        status = row['status'].split(": ")[1]

        instructors = row['instructor'].split(", ")

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
                'professor': instructor
            }

            curr_teach = {
                'courseID': course_id,
                'courseTitle': course_title,
                'professor': instructor
            }

            if curr_teach not in teaches:
                teaches.append(curr_teach)

            if curr_sec not in sections:
                sections.append(curr_sec)


# db['sections'].insert_many(sections)
# db['courses'].insert_many(courses)
# db['teaches'].insert_many(teaches)
# db['professors'].insert_many(professors)
