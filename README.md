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
ACTION = add.o commit.o push.o

gh: ${ACTION}

%.o:
	${GIT} add .
ifdef msg
	${GIT} commit -m "${msg}"
endif
	${GIT} push origin master
```
