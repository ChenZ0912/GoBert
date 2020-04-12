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
# course_id,course_name,section,topic,session,daystimes,dates,instructor,status
def getData(filename):

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

getData("course_num_fall.csv")
getData("course_num_spring.csv")


# db['sections'].drop()
# db['courses'].drop()
# db['teaches'].drop()
db['professors'].drop()
# db['sections'].insert_many(sections)
# db['courses'].insert_many(courses)
# db['teaches'].insert_many(teaches)
# db['professors'].insert_many(professors)
