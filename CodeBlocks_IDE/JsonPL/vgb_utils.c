//STD INCLUDES
#ifndef stdlib_h
    #include <stdlib.h>
    #define stdlib_h
#endif // stdlib_h

#ifndef stdio_h
    #include <stdio.h>
    #define stdio_h
#endif // stdio_h

#ifndef string_h
    #include <string.h>
    #define string_h
#endif // string_h

/**
 * TODO
 */
void print_ptr_info(void *ptr)
{
    printf("Pointer Local Function Address: %p\n", &ptr);
    printf("Pointer Address: %p\n", ptr);
}

/**
 * TODO
 */
void print_ptr_info_str(char *ptr)
{
    print_ptr_info(ptr);
    printf("Pointer Value: %s\n", ptr);
}

/**
 * TODO
 */
void print_ptr_info_int(int *ptr)
{
    print_ptr_info(ptr);
    printf("Pointer Value: %d\n", *ptr);
}

