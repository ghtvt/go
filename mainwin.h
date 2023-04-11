#ifndef MAINWIN_H
#define MAINWIN_H

#include"tvlabel.h"
#include "ui_mainwin.h"
#include <QWidget>
#include <string>
#include "json.hpp"
#include "detail.h"


using json =nlohmann::json;
QT_BEGIN_NAMESPACE
namespace Ui { class MainWin; }
QT_END_NAMESPACE

class MainWin : public QWidget
{
    Q_OBJECT

public:
    MainWin(QWidget *parent = nullptr);
    ~MainWin();


private:
    Ui::MainWin *ui;
    Detail *detail;

    TvLabel* initBar(QString pixPATH,float x,float y,QWidget *parent );
    void initConnect();
signals:
    void init(json,std::string);

public slots:
    void createType(json source,std::string sid);
void createVideo(json source, std::string sid,std::string tid,int pg);
};
#endif // MAINWIN_H
