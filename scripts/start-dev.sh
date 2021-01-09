#!/bin/sh

npx knex migrate:latest
npm run dev
