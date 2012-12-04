#ifndef NEWEVENT_H
#define NEWEVENT_H

#include <QDialog>

namespace Ui {
    class NewEvent;
}

class NewEvent : public QDialog
{
    Q_OBJECT

public:
    explicit NewEvent(QWidget *parent = 0);
    ~NewEvent();

private:
    Ui::NewEvent *ui;
};

#endif // NEWEVENT_H
