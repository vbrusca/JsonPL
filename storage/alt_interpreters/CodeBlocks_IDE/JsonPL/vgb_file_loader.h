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
* A static method that is used to load a file's contents into a list of
* strings.
*
* @param file The target file to load.
* @return A list of strings representing the contents of the file.
* @throws IOException An IO exception is thrown if there is a file error.
*/
int Load(const char *file, struct vgb_list *strs);

/**
* A static method that is used to load a file's contents into a string.
*
* @param file The target file to load.
* @return A string representing the contents of the file.
* @throws IOException An IO exception is thrown if there is a file error.
*/
int LoadStr(const char *file, char *str);

/**
* A static method that is used to load a file's contents into an array of
* bytes.
*
* @param file The target file to load.
* @return A byte array representing the contents of the file.
* @throws IOException An IO exception is thrown if there is a file error.
*/
int LoadBin(const char *file, char *buff);
