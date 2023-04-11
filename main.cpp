#include "mainwin.h"

#include <QApplication>
#include "so/libjx.h"

int main(int argc, char *argv[])
{
    test();
    QApplication a(argc, argv);
    MainWin w;
    w.show();
    return a.exec();
}
