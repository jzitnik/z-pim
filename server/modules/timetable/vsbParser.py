from BeautifulSoup import BeautifulSoup
import urllib
import httplib
import re

def getLessons(number):
	remote = urllib.urlopen("http://rozvrh.vsb.cz/Reporting/Individual?idtype=id&objectclass=Module&weeks=1-15&template=Predmety&identifier=%s" % number)
	
	html = BeautifulSoup(remote.read())
	remote.close()

	table = html.find("table", {
		"class": "grid-border-args"
	})
	
	name = html.findAll(attrs={
		"class": "header-0-1-3"
	})
	
	name = name[0].contents[0]
	
	lessons = []
	
	hours = [
		("7:15", "8:00"),
		("8:00", "8:45"),
		("9:00", "9:45"),
		("9:45", "10:30"),
		("10:45", "11:30"),
		("11:30", "12:15"),
		("12:30", "13:15"),
		("13:15", "14:00"),
		("14:15", "15:00"),
		("15:00", "15:45"),
		("16:00", "16:45"),
		("16:45", "17:30"),
		("17:45", "18:30"),
		("18:30", "19:15")
	]
	
	count = 0
	day = -1
	for tr in table.findAll("tr", recursive=False):
		hour = 0
		for td in tr.findAll("td", recursive=False):
			if td.get("class") == "row-label-one":
				day += 1
				continue
			
			if td.get("class") == "object-cell-border":
				length = td.get("colspan")
				if not length:
					length = 1
				
				lessonId = td.td.contents[0]
				lessonType = lessonId[0:1]
				
				lessons.append({
					"length": int(length),
					"hour": hour,
					"type": lessonType,
					"id": lessonId,
					"startAt": hours[hour][0],
					"endAt": hours[hour+int(length)-1][1],
					"day": day,
					"name": name
				})
				
			hour += 1
			
	return lessons


def getLessonsList(search):
	
	params = urllib.urlencode({'value': search})
	headers = {"Content-type": "application/x-www-form-urlencoded", "Accept": "text/plain"}
	conn = httplib.HTTPConnection("rozvrh.vsb.cz")
	conn.request("POST", "/kombinator/acscript/script.php?objtype=module&limit=100", params, headers)
	response = conn.getresponse()
	data = response.read()
	conn.close()
	
	html = BeautifulSoup(data)
	
	lessons = []
	
	regexp = re.compile("\((K*[0-9]*)\)")
	
	for element in html.findAll("li"):
		if len(element.contents) < 1:
			continue
		
		number = regexp.findall(element.contents[0])
		
		if len(number) > 0:
			number = number[0]
		else:
			number = None

		lessons.append({
			"name": element.contents[0],
			"id": number
		})
	
	return lessons
