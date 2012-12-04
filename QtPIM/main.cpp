#include <QtGui/QApplication>
#include "qtpim.h"

#include <QSettings>
#include <QDir>

int main(int argc, char *argv[])
{
	const QString CONFIG_FILE(QDir::homePath() + "/.z-pim");
	QSettings settings(CONFIG_FILE, QSettings::IniFormat);

	QApplication a(argc, argv);
	QtPIM w;

	if (settings.value("autoLogin").toBool() != true) {
		w.show();
	}

	a.setQuitOnLastWindowClosed(false);
	return a.exec();
}
