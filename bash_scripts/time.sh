cript to start our application
if [ ! -n "$3" ]
then
	echo ""
	echo "\033[1;31mUsage: tl <interval (in seconds)> <duration (in hours)> <duration (in minutes)>"
	echo ""
	echo "\033[1;32mExample: tl 10 5 30"
	echo "(Takes a picture every 10 seconds for the next 5 hours and 30 minutes)"
	echo "\033[0m"
else
	mkdir -p $HOME/timelapse/pics_$(date +%F)
	interval=$(($1 * 1000))
	duration=$((($2 * 60 + $3) * 60000))
	hour_act=$(date +%H)
	minute_act=$(date +%M)
	hour_tmp=$(($hour_act + $2))
	minute_tmp=$(($minute_act + $3))
	if [ "$hour_tmp" -gt 24 ]
	then
		hour_then=$(($hour_tmp - 24))
	else
		hour_then=$hour_tmp
	fi
	if [ "$minute_tmp" -gt 60 ]
	then
		minute_then=$(($minute_tmp -60))
		hour_then=$((hour_then + 1))
	else
		minute_then=$minute_tmp
	fi
	echo "\033[1;31mTaking Pictures for timelapse in progress. Check back at $hour_then:$minute_then"
	echo "\033[0m"
	cd $HOME/timelapse/pics_$(date +%F)/
	raspistill -o lapse_%04d.jpg -tl $interval -t $duration
	cd $HOME









scp -r $HOME/timelapse/pics_$(date +%F) jmzhwng@vergil.u.washington.edu:/nfs/bronfs/uwfs/dw00/d96/jmzhwng/Images
	rm -r $HOME/timelapse/pics_$(date +%F)
fi








