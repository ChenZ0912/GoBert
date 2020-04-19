from selenium import webdriver
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from selenium.webdriver.common.by import By
from selenium.common.exceptions import TimeoutException, NoSuchElementException
import csv

def wait_for_load_screen(driver):
    try:
        print("wait")
        # then wait for the element to disappear
        WebDriverWait(driver, 60).until(
            EC.invisibility_of_element_located((By.CLASS_NAME, "loading-overlay")))

    except TimeoutException:
        # if timeout exception was raised - it may be safe to
        # assume loading has finished, however this may not
        # always be the case, use with caution, otherwise handle
        # appropriately.
        print("Reloading screen is being an asshole")


f = open("course_num_fall_2020.csv", "w")
fieldnames = ['course_id', 'course_name', 'section', 'topic', 'session', 'days/times', 'dates', 'instructor', 'status', 'wait list total']
writer = csv.DictWriter(f, fieldnames=fieldnames, quotechar='¥', delimiter=',', quoting=csv.QUOTE_ALL, skipinitialspace=True)
writer.writeheader()

term_urls = ['1208', '1204', '1202', '1198', '1196', '1194', '1192', '1188', '1186', '1184', '1182', '1178']
school_count = [32, 20, 35, 31, 34, 19, 35, 31, 35, 15, 36]

driver = webdriver.Chrome()
driver.get("https://m.albert.nyu.edu/app/catalog/classSearch/1208")
delay = 5 # seconds
reload_delay = 20

try:
    for i in range(1, 34):
        driver.refresh()
        myElem = WebDriverWait(driver, delay).until(
            EC.presence_of_element_located((By.CSS_SELECTOR, '#filter-enrl-stat')))
        tick = driver.find_element_by_css_selector('#filter-enrl-stat')
        driver.execute_script("arguments[0].click();", tick)

        myElem = WebDriverWait(driver, delay).until(
            EC.presence_of_element_located((By.CSS_SELECTOR, 'div.btn-group > .dropdown-toggle')))
        drop_downs = driver.find_elements_by_css_selector('div.btn-group > .dropdown-toggle')
        term_sel = drop_downs[0]
        school_sel = drop_downs[1]
        sub_sel = drop_downs[2]
        driver.execute_script("arguments[0].click();", school_sel)
        # click to drop down all schools
        myElem = WebDriverWait(driver, delay).until(
                    EC.presence_of_element_located((By.CSS_SELECTOR, 'div.bs-container > div.dropdown-menu > ul > li > a')))
        school_drop_down = driver.find_elements_by_css_selector('div.bs-container > div.dropdown-menu > ul > li > a')
        # get all the selection buttons
        driver.execute_script("arguments[0].click();", school_drop_down[i])
        # click each selection button
            # print("open sub first time")
        driver.execute_script("arguments[0].click();", sub_sel)
        # click to open the subject drop down
         myElem = WebDriverWait(driver, delay).until(
                            EC.presence_of_element_located((By.CSS_SELECTOR, 'div.bs-container > div.dropdown-menu > ul > li > a')))
        sub_drop_down = driver.find_elements_by_css_selector('div.bs-container > div.dropdown-menu > ul > li > a')
        # click to get the length of all subjects
            # print("close sub first time")
        driver.execute_script("arguments[0].click();", sub_drop_down[0])
        # click to close the drop down to setup looping
        over_lay_count = 0
        over_lay_max = 100
        if len(sub_drop_down) == 0:
          continue
        for j in range(1, len(sub_drop_down)):
            if over_lay_count >= over_lay_max:
                driver.refresh()
                myElem = WebDriverWait(driver, delay).until(
                    EC.presence_of_element_located((By.CSS_SELECTOR, 'div.btn-group > .dropdown-toggle')))
                drop_downs = driver.find_elements_by_css_selector('div.btn-group > .dropdown-toggle')
                sub_sel = drop_downs[2]
                print("open sub {time} time".format(time=j))
            driver.execute_script("arguments[0].click();", sub_sel)
            # drop down subjects
            sub_drop_down = driver.find_elements_by_css_selector('div.bs-container > div.dropdown-menu > ul > li > a')
            # find all drop downs
                # print("click sub {time} time".format(time=j))
            driver.execute_script("arguments[0].click();", sub_drop_down[j])
            search_btn = driver.find_element_by_id('buttonSearch')
            driver.execute_script("arguments[0].click();", search_btn)

            try:
                myElem = WebDriverWait(driver, reload_delay).until(
                    EC.presence_of_element_located((By.CSS_SELECTOR, '#search-results > div.secondary-head')))
            except TimeoutException:
                continue
            try:
                courses = driver.find_elements_by_css_selector('#search-results > div.secondary-head')
            except NoSuchElementException:
                continue
            print("Looking for courses")
            for t in range(0, len(courses)):
                course = courses[t]
                course_id = course.get_attribute('id')
                course_name = course.text
                if course_name == "":
                    continue
                print("Course name is: " + course_name)
                myElem = WebDriverWait(driver, reload_delay).until(
                    EC.presence_of_element_located((By.CSS_SELECTOR, 'div[data-classid=\'{}\'] > div.section-body'.format(course_id))))
                sections = driver.find_elements_by_css_selector('div[data-classid=\'{}\'] > div.section-body'.format(course_id))
                for m in range(0, len(sections)):
                    section = sections[m]
                    if section.text == "":
                        continue
                    section_class = section.get_attribute('class')
                    if 'strong' in section_class:
                        section_info = {}
                        section_info['course_id'] = course_id
                        section_info['course_name'] = course_name
                        section_info['section'] = sections[m].text.split(': ')[1]

                        t = m + 1
                        while t < len(sections) and 'strong' not in sections[t].get_attribute('class'):
                            key_value = sections[t].text.split(': ')
                            t += 1
                            if len(key_value) == 1:
                                continue
                            section_info[key_value[0].lower()] = key_value[1]
                        m = t
                        print(section_info)
                        writer.writerow(section_info)
                    wait_for_load_screen(driver)
                over_lay_count += 1
            # click each subject
except TimeoutException:
    print("Loading took too much time!")

f.close()
