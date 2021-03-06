# Api Docs (/api/)

## /points

### [GET] /

returns all points.

#### Example Response

```json
[
    {
        "description": "a chain supermarket",
        "_id": "5e6815ecf769aa7f4895ea6b",
        "public": true,
        "title": "walmart near codeworks",
        "location": {
            "type": "Point",
            "coordinates": [
                -116.2848661,
                43.5929343
            ],
            "_id": "5e6815ecf769aa7f4895ea6c"
        },
        "creatorEmail": "...",
        "createdAt": "2020-03-10T22:34:20.122Z",
        "updatedAt": "2020-03-10T22:34:20.122Z",
        "__v": 0,
        "creator": {
            ...
        },
        "id": "5e6815ecf769aa7f4895ea6b"
    },
    {
        "description": "a chain home improvement store",
        "_id": "5e681697f769aa7f4895ea6d",
        "title": "Lowes",
        "public": true,
        "location": {
            "type": "Point",
            "coordinates": [
                -116.2820787,
                43.59224606
            ],
            "_id": "5e681697f769aa7f4895ea6e"
        },
        "creatorEmail": "...",
        "createdAt": "2020-03-10T22:37:11.028Z",
        "updatedAt": "2020-03-10T22:37:11.028Z",
        "__v": 0,
        "creator": {
           ...
        },
        "id": "5e681697f769aa7f4895ea6d"
    }
]
```

### [GET] /?type=radius

uses query params to request points within a radius of a point.

#### Example Request

`points?type=radius&longitude=-116.2742493&latitude=43.5920892&radius=1`
|           radius           |      latitude      |      longitude       |
|:--------------------------:|:------------------:|:--------------------:|
| distance in miles to query | latitude of origin |  longitude of origin |

example return matches above get all.

### [GET] /?type=region

uses query params to request points within a region.

#### Example Request

`points?type=region&x1=-116.3798011&y1=43.6364671&x2=-116&y2=43`
|      x1                       |              y1       | x2 | y2|
|:--------------------------:|:------------------:|:--------------------:|:--------------------:|
| longitude of corner number 1 | latitude of corner number 1 | longitude of corner number 2 | latitude of corner number 2  |

### [GET] /:id

returns a point by ID.

example response:

```json
{
    "description": "a chain supermarket",
    "_id": "5e6815ecf769aa7f4895ea6b",
    "public": true,
    "title": "walmart near codeworks",
    "location": {
        "type": "Point",
        "coordinates": [
            -116.2848661,
            43.5929343
        ],
        "_id": "5e6815ecf769aa7f4895ea6c"
    },
    "creatorEmail": "...",
    "createdAt": "2020-03-10T22:34:20.122Z",
    "updatedAt": "2020-03-10T22:34:20.122Z",
    "__v": 0,
    "id": "5e6815ecf769aa7f4895ea6b"
}
```

### [GET] /:id/visits

returns a object containing the count of times that point has been visited.

example response:

```json
{
    "visits": 1
}
```

### [GET] /:id/votes

returns a object containing the average Votes and count of votes.

example response:

```json
{
    "vote": 4.5,
    "voteCount": 3
}
```

### [POST] /

creates a new point. requires bearrer token auth.

#### Example Request

```json
{
  "title":"Lowes",
  "description": "a chain home improvement store",
  "location": {
    "coordinates":[
      -116.2820787,
      43.59224606
    ]
    },
    "public" : true,
    "groupId": "abc123",
    // optional
    "imageData" : "data:image/png;base64,b64 encoded string of image data",
    // OR
    "image": "https://link.to/image.png"
}
```

#### Described Request

```json
{
  "title":"Title of new point",
  "description": "Description of new point",
  "location": {
    "coordinates": [
      "Longitude",
      "Latitude"
    ]
    },
    "public": "public_or_private_Point",
    "groupId": "abc123"
}
```

#### Response

a single object from the get all representing the newly created object.

### [PUT] /:id

Like [post], but you specific changed feilds. returns the entire new object.

### [DELETE] /:id

deleted a point. requires that you own the point.

## /visits

### [GET] /

requires Auth.
returns where you have visited.

example response:

```json
[
    {
        "_id": "5e691a789150f03b12931160",
        "pointId": "5e6815ecf769aa7f4895ea6b",
        "creatorEmail": "...",
        "createdAt": "2020-03-11T17:06:00.280Z",
        "updatedAt": "2020-03-11T17:06:00.280Z",
        "__v": 0,
        "id": "5e691a789150f03b12931160"
    },
    {
        "_id": "5e691a9e9150f03b12931162",
        "pointId": "5e685f33449526bac1eb0dc4",
        "creatorEmail": "...",
        "createdAt": "2020-03-11T17:06:38.848Z",
        "updatedAt": "2020-03-11T17:06:38.848Z",
        "__v": 0,
        "id": "5e691a9e9150f03b12931162"
    }
]
```

### [POST] /

create a visit.

#### Example Request Body

