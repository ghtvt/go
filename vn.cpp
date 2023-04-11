#include "vn.h"
#include "ui_vn.h"
#include <string>

VN::VN(std::string name,std::string path,QWidget *parent) :
    QWidget(parent),
    ui(new Ui::VN)
{
    ui->setupUi(this);
    ui->name->setText(QString::fromStdString(name));
    QPixmap pix;
    pix.load(QString::fromStdString(path));
    pix=pix.scaled(120,180);
    ui->img->setPixmap(pix);
}

VN::~VN()
{
    delete ui;
}
void VN::mouseReleaseEvent(QMouseEvent *ev)
{
    Q_UNUSED(ev)
        emit clicked();	// 发射信号
}
  void VN::setVodId(std::string vod_id){
  this->vod_id=vod_id;
  }
  void VN::setVodName(std::string vod_name){
  this->vod_name=vod_name;
  }
  void VN::setVodPic(std::string vod_pic){
      this->vod_pic=vod_pic;
  }
  void VN::setVodRemarks(std::string vod_remarks){
      this->vod_remarks=vod_remarks;

  }
  std::string VN::getVodId(){
      return this->vod_id;

  }
  std::string VN::getVodName(){

      return this->vod_name;
  }
  std::string VN::getVodPic(){

      return this->vod_pic;
  }
  std::string VN::getVodRemarks(){
      return this->vod_remarks;

  }
