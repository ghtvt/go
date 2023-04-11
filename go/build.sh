#!/bin/bash
#init
TVBOX_Dir=/home/asters/qt5.9.1/TVBOX
TVBOX_Debug=/home/asters/qt5.9.1/build-TVBOX-gcc-Debug
TVBOX_GO=${TVBOX_Dir}/go
TVBOX_SO=${TVBOX_Dir}/so
TVBOX_Debug_S0=${TVBOX_Debug}/so


go build -o libjx.so -buildmode=c-shared
#rm so/*
rm -rf "${TVBOX_SO}/libjx.h"
rm -rf "${TVBOX_SO}/libjx.so"
rm -rf "${TVBOX_Debug_S0}/libjx.h"
rm -rf "${TVBOX_Debug_S0}/libjx.so"
#rm go/*
rm -rf "${TVBOX_GO}/*"
rm -rf "${TVBOX_Dir}/bin/*"
#cp so/*
cp ./lib* "${TVBOX_SO}/"
cp ./lib* "${TVBOX_Debug_S0}/"
#cp go
#cp ./main.go "${TVBOX_GO}/"
#cp ./debug "${TVBOX_GO}/"
#cp ./go.* "${TVBOX_GO}/"
#cp ./build.sh "${TVBOX_GO}/"
#cp ./jx_debug "${TVBOX_Dir}/bin"

