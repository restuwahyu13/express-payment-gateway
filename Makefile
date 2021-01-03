#################################
### APPLICATION BUILD AND DEV
#################################

NPM := npm

dev: #application with env development
	${NPM} run dev

prod: #application with env production
	${NPM} run build

###############################
### SIMPLE GIT AUTOMATION
###############################

GIT := git
ACTION_GITHUB = add.o commit.o push.o

gh: ${ACTION_GITHUB}

%.o:
	${GIT} add .
ifdef msg
	${GIT} commit -m "${msg}"
endif
	${GIT} push origin master

###############################
### KNEX MIGRATION
###############################

KNEX := knex

latest: #knex migrate latest database
	${KNEX} migrate:latest

rollback: #knex migrate rollback database
	${KNEX} migrate:rollback
