NODE_ENV := development.o production.o
ENV = development
runner: ${NODE_ENV}

development.o:
ifeq (${ENV}, development)
	npm run dev
endif

production.o:
ifeq (${ENV}, production)
	npm run build
endif
