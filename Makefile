################################
####	APP TERITORY
################################
dev: #application winth env development
	npm run dev

prod: #application application to production
	npm run build

################################
####	GIT TERITORY
################################

GIT := git
MSG = update files

gh: git.a git.c git.p #simple automation git

git.a:
	${GIT} add .

git.c:
ifdef command
	${GIT} commit -m ${command}
endif

git.p:
	${GIT} push origin master
