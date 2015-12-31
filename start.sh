#!/bin/bash
#
#
# chkconfig: 2345 85 15
# description: 金泉妈妈  Server
#
APPHOME=/mnt/mama_club
DEAMON=$APPHOME/bin/www
LOG=$APPHOME/log
PID=$APPHOME/mama_club.pid

case "$1" in
    start)
        forever start -l $LOG/access.log -o $LOG/out.log -e $LOG/error.log --pidFile $PID -a $DEAMON
        ;;
    stop)
        forever stop --pidFile $PID $DEAMON
        ;;
    stopall)
        forever stopall --pidFile $PID
        ;;
    restartall)
        forever restartall --pidFile $PID
        ;;
    reload|restart)
        forever restart -l $LOG/access.log -o $LOG/out.log -e $LOG/error.log --pidFile $PID -a $DEAMON
        ;;
    list)
        forever list
        ;;
    *)
        echo "Usage: mama {start|stop|restart|reload|stopall|restartall|list}"
        exit 1
        ;;
esac
exit 0