```json
{
    "pointId":"5e685f33449526bac1eb0dc4"
}
```

#### Example Response

```json
{
    "_id": "5e691c889150f03b12931163",
    "pointId": "5e685f01449526bac1eb0dc2",
    "creatorEmail": "...",
    "createdAt": "2020-03-11T17:14:48.977Z",
    "updatedAt": "2020-03-11T17:14:48.977Z",
    "__v": 0,
    "id": "5e691c889150f03b12931163"
}
```

### [DELETE] /:id

the id of the point that you want to unvisit.
requires auth.

## /favorites

### [GET] /

requires Auth.
returns the points you've favorited.

example response:

```json
[
    {
        "_id": "5e729890e5a68925e4e02727",
        "pointId": "5e685f33449526bac1eb0dc4",
        "creatorEmail": "...",
        "createdAt": "2020-03-18T21:54:24.668Z",
        "updatedAt": "2020-03-18T21:54:24.668Z",
        "__v": 0,
        "id": "5e729890e5a68925e4e02727"
    }
]
```

### [POST] /

create a favorite.

#### Example Request Body

```json
{
    "pointId": "5e685f33449526bac1eb0dc4"
}
```

#### Example Response

```json
{
    "_id": "5e729890e5a68925e4e02727",
    "pointId": "5e685f33449526bac1eb0dc4",
    "creatorEmail": "...",
    "createdAt": "2020-03-18T21:54:24.668Z",
    "updatedAt": "2020-03-18T21:54:24.668Z",
    "__v": 0,
    "id": "5e729890e5a68925e4e02727"
}
```

### [DELETE] /:id

the id of the point that you want to unfavorite.
requires auth.

## /votes

### [GET] /

requires Auth.
returns where you have voted.

example response:

```json
[
    {
        "_id": "5e69acd1242b20438facc539",
        "vote": 5,
        "pointId": "5e6815ecf769aa7f4895ea6b",
        "creatorEmail": "...",
        "createdAt": "2020-03-12T03:30:25.788Z",
        "updatedAt": "2020-03-12T03:30:25.788Z",
        "__v": 0,
        "id": "5e69acd1242b20438facc539"
    },
    {
        "_id": "5e69ac8b242b20438facc532",
        "vote": 5,
        "pointId": "5e685f33449526bac1eb0dc4",
        "creatorEmail": "...",
        "createdAt": "2020-03-12T03:29:15.626Z",
        "updatedAt": "2020-03-12T03:29:15.626Z",
        "__v": 0,
        "id": "5e69ac8b242b20438facc532"
    }
]
```

### [POST] /

create a new Vote.

requires your vote be between 1-5, inclusive.

example request:

```json
{
  "vote": 5,
  "pointId": "5e6815ecf769aa7f4895ea6b"
}
```

example response:

```json
{
    "_id": "5e69adc5242b20438facc53b",
    "vote": 5,
    "pointId": "5e691ff4185407a734bc42dc",
    "creatorEmail": "...",
    "createdAt": "2020-03-12T03:34:29.705Z",
    "updatedAt": "2020-03-12T03:34:29.705Z",
    "__v": 0,
    "id": "5e69adc5242b20438facc53b"
}
```

### [DELETE] /:id

delete your vote by place Id.

## /profile

### [GET] /points

return all your points, even private ones. matches return of [GET] /points/

### [GET] /groups

return all your groups, even private ones.

example response:

```json
[
    {
        "_id": "5e6a9d3fc111837bf43cb50d",
        "memberEmail": "...",
        "groupId": "5e6a7840620f1945767918ce",
        "createdAt": "2020-03-12T20:36:18.703Z",
        "updatedAt": "2020-03-12T20:36:18.703Z",
        "__v": 0,
        "group": {
            "public": true,
            "_id": "5e6a7840620f1945767918ce",
            "title": "secret group",
            "description": "a secret!",
            "creatorEmail": "...",
            "createdAt": "2020-03-12T17:58:24.998Z",
            "updatedAt": "2020-03-12T17:58:24.998Z",
            "__v": 0,
            "id": "5e6a7840620f1945767918ce"
        },
        "visits": 2,
        "voteCount": 1,
        "averageVote": 5,
        "id": "5e6a9d3fc111837bf43cb50d"
    },
    {
        "_id": "5e6aa3c94f6fbe85cfc11d38",
        "groupId": "5e6aa3c94f6fbe85cfc11d37",
        "memberEmail": "...",
        "createdAt": "2020-03-12T21:04:09.841Z",
        "updatedAt": "2020-03-12T21:04:09.841Z",
        "__v": 0,
        "group": {
            "public": false,
            "_id": "5e6aa3c94f6fbe85cfc11d37",
            "title": "rock climbing",
            "description": "a group for rock climbing",
            "creatorEmail": "...",
            "createdAt": "2020-03-12T21:04:09.775Z",
            "updatedAt": "2020-03-12T21:22:43.087Z",
            "__v": 0,
            "id": "5e6aa3c94f6fbe85cfc11d37"
        }, "visits": 2,
        "voteCount": 0,
        "averageVote": null
        "id": "5e6aa3c94f6fbe85cfc11d38"
    }
]
```

