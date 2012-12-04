#!/bin/bash

#find ./lis ./lblib/form ./lblib/table ./py -name '*.js' -exec cat '{}' \; | wc -l

DOJO_SDK='dojo'
BUILD_PATH='build'

usage()
{
cat << EOF
usage: $0 options

This script compile Javascript DoJo project

OPTIONS:
   -h		Show this message
   -d		DoJo SDK folder name
   -b		Build folder
EOF
}

#arguments
while getopts "ab:" OPTION; do
	case $OPTION in
		h)
			usage
			exit 1
		;;
		d)
			DOJO_SDK=$OPTARG
		;;
		b)
			BUILD_PATH=$OPTARG
		;;
		?)
			usage
			exit
		;;
	esac
done

if [[ -z $DOJO_SDK ]]
then
     usage
     exit 1
fi

#buildprofile
if [ ! -f ./app/app.profile.js ]; then
	echo "ShrinkSafe profile not found (./profile.js)"
	exit 1
fi

#build
if ! cd $DOJO_SDK/util/buildscripts; then
	echo "DoJo build script not found"
	exit 1
fi

./build.sh profileFile=../../../app/app.profile.js action=clean,release version=1.5.0 mini=true releaseDir=../../../$BUILD_PATH

cd ../../..


echo "All done"

