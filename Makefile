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

gh: git.a git.c git.p

git.a:
	${GIT} add .

git.c:
ifdef msg
	${GIT} commit -m "${msg}"
endif

git.p:
	${GIT} push origin master
