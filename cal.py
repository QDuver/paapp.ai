import json
from google.oauth2 import service_account
from googleapiclient.discovery import build

SERVICE_ACCOUNT_FILE = 'life-automation-sa.json'  # Update this path
SCOPES = ['https://www.googleapis.com/auth/calendar']

credentials = service_account.Credentials.from_service_account_file( SERVICE_ACCOUNT_FILE, scopes=SCOPES)
service = build('calendar', 'v3', credentials=credentials)

calendar_id = '0640a389150348a30fd2035adc8e374e2f052e7439edcc2d5b04f8aeb62e2081@group.calendar.google.com'  # Use 'primary' or the ID of a specific calendar
processed_events = []

def create_event(meal, date, description = None):
    data = {
        'summary': meal,
        'start': {
            'dateTime': date
        },
        'end': {
            'dateTime': date
        }
    }
    if description:
        data['description'] = description
    processed_events.append(data)

def add_events(events):

    for event  in events:
        event = service.events().insert(calendarId=calendar_id, body=event).execute()
        print('Event created: %s' % (event.get('htmlLink')))

# read from test.json
with open('test.json', 'r') as file:
    events = json.load(file)

meal_plan = events['meal_plan']
first_day = list(meal_plan[0].keys())[0]
create_event('ingredient list', first_day+'T12:00:00-00:00', events['ingredients'])

print(first_day)
for meal in meal_plan:
    day = list(meal.keys())[0] 
    create_event(meal[day]['lunch'], day+'T12:00:00-00:00')
    create_event(meal[day]['dinner'], day+'T18:00:00-00:00')

print(processed_events)
add_events(processed_events)