# Vooler-BackEnd

This is a backend project built using NodeJS and the SQLite3 database. The primary purpose is to serve the mobile application in the repository 
[Vooler-FrontEnd](https://github.com/minhson0506/Vooler-FrontEnd).

The mobile project is conducted under the scope of the course Mobile Project at Metropolia UAS, Autumn 2022.

## Requirements

To run this project, you will need to have the following software installed on your machine:
  - NodeJS: You can download the latest version of Node.js from the official website (https://nodejs.org/).
  - npm: npm is the package manager for Node.js and is included with Node.js. You can check if you have npm installed by running the following command in your terminal: 
    ```
    npm -v
    ```
  - SQLite3

## Installation

To install this project, follow these steps:

1. Clone the repository to your local machine: 
   ```
   git clone https://github.com/minhson0506/Vooler-BackEnd
   ```
2. Navigate to the project directory: 
   ```
   cd Vooler-BackEnd
   ```
3. Install the required dependencies: 
   ```
   npm install
   ```
4. Create a `.env` file in the root directory with the following variables:
      - `DB_FILE`: the path to your SQLite3 database file
      - `SERVER_PORT`: the port that the server will run on (e.g 3000)
      - `JWT_SECRET`: the string that is used as the secret key when generating JSON Web Tokens(JWTs)
5. Start the server: 
   ```
   npm start
   ```
   This will start the server and you should see a message in the console similar to `Listening on port 3000`.

## Usage

To use this project, you will need to send HTTP requests to the server using your preferred method (e.g. cURL, Postman). 
The server has the following endpoints available as in the [API documentation](https://www.notion.so/dieuv/API-doc-finalized-b7f9f717c82a46d09129668739d7cb76).

## License

This project is licensed under the GNU General Public License - see the LICENSE.md file for details.    