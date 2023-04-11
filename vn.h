#ifndef VN_H
#define VN_H

#include <QWidget>
#include <string>
namespace Ui {
class VN;
}

class VN : public QWidget
{
    Q_OBJECT

public:
    explicit VN(std::string name,std::string path,QWidget *parent = nullptr);
    void setVodId(std::string vod_id);
    void setVodName(std::string vod_name);
    void setVodPic(std::string vod_pic);
    void setVodRemarks(std::string vod_remarks);
    std::string getVodId();
    std::string getVodName();
    std::string getVodPic();
    std::string getVodRemarks();
    ~VN();
protected:
        virtual void mouseReleaseEvent(QMouseEvent * ev);
signals:
      void clicked();

private:
    Ui::VN *ui;
    std::string vod_id;
    std::string vod_name;
    std::string vod_pic;
    std::string vod_remarks;

 };

#endif // VN_H
