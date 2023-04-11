#ifndef TOOLS_H
#define TOOLS_H

#include <QObject>
#include <QWidget>
#include <QString>
#include <string>
#include <iostream>
class tools : public QObject
{
    Q_OBJECT
public:
    explicit tools(QObject *parent = nullptr);

signals:

};

QString strToQString(std::string str);
std::string QStringToStr(QString qstr);
char* stringToChar(std::string str);
#endif // TOOLS_H
