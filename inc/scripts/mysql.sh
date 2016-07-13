#!/bin/bash

#Method adopted from http://pastebin.com/aw3QtzW2
acumenBackupDB(){
  local DATE=`date +%Y-%m-%d`
  local OLD_DATE=`date -d "-3 days" "+%Y-%m-%d"`
  local BACKUP_FILE="/home/acumen/sql/acumen-$DATE.tar.gz"
  local OLD_BACKUP_FILE="/home/acumen/sql/acumen-$OLD_DATE.tar.gz"

  acumenlog "Creating backup $BACKUP_FILE"
  tar czf $BACKUP_FILE -C /home/acumen/sql acumen.sql 2>>/home/acumen/acumen_cron.log

  if [ -f $BACKUP_FILE ]; then
    acumenlog "$BACKUP_FILE created"
  else
    acumenlog "$BACKUP_FILE failed creation"
  fi

  if [ -f $OLD_BACKUP_FILE ]; then
    acumenlog "Removing 3 day old file $OLD_BACKUP_FILE"
    rm $OLD_BACKUP_FILE
    acumenlog "Removed $OLD_BACKUP_FILE"
  fi
}

acumenPushDB(){
  if [ "$2" == "acumen" ]; then
    acumenBackupDB
    mysqldump --host=$DBHOST -u$DBUSER -p$DBPASS $2 > $BACKUP_PATH/$2.sql
  fi
  
  mysqldump --host=$DBHOST -u$DBUSER -p$DBPASS $1 `cat push_tables.txt` > /home/acumen/sql/$1.sql
  mysql --host=$DBHOST -u$DBUSER -p$DBPASS $2 < /home/acumen/sql/$1.sql
}