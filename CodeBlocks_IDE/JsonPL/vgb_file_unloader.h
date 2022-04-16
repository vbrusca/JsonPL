//VGB INCLUDES
#ifndef vgbstr_h
    #include "vgbstr.h"
    #define vgbstr_h
#endif // vgbstr_h

#ifndef vgblist_h
    #include "vgblist.h"
    #define vgblist_h
#endif // vgblist_h

/**
* A static method that writes the specified string to the target destination
* file.
*
* @param file The file to write the data to.
* @param str The string to write to the file.
* @throws IOException An IO exception is thrown if there is a file error.
*/
int WriteStr(char *file, char *str);

/**
* A static method that writes the specified list of strings to the target
* destination file.
*
* @param file The file to write the data to.
* @param strs The list of strings to write to the file.
* @throws IOException An IO exception is thrown if there is a file error.
*/
int WriteList(char *file, struct vgb_list *strs);

/**
* A static method that writes the specified byte array to the target
* destination file.
*
* @param file The file to write the data to.
* @param buff The byte array to write to the file.
* @throws IOException An IO exception is thrown if there is a file error.
*/
int WriteBuffer(char *file, char *buff);
