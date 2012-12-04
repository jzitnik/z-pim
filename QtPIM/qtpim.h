#ifndef QTPIM_H
#define QTPIM_H

#include <QMainWindow>
#include <QSystemTrayIcon>

namespace Ui {
class QtPIM;
}

class QtPIM : public QMainWindow
{
    Q_OBJECT
    
public:
    explicit QtPIM(QWidget *parent = 0);
    ~QtPIM();
    
protected:
    void changeEvent(QEvent *e);
    void closeEvent(QCloseEvent*);
    
private:
    Ui::QtPIM *ui;
    QSystemTrayIcon* tray;


private slots:
	void trayClicked(QSystemTrayIcon::ActivationReason);
	void createNewTask();
	void quit();
	void openInBrowser();
	void createNewEvent();
	void on_loginButton_clicked();
};
#endif // QTPIM_H
