#-------------------------------------------------
#
# Project created by QtCreator 2012-04-08T15:04:29
#
#-------------------------------------------------

QT       += core gui network

TARGET = QtPIM
TEMPLATE = app

SOURCES += main.cpp\
        qtpim.cpp \
    newtask.cpp \
    newevent.cpp

HEADERS  += qtpim.h \
    newtask.h \
    newevent.h

FORMS    += qtpim.ui \
    newtask.ui \
    newevent.ui


unix:!macx:!symbian: LIBS += -L$$PWD/../../../../../usr/lib64/ -lqjson

INCLUDEPATH += $$PWD/../../../../../usr/include/qjson
DEPENDPATH += $$PWD/../../../../../usr/include/qjson

RESOURCES += \
    Icons.qrc

