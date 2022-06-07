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

**Description:** Returns a JSON collection of animal categories for adoption at Caltech.

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
    "description":"Hummer loves flying around and drinking nectar from flowers. 
      He's very speedy, especially with a lot of sugar!\r","image":"hummer.jpg\r",
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

**Supported Parameters** 
* /:type (required)
  * Type of animals to get information about.

**Example Request:** `animals/turtle`

**Example Response:**

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
* 400 Error: `type` does not exist in the database.

## *GET /one-animal/:type/:name*
**Request Type:** *GET*

**Returned Data Format**: JSON

**Description:** Returns a JSON collection of information about the animal described by type and name.

**Supported Parameters** 
* /:type (required)
  * Type of animal to get information about.
* /:name (required)
  * Name of the specific animal to get information about.

**Example Request:** `one-animal/bird/hummer`

**Example Response:**
```json
{
  "name":"Hummer\r",
  "type":"bird\r",
  "age":"1 year\r",
  "gender":"Female\r",
  "cost":"120\r",
  "description":"Hummer loves flying around and drinking nectar from flowers. 
    He's very speedy, especially with a lot of sugar!\r",
  "image":"hummer.jpg\r",
  "available":"yes"
}
```
**Error Handling:**
* 500 Error: Something went wrong on the server, please try again later.
* 400 Error: `type` does not exist in the database.
* 400 Error: `type` with name `name` does not exist in the database.


## *GET /images*
**Request Type:** *GET*

**Returned Data Format**: JSON

**Description:** Returns a JSON array of all images file paths saved as stock images 
and updates the public stock images folder so the client has access to all images 
that exist in the server.

**Supported Parameters** None

**Example Request:** `images`

**Example Response:**
```json
["stock-img/bob.jpg","stock-img/bread.jpg","stock-img/climber.jpg",
"stock-img/fence.jpg","stock-img/happy.jpg","stock-img/hummer.jpg",
"stock-img/meches.jpg","stock-img/pearl.jpg","stock-img/poppy.jpg",
"stock-img/ripple.jpg","stock-img/sleepy.jpg","stock-img/sneaky.jpg",
"stock-img/tiny.jpg","stock-img/tomato.jpg","stock-img/walnut.jpg"]
```
**Error Handling:**
* 500 Error: Something went wrong on the server, please try again later.

## *POST /feedback*
**Returned Data Format**: Plain Text

**Description:** 
Sends a user's name, email, and feedback message to the Caltech Adoption web service for a "feedback" endpoint. 
Returns a success response or an error.

**Supported Parameters**
* POST body parameters: 
  * `name` (required) - name of customer
  * `email` (required) - email of customer
  * `feedback` (required) - customer feedback message

**Example Request:** `/feedback`
* POST body parameters: 
  * `name='John'`
  * `email='john@example.edu'`
  * `message='Successful adoption!'`


**Example Response:**
```Successfully submitted feedback.```

**Error Handling:**
* 400 Error: One or more required POST parameters for /feedback are missing: name, email, feedback.
* 500 Error: Something went wrong on the server, please try again later.

## *POST /buy*
**Returned Data Format**: Plain Text

**Description:** 
Sends information about an animal being adopted/purchased to the Caltech Adoption web service. Returns an error if unsuccessful.

**Supported Parameters**
* POST body parameters: 
  * `type` (required) - type of animal (bird, turtle, ect.)
  * `name` (required) - animal's name

**Example Request:** `/buy`
* POST body parameters: 
  * `type='dog'`
  * `name='Happy'`

**Example Response:**
```Adopted!```

**Error Handling:**
* 400 Error: One or more required POST parameters for /buy are missing: name, type.
* 400 Error: `name` is already adopted!
* 500 Error: Something went wrong on the server, please try again later.

## *POST /admin/add*
**Returned Data Format**: Plain Text

**Description:** 
Sends information about an animal being put up for adoption to the Caltech Adoption web service for a "upload" endpoint. Returns a success response or an error.

**Supported Parameters**
* POST body parameters: 
  * `type` (required) - type of animal (bird, turtle, ect.)
  * `name` (required) - animal's name
  * `age` (required) - animal's age
  * `gender` (required) - animal's gender
  * `cost` (required) - animal's cost of adoption (in dollars)
  * `description` (required) - description of animal's behavior and other useful information
  * `imageName` (required) - name of image of animal

**Example Request:** `/admin/add`
* POST body parameters: 
  * `type='dog'`
  * `name='Happy'`
  * `age='1 year'`
  * `gender='male'`
  * `cost='130'`
  * `description='Happy is a happy dog.'`
  * `imageName='happy.png'`

**Example Response:**
```Successfully submitted info.```

**Error Handling:**
* 400 Error: One or more required parameters for /admin/add endpoint are missing: type, name, age, gender, cost, description, imagePath, available
* 400 Error: `type` with `name` already exists. Please choose another name.
* 500 Error: Something went wrong on the server, please try again later.

## *POST /stock-img/upload*
**Returned Data Format**: Plain Text

**Description:** 
Sends an image file (.png or .jpg) to the Caltech Adoption web service for a "upload" endpoint.Returns a success response or an error.

**Supported Parameters**
* POST body parameters: 
  * `image` (required) - image file (.png or .jpg)

**Example Request:** `/stock-img/upload`
* POST body parameters: 
  * `image=File Object`

**Example Response:**
```Successfully uploaded image.```

**Error Handling:**
* 400 Error: Please submit a .png or .jpg file.
* 500 Error: Something went wrong on the server, please try again later.

## *POST /admin/login*
**Returned Data Format**: Plain Text

**Description:** 
Sends a username and password to the Caltech Adoption web service for a "Login" endpoint. Returns a response about whether the information matched a user's username and password.

**Supported Parameters**
* POST body parameters: 
  * `username` (required) - user's username 
  * `password` (required) - password of user

**Example Request:** `/admin/login`
* POST body parameters: 
  * `username='adminUser'`
  * `password='password1234!'`

**Example Response:**
```Username not found.```

**Error Handling:**
* 400 Error: One or more required parameters for /admin/add endpoint are missing: username, password.
* 500 Error: Something went wrong on the server, please try again later.