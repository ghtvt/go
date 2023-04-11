#ifndef DETAIL_H
#define DETAIL_H

#include <QWidget>

namespace Ui {
class Detail;
}

class Detail : public QWidget
{
    Q_OBJECT

public:
    explicit Detail(std::string vod_id,std::string vod_name,std::string vod_pic,std::string vod_remarks,QWidget *parent = nullptr);
    explicit Detail(QWidget *parent = nullptr);
    void setVodId(std::string vod_id);
    void setVodName(std::string vod_name);
    void setVodPic(std::string vod_pic);
    void setVodRemarks(std::string vod_remarks);
    std::string getVodId();
    std::string getVodName();
    std::string getVodPic();
    std::string getVodRemarks();
    ~Detail();

private:
    Ui::Detail *ui;
    std::string vod_id;
    std::string vod_name;
    std::string vod_pic;
    std::string vod_remarks;
signals:
    void backHome();
public slots:
};

#endif // DETAIL_H
