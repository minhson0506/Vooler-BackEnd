# Vooler-BackEnd

## API Doc 
[API doc](https://www.notion.so/dieuv/API-doc-in-progress-b7f9f717c82a46d09129668739d7cb76#7951f223b5994c73b034989a96543a82)
## Test

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