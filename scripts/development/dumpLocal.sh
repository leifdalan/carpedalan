#!/bin/bash
pg_dump postgres://postgres:postgres@localhost:5432/postgres -O -x | gzip -9 > carpedalan.sql.gz
redis-cli --rdb output.rdb