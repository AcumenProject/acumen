#!/bin/sh
# Set of bash functions to help users and scripts perform administrative functions on acumen.
# Indexing is the primary purpose for the time being, but there are some helper functions as well.

# getcontext()
# Determines the context of which acumen install to handle (live, staging, dev)
# Parameters
# -- $1 the name of the context variable to be created
# -- $2 the name of the db variable
# -- $3 the value of the context passed to the "acumen" command
# Ex. The command "acumen index dev" would then call "getcontext context db $2" in the acumen
#     function. This then sets the context variable to dev and the db variable to acumen_dev
#     in the acumen function scope.

acumengetcontext(){
  local __contextvar=$1
  local contextval="dev"

  local __dbvar=$2
  local dbval="acumen_dev"

  local __pathvar=$3
  local pathval="/srv/www/htdocs/acumen"

  case "$4" in
    live)
      contextval="live"
      dbval="acumen"
      ;;
    staging)
      contextval="staging"
      dbval="acumen_staging"
      pathval="$pathval/staging"
      ;;
    *)
      pathval="$pathval/dev"
      ;;
  esac

  eval $__contextvar="'$contextval'"
  eval $__dbvar="'$dbval'"
  eval $__pathvar="'$pathval'"
}

# swapconfigs()
# Parameters
# -- $1 either "back" or the path to the conif files
# -- $2 if "back" provided as $1 then $2 will be the path
#
#   Swaps the config files for the different installs, so staging can be swaped to point to
# dev solr index and db during indexing. This creates a seemless cascade of the fresh index
# from dev -> staging -> live.
#
# Ex: swapconfigs $path - this would be the initial swap (i.e., staging to point to dev)
#   swapconfigs back $path - this would swap them back (i.e., staging to point back to staging)

acumenswapconfigs(){
  if [ "$1" == "back" ]; then
    cp $2/index.php $2/index_swap.php
    mv -f $2/index.swaped.php $2/index.php
  else
    cp $1/index.php $1/index.swaped.php
    mv -f $1/index_swap.php $1/index.php
  fi
}

acumenpushdb(){
  local USER="$DB_USER"
  local PASS="$DB_PASS"
  local DBHOST="$DB_HOST"

  if [ "$2" == "acumen" ]; then
    #if [ -f /home/acumen/sql/acumen.sql ]; then
    # mv /home/acumen/sql/acumen.sql /home/acumen/sql/acumen-$(date +%Y-%m-%d).sql
    #fi
    acumenbackup
    mysqldump --host=$DBHOST -u$USER -p$PASS $2 > /home/acumen/sql/$2.sql
  fi

  mysqldump --host=$DBHOST -u$USER -p$PASS $1 `cat push_tables.txt` > /home/acumen/sql/$1.sql
#  old method mysqldump --host=$DBHOST -u$USER -p$PASS --ignore-table=$1.transcripts --ignore-table=$1.tags --ignore-table=$1.tags_assets $1 > /home/acumen/sql/$1.sql
  mysql --host=$DBHOST -u$USER -p$PASS $2 < /home/acumen/sql/$1.sql
}

# acumenindexer()
# Parameters
# -- $1 context/installation to index (i.e., dev, staging, live)

acumenrunindexer(){
  local JAR_PATH="/home/acumen/"

  #> ${JAR_PATH}acumen.log
  java -Xms512m -Xmx1g -jar ${JAR_PATH}acumen.jar $1 >> ${JAR_PATH}acumen.log 2>&1
}

# acumensolrindex()
# Parameters
# -- $1 acumen installation context (dev, staging, live)
# -- $2 (optional) command for the solr data import handler. default: full-import

acumensolrindex(){
  local completed=0
  local command="full-import"

  if [ -n "$2" ]; then
    command="$2"
  fi

  curl -s "$SOLR_URL$1/dataimport?command=$command"
  while true
    do
    if [ $completed -gt 0 ]; then
      break;
    else
      sleep 90
      completed=$(curl -s "$SOLR_URL$1/dataimport?command=$command" | grep -c 'Indexing completed')
    fi
  done
}

acumenlog(){
  local path="$LOG_PATH"
  local logfile="acumen_cron.log"

  local msg=$(date)"  --:> "${1}

  if [ -z "$2" ]; then
    echo $msg >> ${path}"/"${logfile}
  else
    echo $msg >> ${path}"/"${2}
  fi
}

#Method adopted from http://pastebin.com/aw3QtzW2
acumenbackup(){
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

#acumenclearold(){
  # find /home/acumen/sql -name "$1" -type f -mmin +2880 -exec rm {} \;
#}

acumenpushindex(){
  ACUMEN_WEBPATH="$BASE_PATH/$ACUMEN_DIR"

  acumenswapconfigs ${ACUMEN_WEBPATH}/staging
  acumenpushdb acumen_dev acumen_staging
  acumensolrindex acumen_staging
  acumenswapconfigs back ${ACUMEN_WEBPATH}/staging
  acumenlog "New index pushed to Staging"

 acumenswapconfigs ${ACUMEN_WEBPATH}
  acumenpushdb acumen_staging acumen
  acumensolrindex acumen_live
  acumenswapconfigs back ${ACUMEN_WEBPATH}
  acumenlog "New index pushed to Live"
}

acumen(){

  acumengetcontext context db context_path $2

  case "$1" in
    index)
      echo "ACUMEN: Release the Indexer!"
      if [ "$2" == "all" ]; then
        acumenlog "INDEXER BEGIN---->>>"
        acumenrunindexer $db
        acumenlog " ---- Repo scan complete - db updated"

        acumenlog " ---- Updating solr index for dev"
        acumensolrindex acumen_dev
        acumenlog " ---- Solr index updated for dev"

        acumenpushindex
        acumenlog "INDEXER FINISH---->>>"

      fi
      ;;
    sqldump|mysqldump)
      echo "$1 $context $db $context_path -- From sqldump case"
      ;;
    *)
      echo "Command \"$1\" not found."
      ;;
  esac
}
