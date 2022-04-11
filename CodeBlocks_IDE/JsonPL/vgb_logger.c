#ifndef stdarg_h
    #include <stdlib.h>
    #define stdlib_h
#endif // stdarg_h

#ifndef stdio_h
    #include <stdio.h>
    #define stdio_h
#endif // stdio_h

#ifndef stdarg_h
    #include <stdarg.h>
    #define stdarg_h
#endif // stdarg_h

#ifndef vgb_logger_h
    #include "vgb_logger.h"
    #define vgb_logger_h
#endif // vgb_logger_h

/**
* A static logging method that writes the provided text, followed by a new
* line, to standard output.
*
* @param s The specified text to write.
*/
void wrl(char *s, ...)
{
    if(LOGGING_ON == TRUE)
    {
        va_list args;
        va_start (args, s);
        vprintf(s, args);
        printf("%c", NEWLINE_CHAR);
        va_end (args);
    };
};

/**
* A static logging method that writes the provided text to standard output.
*
* @param s The specified text to write.
*/
void wr(char *s, ...)
{
    if(LOGGING_ON == TRUE)
    {
        va_list args;
        va_start (args, s);
        vprintf(s, args);
        va_end (args);
    };
};

/**
* A static logging method that writes the provided text, followed by a new
* line, to standard error.
*
* @param s The specified text to write.
*/
void wrlErr(char *s, ...)
{
    if(LOGGING_ON == TRUE)
    {
        va_list args;
        va_start (args, s);
        printf(">> ERROR MESSAGE START ============================================================>>\n");
        vprintf(s, args);
        printf("%c", NEWLINE_CHAR);
        va_end (args);
        printf("<< ERROR MESSAGE END ==============================================================<<\n");
    };
};

