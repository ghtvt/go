#include "tvlabel.h"
#include <QMouseEvent>

TvLabel::TvLabel(QWidget *parent) : QLabel(parent)
{

}

// 重写鼠标释放时间 mouseReleaseEvent()
void TvLabel::mouseReleaseEvent(QMouseEvent *ev)
{
    Q_UNUSED(ev)
    if(ev->button() == Qt::LeftButton)
    {
        emit clicked();	// 发射信号
    }
}
