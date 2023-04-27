
docker-build:
	docker build -f Docker/DOCKERFILE -t karlo2001/untangle .

run-base-image: docker-build
	docker run -d -it -p 8080:3000 --name untangled karlo2001/untangle

docker-cp: run-base-image
	cd ${PROJECT_PATH}
	docker cp untangled:/var/www .

docker-exec: docker-cp
	docker exec untangled /bin/bash -c "./docker-run.sh ${JAVA_VERSION}"

docker-push: docker-build
	docker push karlo2001/untangle
