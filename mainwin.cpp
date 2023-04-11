#include "mainwin.h"
#include "detail.h"
#include "ui_mainwin.h"
#include "tvlabel.h"
#include <QDebug>
#include <QHBoxLayout>
#include <iostream>
#include <fstream>
#include <QFile>
#include "libjx.h"
#include <QString>
#include "json.hpp"
#include <fstream>
#include "tools.h"
#include "vn.h"

using json =nlohmann::json;
using namespace std;


MainWin::MainWin(QWidget *parent)
    : QWidget(parent)
    , ui(new Ui::MainWin)
{
    ui->setupUi(this);
    initConnect();
    //加载文件
    json tvboxConfig =LoadJsonFile("./config/config.json");
    json source =LoadJsonFile("./config/source.json");
    //初始化sourceId,上一次退出时的SID
    string homeSourceId=getJsonString(tvboxConfig,"sourceId");

    //初始化右上角小控件
    TvLabel *shezhi=  initBar(":/res/shezhi.png",0.15,0.15,ui->iconbar);
    TvLabel *lishijilu=  initBar(":/res/lishijilu.png",0.15,0.15,ui->iconbar);
    TvLabel *live=  initBar(":/res/live.png",0.15,0.15,ui->iconbar);
    QHBoxLayout *iconbar_layout=new QHBoxLayout();
    iconbar_layout->addWidget(lishijilu);
    iconbar_layout->addWidget(live);
    iconbar_layout->addWidget(shezhi);
    ui->iconbar->setLayout(iconbar_layout);
    ui->iconbar->move(this->width()-ui->iconbar->width(),0);
    //初始化搜索框
    TvLabel *sousuo=  initBar(":/res/sousuo.png",0.20,0.20,ui->sousuobar);
    QHBoxLayout *sousuobar_layout=new QHBoxLayout();
    sousuobar_layout->addWidget(ui->input_sousuo);
    sousuobar_layout->addWidget(sousuo);
    ui->sousuobar->setLayout(sousuobar_layout);
    ui->sousuobar->move(this->width()/2-ui->sousuobar->width()/2,0);
    ui->iconbar->setGeometry(ui->iconbar->x(),ui->iconbar->y(),350,150);
    //解析js,type标题

    init(source,homeSourceId);

    createVideo(source,homeSourceId,"yy",1);

    //   ui->header->setStyleSheet("background-color:blue;");
}

MainWin::~MainWin()
{
    delete ui;

}
TvLabel* MainWin::initBar(QString pixPATH,float x ,float y,QWidget *parent ){
    TvLabel *tlabel =new TvLabel();
    QPixmap pix;
    pix.load(pixPATH);
    pix=pix.scaled(pix.width()*x,pix.height()*y);
    tlabel->setPixmap(pix);
    tlabel->setParent(parent);
    return tlabel;

}


void MainWin::initConnect(){
    //Type初始化，js
    connect(this,SIGNAL(init(json,std::string)),this,SLOT(createType(json,std::string)));}
void MainWin::createType(json source,std::string sid){
    //删除布局
    QLayout *lout= this->findChild<QWidget*>("type")->layout();
    if(lout!=NULL){ delete lout;}
    //删除TVLabel
    QList<TvLabel*> tlabels=this->findChild<QWidget*>("type")->findChildren<TvLabel*>();
    foreach (TvLabel *t,tlabels){delete t;}
    auto obj= getJsonObj(source,sid);
    string str_homeContent=homeContent(stringToChar(obj["homeContent"]));
    json json_homeContent=LoadJsonStr(str_homeContent);
//    cout<<json_homeContent<<endl;
    QHBoxLayout *type_layout=new QHBoxLayout();
    for(int i=0;i<getObjArrayLength(json_homeContent["class"]);i++){
        TvLabel *tlabel= new TvLabel();
        string str_id=getJsonString(json_homeContent["class"][i],"type_id");
        string str_name=" "+getJsonString(json_homeContent["class"][i],"type_name")+" ";
        tlabel->setObjectName(QString::fromStdString(str_id));
        tlabel->setText(QString::fromStdString(str_name));

//        cout<<str_name<<endl;

        type_layout->addWidget(tlabel);
    }
    this->findChild<QWidget*>("type")->setLayout(type_layout);



    //     std::cout<<a<<std::endl;
    //初始化json
}

void MainWin::createVideo(json source, std::string sid,std::string tid,int pg){
    auto obj= getJsonObj(source,sid);
    string  str_categoryContent =categoryContent(stringToChar(tid),pg,stringToChar(obj["categoryContent"]));
    json json_categoryContent=LoadJsonStr(str_categoryContent);
    QGridLayout *video_layout=new QGridLayout();
    for (int i = 0; i < getObjArrayLength(json_categoryContent["list"]); i++) {
        string str_id=getJsonString(json_categoryContent["list"][i],"vod_id");
        string str_name=getJsonString(json_categoryContent["list"][i],"vod_name");
        string str_pic=getJsonString(json_categoryContent["list"][i],"vod_pic");
      //  string str_remarks=getJsonString(json_categoryContent["list"][i],"vod_remarks");
string img_name=tid+"#"+str_id+"#"+str_name;
string img_path="./cache/"+img_name;
if  (!checkFile(stringToChar(img_path))){

    downLoadIMG(stringToChar(str_pic),stringToChar(img_path));
}
        VN *v=new VN(str_name,img_path);
        v->setVodId(str_id);
        v->setVodName(str_name);
        v->setVodPic(str_pic);
       //v->setVodRemarks(str_remarks);
        v->setVodRemarks("");
        v->setObjectName(QString::fromStdString(str_id));

//        cout<<str_name<<endl;
        //行
        int a=i/6;
        //列
        int b=i%6;
        QSizePolicy sizePolicy(QSizePolicy::Fixed, QSizePolicy::Fixed);
      //  sizePolicy.setHorizontalStretch(0);
      //  sizePolicy.setVerticalStretch(0);
       // sizePolicy.setHeightForWidth(vlabel->sizePolicy().hasHeightForWidth());
       // vlabel->setSizePolicy(sizePolicy);
     //  v->setMinimumSize(QSize(100, 60)),
      // v->setMaximumSize(QSize(100, 60));
        video_layout->addWidget(v,a,b);
        connect(v,&VN::clicked,this,[=](){

//            qDebug()<< "id:"+strToQString(v->getVodId());
//            qDebug()<< "name:"+strToQString(v->getVodName());
//            qDebug()<< "pic:"+strToQString(v->getVodPic());
//            qDebug()<< "remarks:"+strToQString(v->getVodRemarks());
            this->detail=new Detail(v->getVodId(),v->getVodName(),v->getVodPic(),v->getVodRemarks());
            this->detail->setGeometry(this->geometry());
            this->hide();
            this->detail->setVodId(v->getVodId());
            this->detail->setVodName(v->getVodName());
            this->detail->show();

    connect(this->detail,&Detail::backHome,[=]{
        this->show();
    });


        });

    }
    this->findChild<QWidget*>("vod")->setLayout(video_layout);

}
