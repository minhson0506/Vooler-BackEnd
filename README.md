# Vooler-BackEnd

To run in local:
- Run in terminal
```bash
npm start
```
The server will open at http://localhost:3000

- Open another terminal to run front-end test:
```bash
cd ./frontendTest/
node testAuthFrontend.js > testAuth.log
```
- Check test log in file frontendTest/testAuth.log
  - If the userId existed, will receive response 403 in the log
  - If the userId is not yet existing, receive response:
    ```json
    {
        message: {
            row_added: 4,
            user_id: '$2a$12$3TNWLZkSAp1FgvpfGJOg9ukwBiDXE6DB13FCsIkQq38Bxrm1ZPi5a'
        },
        usernameValid: true
    }
    ```