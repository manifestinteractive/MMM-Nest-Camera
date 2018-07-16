#!/bin/bash

clear

echo -e "\033[48;5;22m Let's Create a Nest Token \033[0m\n"

echo -e "If you do not already have a Nest Developer Account, you will\nneed to create one before you continue.  If you have an account,\nyou'll want to go ahead and log in."

echo -e "\n\033[38;5;34mhttps://console.developers.nest.com/nl/auth/new\033[0m\n"

echo -e "Press Any Key when Logged In ...\n"

read -n 1 -s

echo -e "Now you'll need to create a New Nest Project."

echo -e "\n\033[38;5;34mhttps://console.developers.nest.com/products/new\033[0m\n"

echo -e "Fill in the form with all the required data. Under Permissions,\nyou will need to set permissions for Thermostat & Camera if you\nintend to use either of these in Magic Mirror.\n"

echo -e "Once your new Project is created, access it in the Nest Developer\nconsole where you can access the OAuth information.\n"

echo -e "Press Any Key when Ready ...\n"

read -n 1 -s

echo -n "Input OAuth Client ID: "

read clientID

echo -n "Input OAuth Client Secret: "

read clientSecret

echo -e "\nOpen the Following URL in your Browser:"

echo -e "\n\033[38;5;34mhttps://home.nest.com/login/oauth2?client_id=$clientID&state=goodState\033[0m\n"

echo -e "Click the ALLOW Button & Copy the Generated PIN Code.\n"

echo -n "Input OAuth PIN Code: "

read PIN

IP=$(curl -s -X POST "https://api.home.nest.com/oauth2/access_token" -d "code=$PIN" -d "client_id=$clientID" -d "client_secret=$clientSecret" -d "grant_type=authorization_code") > /dev/null

echo -e "\nPlace the following in your config.js file:\n"

echo "{"
echo "  module: \"MMM-Nest-Camera\","
echo "  position: \"top_left\","
echo "  config: {"
echo -n "    token: \""
echo -n "$IP\"" | sed -e 's/{"access_token":"//' -e 's/","expires_in":[0-9]*}//'
echo "  }"
echo "}"
echo ""
