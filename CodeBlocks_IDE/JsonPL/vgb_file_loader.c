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
#ifndef constants_h
    #define constants_h
    #include "constants.h"
#endif // constants_h

#ifndef vgb_file_loader_h
    #include "vgb_file_loader.h"
    #define vgb_file_loader_h
#endif // vgb_file_loader_h

/**
* A static method that is used to load a file's contents into a list of
* strings.
*
* @param file The target file to load.
* @return A list of strings representing the contents of the file.
* @throws IOException An IO exception is thrown if there is a file error.
*/
int Load(const char *file, struct vgb_list *strs)
{
    if(file == NULL)
    {
        return 0;
    }

    if(strs == NULL)
    {
        return 0;
    }

    int in_line = FALSE;
    int pos = 0;
    int prev_pos = 0;
    int size = 0;
    char ch;
    int cnt = 0;

    FILE *f = fopen(file, "w");
    if(f == NULL)
    {
        return 0;
    }

    //scan for lines
    do
    {
        ch = fgetc(f);
        pos += 1;
        if (ch == '\n')
        {
            //increase to account for \n
            pos += 1;
            //\0 is handled automatically by vgb_str
            size = (pos - prev_pos);
            //TODO: copy sub array of chars into char * for vgb_str entry to vgb_list strs

            printf("Load: found string at index %d with length %d starting at pos %d\n", cnt, size, pos);

            //store starting position for this line and reset line char count
            prev_pos = pos;
            cnt +=  1;
            pos = 0;
            in_line = FALSE;
        }
        else
        {
            in_line = TRUE;
        }
    } while (ch != EOF);

    if(in_line)
    {
        in_line = FALSE;
    }

    fclose(f);
    return 1;
}

/**
* A static method that is used to load a file's contents into a string.
*
* @param file The target file to load.
* @return A string representing the contents of the file.
* @throws IOException An IO exception is thrown if there is a file error.
*/
int LoadStr(const char *file, char *str)
{
    /*
    FILE *fp;
    long lSize;
    char *buffer;

    fp = fopen ("blah.txt", "rb");
    if(!fp)
    {
        perror("blah.txt");
        exit(1);
    }

    fseek(fp, 0L, SEEK_END);
    lSize = ftell(fp);
    rewind(fp);

    //allocate memory for entire content
    buffer = calloc(1, lSize + 1);
    if(!buffer)
    {
        fclose(fp);
        fputs("memory alloc fails", stderr);
        exit(1);
    }

    //copy the file into the buffer
    if(1 != fread(buffer, lSize, 1, fp))
    {
        fclose(fp);
        free(buffer);
        fputs("entire read fails", stderr);
        exit(1);
    }

    //do your work here, buffer is a string contains the whole text
    fclose(fp);
    free(buffer);
    */
    return NULL;
}

/**
* A static method that is used to load a file's contents into an array of
* bytes.
*
* @param file The target file to load.
* @return A byte array representing the contents of the file.
* @throws IOException An IO exception is thrown if there is a file error.
*/
int LoadBin(const char *file, char *buff)
{
    return NULL;
}
