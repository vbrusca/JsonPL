
#ifndef TRUE
    #define TRUE 1
#endif // TRUE

#ifndef FALSE
    #define FALSE 0
#endif // FALSE

/*
* A structure used to hold information about memory allocation.
* Used to handle simple memory management.
*/
struct vgb_mem
{
    int id;
    int hint;
    long int addr;
    int ref_cnt;
    int len;
};
