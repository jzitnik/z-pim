#ifndef NEWTASK_H
#define NEWTASK_H

#include <QDialog>

namespace Ui {
    class NewTask;
}

class NewTask : public QDialog
{
    Q_OBJECT

public:
    explicit NewTask(QWidget *parent = 0);
    ~NewTask();

private slots:
	void on_cancelButton_clicked();

	void on_okButton_clicked();
	void httpDone(bool error);

private:
    Ui::NewTask *ui;
};

#endif // NEWTASK_H