## /groups

### [GET] /

returns public groups

example response:

```json
[
    {
        "public": true,
        "_id": "5e6a7840620f1945767918ce",
        "title": "secret group",
        "description": "a secret!",
        "creatorEmail": "...",
        "createdAt": "2020-03-12T17:58:24.998Z",
        "updatedAt": "2020-03-12T17:58:24.998Z",
        "__v": 0,
        "creator": {
            "_id": "5e67f76e62207236c3ec2c26",
            "name": "Alexander Terry",
            "picture": "https://avatars0.githubusercontent.com/u/4016295?v=4",
            "email": "...",
            "id": "5e67f76e62207236c3ec2c26"
        },
        "id": "5e6a7840620f1945767918ce"
    }
]
```

### [GET] /:id

returns a group, must be public or you are in the group

example response:

```json
{
    "description": "a chain home improvement store",
    "public": true,
    "_id": "5e695fe057d14a212fc694dd",
    "title": "Lowes",
    "location": {
        "type": "Point",
        "coordinates": [
            -116.2820787,
            43.59224606
        ],
        "_id": "5e695fe057d14a212fc694de"
    },
    "creatorEmail": "...",
    "createdAt": "2020-03-11T22:02:08.879Z",
    "updatedAt": "2020-03-11T22:02:08.879Z",
    "__v": 0,
    "creator": {
        "_id": "5e67f76e62207236c3ec2c26",
        "name": "Alexander Terry",
        "picture": "https://avatars0.githubusercontent.com/u/4016295?v=4",
        "email": "...",
        "id": "5e67f76e62207236c3ec2c26"
    },
    "visits": 0,
    "voteCount": 0,
    "averageVote": null,
    "id": "5e695fe057d14a212fc694dd"
}
```

### [GET] /:id/points

returns a groups points, group must be public or you are in the group

example response:

```json
[
    {
        "description": "a secret!",
        "public": false,
        "_id": "5e6a5566fbb255174298400a",
        "title": "secret place",
        "location": {
            "type": "Point",
            "coordinates": [
                -1.177857,
                -8.180695
            ],
            "_id": "5e6a5566fbb255174298400b"
        },
        "creatorEmail": "...",
        "createdAt": "2020-03-12T15:29:42.936Z",
        "updatedAt": "2020-03-12T21:02:17.194Z",
        "__v": 0,
        "groupId": "5e6a7840620f1945767918ce",
        "creator": {
            "_id": "5e67f76e62207236c3ec2c26",
            "name": "Alexander Terry",
            "picture": "https://avatars0.githubusercontent.com/u/4016295?v=4",
            "email": "...",
            "id": "5e67f76e62207236c3ec2c26"
        },
        "visits": 0,
        "voteCount": 0,
        "averageVote": null,
        "id": "5e6a5566fbb255174298400a"
    }
]
```

### [POST] /

example request:

```json
{
    "title": "rock climbing",
    "description": "a group for rock climbing",
    "public": true
}
```

example response

```json
{
    "public": true,
    "_id": "5e6aa3c94f6fbe85cfc11d37",
    "title": "rock climbing",
    "description": "a group for rock climbing",
    "creatorEmail": "...",
    "createdAt": "2020-03-12T21:04:09.775Z",
    "updatedAt": "2020-03-12T21:04:09.775Z",
    "__v": 0,
    "id": "5e6aa3c94f6fbe85cfc11d37"
}
```

### [PUT] /:id

edit a group. you must be the creator of a group to edit it.

### [DELETE] /:id

Delete a group. requires that you own the group.

### [GET] /:id/members

returns list of members. only works if the group is public or you are in the group.

```json
[
    {
        "_id": "5e6aa3c94f6fbe85cfc11d38",
        "groupId": "5e6aa3c94f6fbe85cfc11d37",
        "memberEmail": "...",
        "createdAt": "2020-03-12T21:04:09.841Z",
        "updatedAt": "2020-03-12T21:04:09.841Z",
        "__v": 0,
        "id": "5e6aa3c94f6fbe85cfc11d38"
    }
]
```

### [POST] /:id/members

add a member to a group. works if you are the owner, or the group is public and you are adding yourself.

request body

```json
{
    "memberEmail": "..."
}
```

example return

```json

{
    "_id": "5e6aa5573c8fdf892142edcf",
    "memberEmail": "...",
    "groupId": "5e6aa3c94f6fbe85cfc11d37",
    "createdAt": "2020-03-12T21:10:47.241Z",
    "updatedAt": "2020-03-12T21:10:47.241Z",
    "__v": 0,
    "id": "5e6aa5573c8fdf892142edcf"
}
```

### [DELETE] /:id/members/:email

removes a member from a group by their email. requires the user be you, or you own the group
