#ifndef TVLABLE_H
#define TVLABLE_H
#include <qlabel.h>

#include <QWidget>
class TvLabel : public QLabel
{
    Q_OBJECT
public:
    explicit TvLabel(QWidget *parent = nullptr);
protected:
        virtual void mouseReleaseEvent(QMouseEvent * ev);
signals:

      void clicked();

};

#endif // TVLABLE_H
