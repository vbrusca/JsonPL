//STD INCLUDES
#ifndef stdarg_h
    #include <stdlib.h>
    #define stdlib_h
#endif // stdarg_h

#ifndef stdio_h
    #include <stdio.h>
    #define stdio_h
#endif // stdio_h

//VGB INCLUDES
#ifndef vgb_file_unloader_h
    #include "vgb_file_unloader.h"
    #define vgb_file_unloader_h
#endif // vgb_file_unloader_h

/**
* A static method that writes the specified string to the target destination
* file.
*
* @param file The file to write the data to.
* @param str The string to write to the file.
* @throws IOException An IO exception is thrown if there is a file error.
*/
int WriteStr(char *file, char *str)
{
    if(file == NULL)
    {
        return 0;
    }

    if(str == NULL)
    {
        return 0;
    }

    FILE *f = fopen(file, "w");
    if(f == NULL)
    {
        return 0;
    }

    fprintf(f, "%s", str);
    fclose(f);
    return 1;
}

/**
* A static method that writes the specified list of strings to the target
* destination file.
*
* @param file The file to write the data to.
* @param strs The list of strings to write to the file.
* @throws IOException An IO exception is thrown if there is a file error.
*/
int WriteList(char *file, struct vgb_list *strs)
{
    if(file == NULL)
    {
        return 0;
    }

    if(strs == NULL)
    {
        return 0;
    }

    if(strs->length <= 0)
    {
        return 0;
    }

    iteration_reset(strs);
    int len = strs->length;
    int cnt = 0;
    struct vgb_entry *itm;

    FILE *f = fopen(file, "w");
    if(f == NULL)
    {
        return 0;
    }

    while((itm = iteration_next(strs)) != NULL && cnt < len)
    {
        struct vgb_str *v = (struct vgb_str *)itm->value;
        fprintf(f, "%s", v->str);
        cnt += 1;
    }
    fclose(f);
    return 1;
}

/**
* A static method that writes the specified byte array to the target
* destination file.
*
* @param file The file to write the data to.
* @param buff The byte array to write to the file.
* @throws IOException An IO exception is thrown if there is a file error.
*/
int WriteBuffer(char *file, char *buff)
{
    if(file == NULL)
    {
        return 0;
    }

    if(buff == NULL)
    {
        return 0;
    }

    FILE *f = fopen(file, "wb");
    if(f == NULL)
    {
        return 0;
    }

    int len = sizeof(buff);
    int sz = sizeof(buff + 1);
    fwrite(buff, len, sz, f);
    fclose(f);
    return 1;
}
