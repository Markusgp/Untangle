# Untangle
## Running the app
### Running the app locally
To run the app locally you run the ``run.sh`` script with some parameter which can be seen below
```
./run.sh language path/to/project
```

Right now the only supported language is java, so specifying another language will not produce any results. 

Then you need to specify what project you want to run the application on. Here specify the absolute path to the project.

### Running the app in docker
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

### Rerunning the app
If you have already done an analysis on the project, and you wish to see the same data, you do not need to run the whole analysis again.

If you ran the application locally, you can simply use the `npm start` command and the application with the previous data should be displayed.

If you ran the application in docker, you need to run `docker exec untangled /bin/bash -c "cd react-app; npm start"`

### Note
If you are running the app locally these are the files/directories that will go in your source project
- qlpack.yml (codeql dependencies)
- codeql (codeql queries)
- codeql-database-java (the codeql database)

It is also worth to note that if something goes wrong, you might see some previous data from a prior execution, or the test data provided by us. Therefore, it is a good practice if you wish to run analysis on another project or an updated project, that you delete the contents of `src/codeql-data` to not get any mix-ups