# Untangle

## Running the app in docker
Start with creating the docker image by running

```
docker build -f Docker\DOCKERFILE -t untangle .
```

If you want to run the image with file sharing, meaning that all changes in the image for the source project will also be reflected on your own system (only recommended for testing as it pollutes your source code with queries etc) run
```
docker run -d -it -p 8080:3000 --name untangled -v /path/to/project:/var/www untangle
```

If you want to run the image without file sharing run the following commands
```
docker run -d -it -p 8080:3000 --name untangled untangle
cd /path/to/project
docker cp . untangled:/var/www
```

Now the container is set up for the app to run. To run the app run the following command while specifying your java version
```
docker exec untangled /bin/bash -c "./docker-run.sh java-version"
```

For example if you want to run the app and your project is made with java 15, you can run the following command
```
docker exec untangled /bin/bash -c "./docker-run.sh 15"
```