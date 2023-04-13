QT       += core gui

greaterThan(QT_MAJOR_VERSION, 4): QT += widgets

CONFIG += c++11
DEFINES += QT_DEPRECATED_WARNINGS

CONFIG -= app_bundle
QT += widgets

QT_CONFIG -= no-pkg-config
CONFIG += link_pkgconfig debug
PKGCONFIG += mpv


PKGCONFIG += mpv
SOURCES += \
    detail.cpp \
    main.cpp \
    mainwin.cpp \
    mpvwidget.cpp \
    tools.cpp \
    tvlabel.cpp \
    vn.cpp
HEADERS += \
    detail.h \
    mainwin.h \
    mpvwidget.h \
    qthelper.hpp \
    so/json.hpp \
    so/libjx.h \
    tools.h \
    tvlabel.h \
    vn.h

FORMS += \
    detail.ui \
    mainwin.ui \
    vn.ui

# Default rules for deployment.
qnx: target.path = /tmp/$${TARGET}/bin
else: unix:!android: target.path = /opt/$${TARGET}/bin
!isEmpty(target.path): INSTALLS += target




QMAKE_LFLAGS += -Wl,-rpath=./so/

unix:!macx: LIBS += -L$$PWD/so/ -ljx

INCLUDEPATH += $$PWD/so
DEPENDPATH += $$PWD/so

RESOURCES += \
    res.qrc

unix:!macx: LIBS += -L$$PWD/so/ -l_linux_x86_json

INCLUDEPATH += $$PWD/so
DEPENDPATH += $$PWD/so
