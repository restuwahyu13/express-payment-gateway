####################################
### DOCKER BUILD
####################################

DOCKER := docker

d-bd:
ifdef v
	${DOCKER} build -f Dockerfile.dev -t express/payment-gateway:${v} .
endif

d-bp:
ifdef v
	${DOCKER} build -f Dockerfile.prod -t express/payment-gateway:${v} .
endif


#################################
### APPLICATION BUILD AND DEV
#################################

NPM := npm

dev: #application with env development
	${NPM} run dev

prod: #application with env production
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
### KNEX MIGRATION
###############################

KNEX := knex

latest: #knex migrate latest database
	${KNEX} migrate:latest

rollback: #knex migrate rollback database
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

####################################
###  APPLICATION BUILD AUTOMATION
####################################

build: lfx.b compiler.b

lfx.b:
	${NPM} run lint:fix
compiler.b:
	${NPM} run build

####################################
### INSTALL GLOBAL AUTOMATION
####################################

install: npm.i  knex.i

npm.i:
	${NPM} install
knex.i:
	${NPM} install knex -g
