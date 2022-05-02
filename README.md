# fuel-notifier

Config file (in git ignore) contains the config for the application. This file looks like:

```JSON
{
  "ACCOUNT_SID": "Twillio Account SID",
  "AUTH_TOKEN": "Twilio Auth Token",
  "LOCATIONS": [
    { "lat": "Lat (number)", "lng": "lng (number)", "numbers": [ "Phone numbers to send to" ], "fuelType": "number based on the API"}
  ]
}
```
