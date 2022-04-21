#ifndef constants_h
    #define constants_h
    #include "constants.h"
#endif // constants_h

#ifndef LOGGING_ON
    #define LOGGING_ON TRUE
#endif // LOGGING_ON

/**
* A static logging method that writes the provided text, followed by a new
* line, to standard output.
*
* @param s The specified text to write.
*/
void wrl(char *s, ...);

/**
* A static logging method that writes the provided text to standard output.
*
* @param s The specified text to write.
*/
void wr(char *s, ...);

/**
* A static logging method that writes the provided text, followed by a new
* line, to standard error.
*
* @param s The specified text to write.
*/
void wrlErr(char *s, ...);
