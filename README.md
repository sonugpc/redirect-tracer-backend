# Redirect Tracer Backend

This project is a backend service designed to trace and analyze URL redirects. It allows users to input a URL and get a detailed trace of all the redirects that occur, providing insights into the path taken by the request.

## Features

- **URL Redirect Tracing**: Trace the complete path of redirects for any given URL.
- **Detailed Reports**: Get comprehensive details of each redirect step, including status codes and destination URLs.
- **API Integration**: Simple API endpoints to integrate redirect tracing into other applications.

## Installation

### Prerequisites

- Node.js and npm installed

### Steps

1. Clone the repository:
    ```bash
    git clone https://github.com/sonugpc/redirect-tracer-backend.git
    cd redirect-tracer-backend
    ```

2. Install dependencies:
    ```bash
    npm install
    ```

3. Configure the service:
    - Rename `config/example.config.js` to `config/config.js`.
    - Edit `config/config.js` to include your configuration settings.

    ```javascript
    module.exports = {
        port: 3000,
        someOtherConfig: 'value'
    };
    ```

## Usage

Run the service with:
```bash
node index.js
