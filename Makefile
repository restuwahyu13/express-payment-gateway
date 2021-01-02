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
ACTION = add.o commit.o push.o

gh: ${ACTION}

%.o:
	${GIT} add .
ifdef msg
	${GIT} commit -m "${msg}"
endif
	${GIT} push origin master
