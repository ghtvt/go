#include "detail.h"
#include "ui_detail.h"
#include <QDebug>
#include "tools.h"
#include <QPixmap>

Detail::Detail(QWidget *parent) :
    QWidget(parent),
    ui(new Ui::Detail)
{
    ui->setupUi(this);
}
Detail::Detail(std::string vod_id,std::string vod_name,std::string vod_pic,std::string vod_remarks,QWidget *parent) :
    QWidget(parent),
    ui(new Ui::Detail)
{
    ui->setupUi(this);
    this->vod_id=vod_id;
    this->vod_name=vod_name;
    this->vod_pic=vod_pic;
    this->vod_remarks=vod_remarks;

    qDebug()<< "did:"+strToQString(this->getVodId());
    qDebug()<< "dname:"+strToQString(this->getVodName());
    qDebug()<< "dpic:"+strToQString(this->getVodPic());
    qDebug()<< "dremarks:"+strToQString(this->getVodRemarks());

    //设置标题
    this->setWindowTitle(strToQString(this->getVodName()));
    //设置返回按钮
    QPixmap pix;
    pix.load(":/res/shangyibu.png");
    pix=pix.scaled(pix.width()*0.2,pix.height()*0.2);
    ui->back->setPixmap(pix);
    connect(ui->back,&TvLabel::clicked,[=]{
        this->close();
        emit backHome();
    });



}

Detail::~Detail()
{
    delete ui;

}
void Detail::setVodId(std::string vod_id){
    this->vod_id=vod_id;
}
void Detail::setVodName(std::string vod_name){
    this->vod_name=vod_name;
}
void Detail::setVodPic(std::string vod_pic){
    this->vod_pic=vod_pic;
}
void Detail::setVodRemarks(std::string vod_remarks){
    this->vod_remarks=vod_remarks;

}
std::string Detail::getVodId(){
    return this->vod_id;

}
std::string Detail::getVodName(){

    return this->vod_name;
}
std::string Detail::getVodPic(){

    return this->vod_pic;
}
std::string Detail::getVodRemarks(){
    return this->vod_remarks;

}

