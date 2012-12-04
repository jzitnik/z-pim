#include "qtpim.h"
#include "ui_qtpim.h"
#include "newtask.h"
#include "newevent.h"

#include <QSettings>
#include <QDir>
#include <QAction>
#include <QMenu>
#include <QCloseEvent>
#include <QDesktopServices>
#include <QUrl>
#include <QIcon>

const QString CONFIG_FILE(QDir::homePath() + "/.z-pim");
QSettings settings(CONFIG_FILE, QSettings::IniFormat);

QMenu *trayMenu;

QtPIM::QtPIM(QWidget *parent) :
	QMainWindow(parent),
	ui(new Ui::QtPIM)
{
	ui->setupUi(this);

	QAction *actionExit = new QAction(QIcon(":/trayIcons/shutdown.png"), trUtf8("Ukončit"), this );
	connect(actionExit, SIGNAL(triggered()), this, SLOT(quit()));

	QAction *actionNewTask = new QAction(QIcon(":/trayIcons/add.png"),  trUtf8("Nový úkol"), this );
	connect(actionNewTask, SIGNAL(triggered()), this, SLOT(createNewTask()));

	QAction *actionNewEvent = new QAction(QIcon(":/trayIcons/add.png"),  trUtf8("Nová událost"), this );
	connect(actionNewEvent, SIGNAL(triggered()), this, SLOT(createNewEvent()));

	QAction *actionOpenInBrowser = new QAction(QIcon(":/trayIcons/browser.png"),  trUtf8("Otevřít v prohlížeči"), this );
	connect(actionOpenInBrowser, SIGNAL(triggered()), this, SLOT(openInBrowser()));

	QAction *actionSettings = new QAction(QIcon(":/trayIcons/setting.png"),  trUtf8("Nastavení"), this );
	connect(actionSettings, SIGNAL(triggered()), this, SLOT(show()));

	trayMenu = new QMenu( this );
	trayMenu->addAction( actionExit );
	trayMenu->addAction( actionNewTask );
	//trayMenu->addAction( actionNewEvent );
	trayMenu->addAction( actionSettings );
	trayMenu->addAction( actionOpenInBrowser );

	tray = new QSystemTrayIcon(style()->standardIcon(QStyle::SP_DirHomeIcon), this);
	tray->setContextMenu(trayMenu);

	connect(tray, SIGNAL(activated(QSystemTrayIcon::ActivationReason)),
		this, SLOT(trayClicked(QSystemTrayIcon::ActivationReason)));

	//settings
	ui->server->setText(settings.value("server").toString());
	ui->login->setText(settings.value("login").toString());
	ui->password->setText(settings.value("password").toString());
	ui->autoLogin->setChecked(settings.value("autoLogin").toBool());

	tray->setVisible(true);

	if (settings.value("autoLogin").toBool() == true) {
		//this->hide();
	}

}

void QtPIM::trayClicked(QSystemTrayIcon::ActivationReason reason)
{
	    //zobrazit menu
	    trayMenu->show();

}

void QtPIM::createNewTask()
{
	NewTask(this).exec();
}

void QtPIM::createNewEvent()
{
	NewEvent(this).exec();
}

void QtPIM::quit() {
	exit(0);
}

void QtPIM::openInBrowser()
{
	QUrl url = "http://" + settings.value("server").toString();
	QDesktopServices::openUrl(url);
}

void QtPIM::closeEvent(QCloseEvent* event)
{
	if(tray->isVisible()) {
		this->setVisible(false);
		event->ignore();
	}
}

QtPIM::~QtPIM()
{
	delete ui;
}

void QtPIM::changeEvent(QEvent *e)
{
	QMainWindow::changeEvent(e);
	switch (e->type()) {
		case QEvent::LanguageChange:
			ui->retranslateUi(this);
		break;
		default:
		break;
	}
}

void QtPIM::on_loginButton_clicked()
{
	QString server = ui->server->text();
	QString login = ui->login->text();
	QString password = ui->password->text();
	bool autoLogin = ui->autoLogin->isChecked();

	settings.setValue("server", server);
	settings.setValue("login", login);
	settings.setValue("password", password);
	settings.setValue("autoLogin", autoLogin);

	settings.sync();

	this->hide();
}
