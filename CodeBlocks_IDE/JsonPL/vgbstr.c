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

#ifndef vgbstr_h
    #include "vgbstr.h"
    #define vgbstr_h
#endif // vgbstr_h

#define SANITY_CHECK_LEN 100000
#define SANITY_CHECK_SZ 8

int concat_2_vgb_str(struct vgb_str *dest, const struct vgb_str *src1, const struct vgb_str *src2)
{
    int res = -1;
    res = concat_vgb_str(src1, src2);
    if(!res)
    {
        printf("concat_2_vgb_str: Error: could not concatenate src1 and src2\n");
        return(0);
    }

    res = concat_vgb_str(dest, src1);
    if(!res)
    {
        printf("concat_2_vgb_str: Error: could not concatenate dest and src1\n");
        return(0);
    }
    return(1);
}

int concat_vgb_str(struct vgb_str *dest, const struct vgb_str *src)
{
    if(dest == NULL)
    {
        printf("concat_vgb_str: Error: argument dest is NULL\n");
        return(0);
    };

    if(src == NULL)
    {
        printf("concat_vgb_str: Error: argument str is NULL\n");
        return(0);
    };

    if(dest->str == NULL)
    {
        printf("concat_vgb_str: Error: argument dest->str is NULL\n");
        return(0);
    };

    if(src->str == NULL)
    {
        printf("concat_vgb_str: Error: argument src->str is NULL\n");
        return(0);
    };

    if(dest->str[dest->str_len] != '\0')
    {
        printf("concat_vgb_str: Error: argument dest->str is missing null char\n");
        return(0);
    };

    if(src->str[src->str_len] != '\0')
    {
        printf("concat_vgb_str: Error: argument src->str is missing null char\n");
        return(0);
    };

    int tlen = (dest->str_len + src->str_szof_len);
    char nstr[tlen];
    strcpy(nstr, dest->str);
    strcat(nstr, src->str);
    return init_vgb_str(dest, nstr, tlen, sizeof(nstr[0]));
}

int init_vgb_str(struct vgb_str *vstr, const char *str, const int len, const int sz)
{
    if(vstr == NULL)
    {
        printf("init_vgb_str: Error: argument vstr is NULL\n");
        return(0);
    };

    if(str == NULL)
    {
        printf("init_vgb_str: Error: argument str is NULL\n");
        return(0);
    };

    if(len <= 0)
    {
        printf("init_vgb_str: Error: len cannot be <= zero\n");
        return(0);
    };

    if(len >= SANITY_CHECK_LEN)
    {
        printf("init_vgb_str: Error: len cannot be larger than %d\n", SANITY_CHECK_LEN);
        return(0);
    };

    if(sz <= 0)
    {
        printf("init_vgb_str: Error: sz cannot be <= zero\n");
        return(0);
    };

    if(sz >= SANITY_CHECK_SZ)
    {
        printf("init_vgb_str: Error: sz cannot be larger than %d\n", SANITY_CHECK_SZ);
        return(0);
    };

    if(str[len - 1] != '\0')
    {
        printf("init_vgb_str: Error: argument str is missing null char\n");
        return(0);
    };

    printf("Found %d %d\n", len, sz);
    int v0 = (sz * len);
    if(v0 >= SANITY_CHECK_LEN)
    {
        printf("init_vgb_str: Error: allocation amount %d exceeded the maximum allowed amount %d\n", v0, SANITY_CHECK_LEN);
        return(0);
    };

    if(vstr->str != NULL && vstr->str_len > 0)
    {
        //printf("===================FREE MEMORY");
        free((*vstr).str);
    }
    /*
    else
    {
        printf("===================DON'T FREE MEMORY");
    }
    */

    vstr->str = (char *)malloc(v0);
    if(vstr->str != NULL)
    {
        int v1 = (sizeof(*(*vstr).str) * len);
        int v2 = (sz * len);
        if(v1 == v2)
        {
            printf("init_vgb_str: Success! %d bytes of memory allocated!\n", (int)(sizeof(*(*vstr).str) * len));
            strcpy(vstr->str, str);
        }
        else
        {
            printf("init_vgb_str: Error: expected amount %d did not match allocated amount %d\n", v2, v1);
            return(0);
        };
    }
    else
    {
        printf("init_vgb_str: Error: Could not allocate memory");
        return(0);
    };

    vstr->str_itm_len = sizeof(*(*vstr).str);
    vstr->str_len = strlen(vstr->str);
    vstr->str_szof_len = vstr->str_len + 1;

    /*
    //Use to print details about the vgb_str
    char *t;
    int cnt = 0;
    for (t = (*vstr).str; cnt < vstr->str_szof_len; t++, cnt++)
    {
        if((int)*t == (int)0)
        {
            printf("%c %d %d %d\n", '\\0', *((*vstr).str + cnt), cnt, *t);
        }
        else
        {
            printf("%c %d %d %d\n", *t, *((*vstr).str + cnt), cnt, *t);
        };
    };
    */

    if(*((*vstr).str + vstr->str_len) != '\0')
    {
        printf("init_vgb_str: Error: Could not find string termination character");
        return(0);
    };
    return(1);
}

void print_vgb_str(struct vgb_str *vstr)
{
    printf("vgb_str: str: %s, str_itm_len: %d, str_len: %d, str_szof_len: %d\n", vstr->str, vstr->str_itm_len, vstr->str_len, vstr->str_szof_len);
}


