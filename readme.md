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