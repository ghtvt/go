#include "tools.h"
#include <QString>

tools::tools(QObject *parent) : QObject(parent)
{
}

QString strToQString(std::string str){
    return  QString::fromStdString(str);
}
std::string QStringToStr(QString qstr){
    return qstr.toStdString();
}

char* stringToChar(std::string str){
     char *c_char = const_cast<char *>(str.c_str()) ;
     return c_char;
}
