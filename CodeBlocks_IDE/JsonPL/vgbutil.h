
#ifndef TRUE
    #define TRUE 1
#endif // TRUE

#ifndef FALSE
    #define FALSE 0
#endif // FALSE


struct vgb_mem
{
    int id;
    int hint;
    long int addr;
    int ref_cnt;
    int len;
};
