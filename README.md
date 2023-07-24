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

## Build

To build the project, just run:

```bash
npm run build
```

## Run

To start up the project, just run:

```bash
docker-compose up --build
```

## Test

Using Jest for unit test:

```bash
npm test
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
  "ip": "101.112.0.23",
    "name": "Australia",
    "code": "AU",
    "lat": -33.8715,
    "lon": 151.2006,
    "currencies": [
    {
      "iso": "AUD",
      "symbol": "$",
      "conversionRate": 0.6092185736121848
    },
    {
      "iso": "USD",
      "symbol": "$",
      "conversionRate": 1
    }
  ],
    "distanceToUSA": 15989.61
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
      "value": 15989.61
  },
  "mostTraced": {
    "country": "Brazil",
      "value": 6
  }
}
```


## Performance using Redis

Hitting Traces' endpoint using a new IP address

```bash
cookunity-geo-geo-app-1  | POST /api/distance/traces 200 228 - 1072.568 ms
```

Called Traces using the same IP (more than once):

```bash
cookunity-geo-geo-app-1  | POST /api/distance/traces 200 228 - 652.366 ms
cookunity-geo-geo-app-1  | POST /api/distance/traces 200 228 - 650.216 ms
```

## Contributing

Pull requests are welcome. For major changes, please open an issue first
to discuss what you would like to change.

Please make sure to update tests as appropriate.

## License

[MIT](https://choosealicense.com/licenses/mit/)
