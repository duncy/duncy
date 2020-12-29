//Modify this file to change what commands output to your statusbar, and recompile using the make command.
static const Block blocks[] = {
	/*Icon*/	/*Command*/							/*Update Interval*/	/*Update Signal*/
	{" RAM: ", 	"free | awk '/^Mem/ { printf \"%.f%\", ($3/$2)*100 }'",		30,			0},
	{"CPU: ",	"sensors | awk '/^Tdie/ { print substr($2, 2); }'",		30,			0},
	{"", 		"date",								1,			0},
};

//sets delimeter between status commands. NULL character ('\0') means no delimeter.
static char delim[] = " | ";
static unsigned int delimLen = 5;
