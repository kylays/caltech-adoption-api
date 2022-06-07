# Caltech Adoption API Documentation
**Authors: Clara Wang, Kyla Yu-Swanson**
**Last Updated: 06/06/2022**
Catalogs animals found at Caltech that can be adopted with their name, age, 
gender, price (dollars), description, image, and availability (yes/no). Also 
holds usernames and passwords for admin users and feedback that was submitted 
to the API.

Summary of endpoints:
* GET /categories
* GET /all-animals
* GET /animals/:type
* GET /one-animal/:type/:name
* GET /images
* POST /feedback
* POST /buy
* POST /admin/add
* POST /stock-img/upload
* POST /admin/login

## *GET /categories*
**Request Type:** GET

**Returned Data Format**: JSON 

**Description:** Returns a JSON collection of available animal categories for adoption at Caltech.

**Supported Parameters** None

**Example Request:** `categories`

**Example Response:**
```json
["bird","squirrel","turtle"]
```

**Error Handling:**
* 500 Error: Something went wrong on the server, please try again later.

## *GET /all-animals*
**Request Type:** GET

**Returned Data Format**: JSON

**Description:** Returns a JSON collection of every animal and the information about it.

**Supported Parameters** None

**Example Request:** `all-animals`

**Example Response:**
```json
[
  {
    "name":"Happy\r",
    "type":"bird\r",
    "age":"5 months\r",
    "gender":"Female\r",  
    "cost":"40\r",
    "description":"Happy is a small bird who likes to dance, sort of like the 
      penguins in Happy Feet. Happy is very friendly and will do well with kids. 
      Happy is pictured dancing in a tree.\r",
    "image":"happy.jpg\r",
    "available":"yes"
  },
  {
    "name":"Hummer\r",
    "type":"bird\r",
    "age":"1 year\r",
    "gender":"Female\r",
    "cost":"120\r",
    "description":"Hummer loves flying around and drinking nectar from flowers. He's very speedy, especially with a lot of sugar!\r","image":"hummer.jpg\r",
    "available":"yes"
  }
]
```

**Error Handling:**
* 500 Error: Something went wrong on the server, please try again later.

## *GET /animals/:type*
**Request Type:** *GET*

**Returned Data Format**: JSON

**Description:** Returns a JSON collection of information about all animals of the specified type.

**Supported Parameters** *List any optional/required parameters*

**Example Request:** *Fill in example request(s)*

**Example Response:**
*Fill in example response in the ticks*

```json
[
  {
    "name":"Bob\r",
    "type":"turtle\r",
    "age":"2 years\r",
    "gender":"Male\r",
    "cost":"50\r",
    "description":"Bob is a turtle who likes to swim ... up to say hello!\r",
    "image":"bob.jpg\r",
    "available":"yes"
  },
  {
    "name":"Tomato\r",
    "type":"turtle\r",
    "age":"5 years\r",
    "gender":"Male\r",
    "cost":"60\r",
    "description":"Tomato is a turtle really ... are fruits or vegetables.\r",
    "image":"tomato.jpg\r",
    "available":"yes"
  }
]
```

**Error Handling:**
* 500 Error: Something went wrong on the server, please try again later.



## *Fill in Endpoint 3 Title (POST Example)*
**Request Format:** *Fill in example request format*

**Returned Data Format**: JSON

**Description:** *Fill in description*

**Supported Parameters** *List any optional/required parameters*
* POST body parameters:
    * param1 - (optional/required) param1 description
    * ...


**Example Request:** *Fill in example request(s)*

**Example Response:**
*Replace the {} with the example response*

```json
{

}
```

**Error Handling:**
*Summarize any possible errors a client should know about*
*Fill in at least one example request/response of the error handling*

















## *POST /admin/login*
**Returned Data Format**: Plain Text

**Description:** 
Sends a username and password to the Caltech Adoption web service for a "Login" endpoint. Returns a response about whether the information matched a user's username and password.

**Supported Parameters**
* POST body parameters: 
  * `username` (required) - user's username 
  * `password` (required) - password of user

**Example Request:** `/contact`
* POST body parameters: 
  * `username='adminUser'`
  * `password='password1234!'`

**Example Response:**
```Username not found.```

**Error Handling:**
* 400: One or more required parameters for /admin/add endpoint are missing: username, password.
* 500 Error: Something went wrong on the server, please try again later.
