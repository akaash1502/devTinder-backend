# API LIST FOR DEVTINDER

POST /signup
POST /login
POST /login


GET /profile/view
PATCH /profile/edit
PATCH /profile/password

POST /request/send/:userID
POST /request/ignore/:userID

POST /request/review/accepted/:requestID
POST /request/review/rejected/:requestID

GET /connections
GET /requects/received 
GET /feed (fetches 30 profile at once, like Tinder)


Status : Ignore, Interested, accepted, rejected