## Express Payment Gateway

example simulate payment gateway studi case Backend Developer in PT Maritim Digital Indonesia

### NOTE

**sedang di garap**

### MAKEFILE

```makefile
################################
#### SIMPLE GIT AUTOMATION
################################

#execute command -> make gh msg="update using make file"

GIT := git

gh: git.a git.c git.p

git.a:
	${GIT} add .

git.c:
ifdef msg
	${GIT} commit -m ${msg}
endif

git.p:
	${GIT} push origin master
```
