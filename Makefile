NPM := npm
NPX := npx

####################################
### DOCKER BUILD
####################################

DOCKER := docker

dbd:
ifdef v
	${DOCKER} build -f Dockerfile.dev -t express/payment-gateway:${v} .
endif

dbp:
ifdef v
	${DOCKER} build -f Dockerfile.prod -t express/payment-gateway:${v} .
endif


##########################################
### APPLICATION DOCKER COMPOSE AUTOMATION
##########################################

cpup:
ifdef env
	${DOCKER}-compose -f docker-compose.${env}.yml up --build -d
endif

cpdown:
ifdef env
	${DOCKER}-compose -f docker-compose.${env}.yml down
endif

#################################
### APPLICATION BUILD AND DEV
#################################

dev: #application with env development
	${NPM} run dev

prod: lfx.c compiler.c #application with env production

lfx.c:
	${NPM} run lint:fix

compiler.c:
	${NPM} run build


####################################
###  ESLINT AND PRETTIER FORMATTER
####################################

fix:
	${NPM} run lint

format:
	${NPM} run format

lfx:
	${NPM} run lint:fix

###############################
### KNEX MIGRATION MANUAL
###############################

KNEX := knex

klatest: #knex migrate latest database
	${KNEX} migrate:latest

krollback: #knex migrate rollback database
	${KNEX} migrate:rollback

###############################
###  GIT AUTOMATION
###############################

GIT := git

gh: add.o commit.o push.o

add.o:
	${GIT} add .

commit.o:

ifdef msg
	${GIT} commit -m "${msg}"
endif

push.o:
	${GIT} push origin master

########################################
### APPLICATION BUILD AUTOMATION
#######################################

bdev: npm.b lfx.b

npm.b:
	${NPM} install

lfx.b:
	${NPM} run lint:fix

bprod: npm.i lfx.i compiler.i

npm.i:
	${NPM} install

lfx.i:
	${NPM} run lint:fix

compiler.i:
	${NPM} run build
