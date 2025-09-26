# Speed.AI - Ranking (front)

This project is the Front-end for a ranking website made using Next.js

## Prerequisites

Make sure you have [Node.js](https://nodejs.org/) installed on your machine.

## Installation

1. Clone this repository;

2. Navigate to the project directory;

3. Create the `.env.local` file with the URL where the backend is running. Example:

   ```
   NEXT_PUBLIC_API="http://api-adress.com"
   ```

4. Install the dependencies:

   ```bash
   yarn
   ```

## Running the application

1. To start the server, run:

   ```bash
   yarn run dev
   ```

## Running in Production Using Docker

To start the container, run:

```bash
docker compose up app
```

You can set the following environment variable in a `.env` file:

* `DOCKER_EXPOSED_PORT`: Port on the host machine to access the application (default: `8082`)

