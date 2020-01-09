#!/bin/bash
bash -ac 'source .env-prod && \
echo $PG_URI && \
pg_dump $PG_URI > dev-dump.sql'
