docker pull karlo2001/untangle:latest
docker run -d -it -p 8080:3000 --name untangled karlo2001/untangle
cd $1
docker cp . untangled:/var/www
docker exec untangled //bin/bash -c "./docker-run.sh $2"
$SHELL