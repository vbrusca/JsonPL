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

#ifndef math_h
    #include <math.h>
    #define math_h
#endif // math_h

//VGB INCLUDES
#ifndef vgbhash_h
    #include "vgbhash.h"
    #define vgbhash_h
#endif // vgbhash_h

#ifndef vgb_logger_h
    #include "vgb_logger.h"
    #define vgb_logger_h
#endif // vgb_logger_h

/**
 * TODO
 */
int hash_func_int(const int v)
{
    int tmp = v;
    if(tmp < 0)
    {
        tmp *= -1;
    }
    tmp = (tmp + HASH_ADJUST) % DEFAULT_HASH_BLOCK_SIZE;
    return tmp;
}

/**
 * TODO
 */
int hash_func_str(const char *str, const int len)
{
    if(str == NULL)
    {
        return -1;
    }

    int v = 0;
    int cnt = 0;
    while(cnt < len)
    {
        v += (int)*(str + cnt);
        cnt += 1;
    }
    return hash_func_int(v);
}

/**
 * TODO
 */
int hash_func_vstr(const struct vgb_str *vstr)
{
    if(vstr == NULL)
    {
        return -1;
    }

    int v = 0;
    int cnt = 0;
    int len = vstr->str_len;
    while(cnt < len)
    {
        v += (int)*(vstr->str + cnt);
        cnt += 1;
    }
    return hash_func_int(v);
}

/**
 * TODO
 */
int init_vgb_hash(struct vgb_str *vstr)
{
    return 0;
}

/**
 * TODO
 */
/*
int init_vgb_hash_entry(struct vgb_hash *hsh, const int idx)
{
    if(hsh == NULL)
    {
        return 0;
    }

    if(idx < 0)
    {
        return 0;
    }
*/
    /*
    if(idx >= hsh->length)
    {
        return 0;
    }

    struct vgb_list *lst = create_vgb_list();
    */

    /*
    printf("0 addr: %p %p, id: %d\n", &lst, lst, lst->id);

    //All of these are the same operation
    *((hsh->data) + idx) = lst;
    printf("1 addr: %p %p, id: %d\n", ((hsh->data) + idx), *((hsh->data) + idx), ((struct vgb_list *)(*((hsh->data) + idx)))->id);

    //double checkS
    printf("1 %d\n", (*((struct vgb_list *)(*((hsh->data) + idx)))).id);

    struct vgb_list *tt = (struct vgb_list *)(*((hsh->data) + idx));
    printf("2 %d\n", (*tt).id);

    *((*hsh).data + idx) = lst;
    printf("2 addr: %p %p, id: %d\n", ((*hsh).data + idx), *((*hsh).data + idx), ((struct vgb_list *)(*((*hsh).data + idx)))->id);

    (hsh->data)[idx] = lst;
    printf("3 addr: %p %p, id: %d\n", &(hsh->data)[idx], (hsh->data)[idx], ((hsh->data)[idx])->id);
    */

    //(hsh->data)[idx] = lst;
//    return 1;
//}
