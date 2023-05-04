if [ ! "$#" -eq "2" ]; then
  echo "You should only pass exactly 2 arguments, first the projects directory and then the java version"
  echo "Press enter to exit"
  read user_read
  exit 1
fi
docker pull karlo2001/untangle:latest
docker run -d -it -p 8080:3000 --name untangled karlo2001/untangle
cd $1
docker cp . untangled:/var/www
docker exec untangled //bin/bash -c "./docker-run.sh $2"
$SHELL