################################
####	APP TERITORY
################################
dev: #application winth env development
	npm run dev

prod: #application application to production
	npm run build

################################
#### SIMPLE GIT AUTOMATION
################################

GIT := git
ACTION := add.o commit.o push.o
gh: $(ACTION)

${ACTION}*.o:
	${GIT} add .
ifdef msg
	${GIT} commit -m "${msg}"
endif
	${GIT} push origin master

# git.c:
# ifdef msg
# 	${GIT} commit -m "${msg}"
# endif

# git.p:
# 	${GIT} push origin master
