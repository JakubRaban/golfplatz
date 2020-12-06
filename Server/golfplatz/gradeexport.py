import calendar
import csv
from datetime import datetime


def export_grades(chapters, score_dicts, username_header='username'):
    timestamp_now = calendar.timegm(datetime.now().timetuple())
    with open(filename := f'media/grade-export-{timestamp_now}.csv', mode='w', encoding='utf-8') as csv_file:
        headers = [username_header] + list(chapters)
        writer = csv.DictWriter(csv_file, fieldnames=headers)
        writer.writeheader()
        writer.writerows(score_dicts)
    return filename
