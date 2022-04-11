#ifndef TRUE
    #define TRUE 1
#endif // TRUE

#ifndef FALSE
    #define FALSE 0
#endif // FALSE

#ifndef LOGGING_ON
    #define LOGGING_ON TRUE
#endif // LOGGING_ON

#ifndef NEWLINE_CHAR
    #define NEWLINE_CHAR '\n'
#endif // NEWLINE_CHAR

/**
* A structure used to hold information about memory allocation.
* Used to support a simple memory manager.
*/
struct vgb_mem
{
    int id;
    int hint;
    long int addr;
    int ref_cnt;
    int len;
};

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
