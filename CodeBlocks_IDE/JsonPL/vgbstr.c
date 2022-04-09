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

//VGB INCLUDES
#ifndef vgbstr_h
    #include "vgbstr.h"
    #define vgbstr_h
#endif // vgbstr_h

#ifndef vgbutil_h
    #include "vgbutil.h"
    #define vgbutil_h
#endif // vgbutil_h

/*
*
*/
int set_vgb_c(struct vgb_str *str, const int idx, const char *c)
{
    if(vgb_is_null(str))
    {
        printf("set_vgb_c: Error: vgb_str argument is NULL\n");
        return(0);
    };

    if(vgb_is_err(str))
    {
        printf("set_vgb_c: Error: vgb_str argument is ERR\n");
        return(0);
    };

    if(idx < str->str_len && idx >= 0)
    {
        *((*str).str + idx) = *c;
        printf("set_vgb_c: set char at idx %d to %c\n", idx, *c);
        return(1);
    }
    else
    {
        return(0);
    };
};

/*
*
*/
int get_vgb_c(const struct vgb_str *str, const int idx, char *c)
{
    if(vgb_is_null(str))
    {
        printf("get_vgb_c: Error: vgb_str argument is NULL\n");
        return(0);
    };

    if(vgb_is_err(str))
    {
        printf("get_vgb_c: Error: vgb_str argument is ERR\n");
        return(0);
    };

    if(idx < str->str_len && idx >= 0)
    {
        //char lc = *(str->str + idx);
        char lc = *((*str).str + idx);
        printf("get_vgb_c: get char %c at idx %d\n", lc, idx);
        *c = lc;
        return(1);
    }
    else
    {
        return(0);
    };
};

/*
*
*/
int vgb_is_err(const struct vgb_str *str)
{
    if(str == NULL)
    {
        return(1);
    }
    else
    {
        if(str->id != VGB_STR_ID)
        {
            return(1);
        }
        else if(str->str == NULL)
        {
            if(str->str_len != -1 || str->str_szof_len != -1 || str->str_itm_len != -1)
            {
                 return(1);
            }
            else
            {
                return(0);
            }
        }
        else
        {
            if(str->str_len == -1 || str->str_szof_len == -1 || str->str_itm_len != 1)
            {
                return(1);
            }
            else
            {
                int l = strlen(str->str);
                if(l != str->str_len || (l + 1) != str->str_szof_len)
                {
                    return(1);
                }
                else
                {
                    return(0);
                }
            }
        }
    }
}

/*
*
*/
int vgb_is_null(const struct vgb_str *str)
{
    if(str == NULL)
    {
        return(1);
    }
    else
    {
        if(str->str == NULL)
        {
            return(1);
        }
    }
    return(0);
}

/*
*
*/
struct vgb_str *get_def_vgb_str()
{
    struct vgb_str *def = malloc(sizeof(struct vgb_str));
    def->id = VGB_STR_ID;
    def->str = NULL;
    def->str_itm_len = -1;
    def->str_len = -1;
    def->str_szof_len = -1;
    return def;
}

/*
*
*/
struct vgb_str *get_spc_vgb_str()
{
    struct vgb_str *def = get_def_vgb_str();
    char spc[] = " ";
    int res;
    res = init_vgb_str(def, (char *)spc, sizeof(spc), sizeof(char));
    if(res != 1)
    {
        printf("get_spc_vgb_str: Error: Could not initialize vgb_str");
        return(NULL);
    }
    return def;
}

/*
*
*/
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

/*
*
*/
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
};

/*
*
*/
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
    vstr->id = VGB_STR_ID;

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
};

/*
*
*/
void print_vgb_str(struct vgb_str *vstr)
{
    printf("vgb_str: id: %d, str: %s, str_itm_len: %d, str_len: %d, str_szof_len: %d\n", vstr->id, vstr->str, vstr->str_itm_len, vstr->str_len, vstr->str_szof_len);
};


