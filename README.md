# cookunity-geo

Cookunity-Geo is an API for tracking and statistics, built and designed with:

- Typescript
- Express.js
- Node.js v18
- Redis
- Docker

## Installation

Use the package manager [npm](https://www.npmjs.com/) to install the API.

```bash
cd cookunity-geo
npm install
```
## Requirements

- Docker
- Typescript

## Considerations

To calculate the distance from an IP address to a point in the USA, the Haversine formula was implemented, which provides distances between two points on a sphere based on their longitudes and latitudes. In this case, the Earth's radius in kilometers is taken as a reference.

```javascript
const EARTH_RADIUS_KM: number = 6371;
```

The point of reference in USA to trace the distance is NY:
#### The New York City Hall
```javascript
const NY_LAT: number = 40.7128;
const NY_LON: number = -74.006;
```

## Run

Use the package manager [npm](https://www.npmjs.com/) to install the API.

```bash
cd cookunity-geo
npm install
```

## Usage

### Traces

- Request
```bash
POST http://localhost:8000/api/distance/traces
{
  "ip": "1.178.32.5"
}
```
- Responses
#### HTTP 200
```javascript
{
    "ip": "1.178.32.5",
    "name": "Brazil",
    "code": "BR",
    "lat": -23.5505,
    "lon": -46.6333,
    "currencies": [
        {
            "iso": "ARS",
            "symbol": "$",
            "conversionRate": 0.023
        },
        {
            "iso": "JPY",
            "symbol": "$",
            "conversionRate": 107.346001
        },
        {
            "iso": "EUR",
            "symbol": "$",
            "conversionRate": 0.813399
        }
    ],
    "distanceToUSA": 7685.63
}
```
#### HTTP 400
```javascript
{
    "success": false,
    "message": "Not valid IP"
}
```

### Statistics

- Request
```bash
GET http://localhost:8000/api/distance/statistics
```
- Responses
#### HTTP 200
```javascript
{
    "longestDistance": {
        "country": "Australia",
        "value": 15500.36
    },
    "mostTraced": {
        "country": "Brazil",
        "value": 2
    }
}
```
## Contributing

Pull requests are welcome. For major changes, please open an issue first
to discuss what you would like to change.

Please make sure to update tests as appropriate.

## License

[MIT](https://choosealicense.com/licenses/mit/)
