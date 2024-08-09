cd ..

if [ -e "backend.zip" ]; then
    echo "Previous Version Exists. Deleting that."
    rm backend.zip
else
    echo "No Previous Version Found"
fi


zip -r backend.zip zed-facilitator -x "zed-facilitator/node_modules/*" "zed-facilitator/.github/*" "zed-facilitator/zed.pem"
sftp -i ./zed-facilitator/zed.pem ubuntu@43.204.195.69  << 'ENDSFTP'
    put ./backend.zip
ENDSFTP
ssh -i "./zed-facilitator/zed.pem" ubuntu@43.204.195.69  << 'ENDSSH'
pm2 stop all
pm2 delete all
if [ -d "workingdirectory" ]; then
  echo "workingdirectory does exist."
fi
rm -rf zed-facilitator
unzip backend.zip
rm -rf backend.zip
cd zed-facilitator
npm install
pm2 start --name zed npm -- run start
pm2 save
ENDSSH
cd zed-facilitator