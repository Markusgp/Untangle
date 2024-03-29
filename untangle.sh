if [ ! "$#" -eq "1" ]; then
  echo "You should only pass exactly 1 arguments, which is the java version"
  echo "Press enter to exit"
  read user_read
  exit 1
fi
docker pull karlo2001/untangle:latest
docker run -d -it -p 8080:3000 --name untangled karlo2001/untangle
docker cp . untangled:/var/www
docker exec untangled //bin/bash -c "./docker-run.sh $1"
$SHELL