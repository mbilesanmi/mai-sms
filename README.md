# SMS API
SMS management API

* Access the hosted application on Heroku using this [link](https://mai-sms.herokuapp.com/).
* SMS API Route documentation can be found [here](maisms.docs.apiary.io)

### Features
---

* Users can create a contact.
* Users can get a contact.
* Users can get all contacts.
* Users can edit a contact.
* Users can delete a contact.
* Users can send sms.
* Users can delete an sms they send.
* Users can get all of their sms.

**Authorization**:
No authorization required

### Endpoints
---

Access the hosted application on Heroku using this [link](https://mai-sms.herokuapp.com/). 

Below are the collection of routes.


#### Contact

EndPoint                    |   Functionality       |    Request body/params
----------------------------|-----------------------|-------------------------------------------------
POST /contacts              | Create a contact      | body [name, phoneNumber]
GET /contacts/:contactId    | Gets a single contact | params [contactId]    
PUT /contacts/:contactId    | Updates a contact     | params [contactId], body [*name, *phoneNumber]
DELETE /contacts/:contactId | Deletes a contact     | params [contactId]
GET /contacts               | Gets all contacts     |  

#### Sms

EndPoint                            |   Functionality    |    Request body/params
------------------------------------|--------------------|--------------------------------------------
POST /sms/:senderId/:receiverId     | Create sms         | body [content]
GET /sms/:userId                    | Gets all sms       |
DELETE /sms/:contactId/:messageId   | Deletes sms        | 


### Technologies Used
---

- Node.js
- Express
- Sequelize


### Installation
---

- Clone the project repository.
- Run the command below to clone:
> git clone https://github.com/mbilesanmi/mai-sms.git.
- Change directory into the mai-sms directory.
- Install all necessary packages in the package.json file. Depending on if you are using `npm`, you can use the command below:
> yarn install
- Create a postgresql database and fill its details into your env like in the .env.sample file.
- Run sequelize migrate command below:
> sequelize db:migrate
- Run the command below to start the application locally:
> yarn start:dev
- Test the routes above on POSTMAN or any other application of choice


#### Contributing
---

1. Fork this repository to your account.
2. Clone your repository: git clone https://github.com/mbilesanmi/mai-sms.git.
4. Commit your changes: git commit -m "did something".
5. Push to the remote branch: git push origin new-feature.
6. Open a pull request.

#### Licence
---

ISC

Copyright (c) 2018 Maranatha A Ilesanmi
