Address Book
============================
> Simple RESTful API to create, read, update and delete contacts.

## Top-level Directory Layout

    .
    ├── routes                  # Routes folder
    ├── test                    # Test folder
    ├── validation              # Input validation folder
    ├── server.js               # Main source file
    ├── .env                    # Environment variables              
    ├── .gitignore
    └── readme.md

## Running the App Locally
- Ensure you have [nodejs], [java] and [elasticsearch] installed
- Get the source by running `git clone https://github.com/iliyaML/addressbook.git` then `cd addressbook`
- Run `npm install` to do first time installation of all dependencies
- Run `npm run dev` to start the dev server
- Open `http://localhost:5000` in [Postman] to try it out
- Edit .env file to configure HTTP_PORT or ES_HOST

## Endpoints

### Get All Contacts
``` bash
GET /contact
```
### Get Single Contact
``` bash
GET /contact/{name}
```

### Delete Contact
``` bash
DELETE /contact/{name}
```

### Create Contact
``` bash
POST /contact/

# Request sample
# {
#   "name": "Iliya",
#   "fullname": "Iliya Mohamad Lokman"
#   "email": "iliya@gmail.com",
#   "phone": 999
#   "address": "Nashville, TN" 
# }
```

### Update Contact
``` bash
PUT /contact/{name}

# Request sample
# {
#   "email": "iliyaml@gmail.com",
#   "phone": 889
#   "address": "Washington DC, VA" 
# }

```

[nodejs]: https://nodejs.org/en/
[java]: http://www.oracle.com/technetwork/java/javase/downloads/jdk8-downloads-2133151.html
[elasticsearch]: https://www.elastic.co/downloads/elasticsearch
[Postman]: https://www.getpostman.com/