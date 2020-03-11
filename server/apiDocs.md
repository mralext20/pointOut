# Api Docs (/api/)

## /points

### [GET] /

returns all points.

#### example get all responce

```json
[
    {
        "description": "a chain supermarket",
        "_id": "5e6815ecf769aa7f4895ea6b",
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

#### example radius request

`points?type=radius&longitude=-116.2742493&latitude=43.5920892&radius=1`
|           radius           |      latitude      |      longitude       |
|:--------------------------:|:------------------:|:--------------------:|
| distance in miles to query | latitude of origin |  longitude of origin |

example return matches above get all.

### [GET] /?type=region

uses query params to request points within a region.

#### example region request

`points?type=region&x1=-116.3798011&y1=43.6364671&x2=-116&y2=43`
|      x1                       |              y1       | x2 | y2|
|:--------------------------:|:------------------:|:--------------------:|:--------------------:|
| longitude of corner number 1 | latitude of corner number 1 | longitude of corner number 2 | latitude of corner number 2  |

### [POST] /

creates a new point. requires bearrer token auth.

#### example post request

```json
{
  "title":"Lowes",
  "description": "a chain home improvement store",
  "location": {
    "coordinates":[
      -116.2820787,
      43.59224606
    ]
    }
}
```

#### described post request

```json
{
  "title":"Title of new point",
  "description": "Description of new point",
  "location": {
    "coordinates": [
      Longitude of new point,
      Latitude of new point
    ]
    }

}
```

#### responce

a single object from the get all representing the newly created object.

### [PUT] /:id

Like [post], but you specific changed feilds. returns the entire new object.

### [DELETE] /:id

deleted a point. requires that you own the point.
