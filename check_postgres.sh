#/bin/bash

current_postgres=$(heroku addons | grep postgres)
if [[ ${current_postgres} == "" ]]; then
    heroku addons:create heroku-postgresql:hobby-dev
fi
