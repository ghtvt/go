#!/bin/bash
#init
TVBOX_Dir=/home/asters/qt5.9.1/TVBOX
TVBOX_Debug=/home/asters/qt5.9.1/build-TVBOX-gcc-Debug
TVBOX_CJSON=${TVBOX_Dir}/cjson
TVBOX_SO=${TVBOX_Dir}/so
TVBOX_Debug_S0=${TVBOX_Debug}/so

make clean
make so

rm -rf ./so/lib_linux_x86_json.so
mv ./libjson.so ./so/lib_linux_x86_json.so

#rm so/*
rm -rf "${TVBOX_SO}/lib_linux_x86_json.so"
rm -rf "${TVBOX_SO}/json.hpp"
rm -rf "${TVBOX_Debug_S0}/lib_linux_x86_json.so"
rm -rf "${TVBOX_Debug_SO}/json.hpp"
#rm cjson/*
#rm -rf "${TVBOX_CJSON}/*"
#cp so/*
cp ./so/lib* "${TVBOX_SO}/"
cp ./so/lib* "${TVBOX_Debug_S0}/"
##cp cjson
cp ./json.hpp "${TVBOX_SO}/"
cp ./json.hpp "${TVBOX_Debug_S0}/"
#cp ./build.sh "${TVBOX_CJSON}/"
#cp ./makefile "${TVBOX_CJSON}/"

