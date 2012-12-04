#include "newtask.h"
#include "ui_newtask.h"


#include <QSettings>
#include <QDir>
#include <QHttp>
#include <qjson/serializer.h>
#include <QByteArray>




QHttp http;

NewTask::NewTask(QWidget *parent) :
	QDialog(parent),
	ui(new Ui::NewTask)
{
	QObject::connect( &http, SIGNAL(done(bool)), this, SLOT(httpDone(bool)) );
	ui->setupUi(this);
}

NewTask::~NewTask()
{
	delete ui;
}

void NewTask::httpDone(bool error) {
	QHttp::Error err = http.error();
	if (error) {
		//ui->message->setText(err);
	} else {
		this->hide();
	}
}


void NewTask::on_cancelButton_clicked()
{
	this->hide();
}

void NewTask::on_okButton_clicked()
{
	QJson::Serializer serializer;

	const QString CONFIG_FILE(QDir::homePath() + "/.z-pim");
	QSettings settings(CONFIG_FILE, QSettings::IniFormat);

	QVariantMap data;
	data.insert("name", ui->taskName->text());

	QVariantMap request;
	request.insert("data", data);

	QString host = settings.value("server").toString();

	QHttpRequestHeader header("POST", "/server/Tasks/insert");
	header.setValue("Host", host);
	header.setContentType("application/x-www-form-urlencoded");

	http.setHost(host);

	QString login = settings.value("login").toString();
	QString password = settings.value("password").toString();

	QByteArray json = serializer.serialize(request);
	QString postData  = "login=" + login + "&password=" + password + "&request=" + json;

	http.request(header, postData.toUtf8());

	//ttp.get("/passmap.html");

}
