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

#ifndef vgbmem_h
    #include "vgbmem.h"
    #define vgbmem_h
#endif // vgbmem_h

#ifndef vgb_logger_h
    #include "vgb_logger.h"
    #define vgb_logger_h
#endif // vgb_logger_h

#ifndef null_char_var
    #define null_char_var
    struct vgb_str VGB_STR_NULL_CHAR = {VGB_STR_ID, 1, "", 0, 1, 1};
#endif // null_char_var

/**
 * TODO
 */
int vgb_str_indexof(const struct vgb_str *str, const char* target)
{
    if(str == NULL)
    {
        printf("vgb_str_contains: Error: str argument is NULL\n");
        return NULL;
    }

    if(target == NULL)
    {
        printf("vgb_str_contains: Error: target argument is NULL\n");
        return NULL;
    }

    int idx = -1;
    char *ptr = strstr(str->str, target);
    for(int i = 0; i < str->str_szof_len; i++)
    {
        if((str->str + i) == ptr)
        {
            idx = i;
        }
    }
    return idx;
}


/**
 * TODO
 */
void vgb_str_cleanup(struct vgb_str **str)
{
    if(str != NULL && (*str) != NULL)
    {
        vgb_free((*str)->str);
        vgb_free((*str));
    }
}

/**
 * TODO
 */
char *vgb_str_contains(const struct vgb_str *str, const char* target)
{
    if(str == NULL)
    {
        printf("vgb_str_contains: Error: str argument is NULL\n");
        return NULL;
    }

    if(target == NULL)
    {
        printf("vgb_str_contains: Error: target argument is NULL\n");
        return NULL;
    }

    return strstr(str->str, target);
}

/**
 * TODO
 */
int vgb_str_lower(struct vgb_str *str)
{
    if(str == NULL)
    {
        printf("vgb_str_lower: Error: str argument is NULL\n");
        return 0;
    }

    str->str = strlwr(str->str);
    return 1;
}

/**
 * TODO
 */
int vgb_str_upper(struct vgb_str *str)
{
    if(str == NULL)
    {
        printf("vgb_str_upper: Error: str argument is NULL\n");
        return 0;
    }

    str->str = strupr(str->str);
    return 1;
}

/**
 * TODO
 */
int vgb_str_split(const struct vgb_str *str, const char *split_on, const int **array_len, struct vgb_str **nstr)
{
    if(str == NULL)
    {
        printf("vgb_str_split: Error: str argument is NULL\n");
        return 0;
    }

    if(split_on == NULL)
    {
        printf("vgb_str_split: Error: split_on argument is NULL\n");
        return 0;
    }

    char *token = NULL;
    int tok_cnt = 0;
    int res = 1;
    int nlen = 0;

    strtok(str->str, split_on);
    tok_cnt += 1;

    //loop through the string to extract all other tokens
    while(token != NULL)
    {
        strtok(str->str, split_on);
        tok_cnt += 1;
    }

    struct vgb_str **tokens = vgb_malloc(tok_cnt);
    token = NULL;
    tok_cnt = 0;

    token = strtok(str->str, split_on);
    tokens[tok_cnt] = vgb_str_get_def();
    nlen = (strlen(token) + 1);
    res = vgb_str_init(tokens[tok_cnt], token, nlen, 1);
    if(!res)
    {
        printf("vgb_str_split: Error: vgb_str_init failed\n");
        return 0;
    }
    tok_cnt += 1;

    //loop through the string to extract all other tokens
    while(token != NULL)
    {
        token = strtok(str->str, split_on);
        tokens[tok_cnt] = vgb_str_get_def();
        nlen = (strlen(token) + 1);
        res = vgb_str_init(tokens[tok_cnt], token, nlen, 1);
        if(!res)
        {
            printf("vgb_str_split: Error: vgb_str_init failed\n");
            return 0;
        }
        tok_cnt += 1;
    }

    *array_len = &tok_cnt;
    *nstr = *tokens;
    return 1;
}

/**
 * TODO
 */
int vgb_str_substr(const struct vgb_str *str, const int idx, const int len, struct vgb_str** nstr)
{
    if(str == NULL)
    {
        printf("vgb_str_substr: Error: str argument is NULL\n");
        return 0;
    }

    if(idx < 0)
    {
        printf("vgb_str_substr: Error: invalid idx argument\n");
        return 0;
    }

    if(len <= 0)
    {
        printf("vgb_str_substr: Error: invalid len argument, less than zero\n");
        return 0;
    }

    if(len >= str->str_szof_len)
    {
        printf("vgb_str_substr: Error: invalid len argument %d vs %d\n", str->str_len, str->str_szof_len);
        return 0;
    }

    int res = 1;
    int nlen = (len + 1);
    char *tstr = vgb_malloc(nlen);
    for(int i = 0; i < len; i++)
    {
        //tstr[i] = str->str[i];
        *(tstr + i) = *((*str).str + i);
    }
    //tstr[len] = '\0';
    *(tstr + len) = '\0';
    //printf("qqq '%s'\n", tstr);

    struct vgb_str *ret = vgb_str_get_def();
    res = vgb_str_init(ret, tstr, nlen, 1);
    if(!res)
    {
        printf("vgb_str_substr: Error: vgb_str_init failed\n");
        return 0;
    }

    *nstr = ret;
    return 1;
}

/**
 * Name: vgb_str_set_c
 * Desc: Sets the specified character of a vgb_str.
 * Arg1: vgb_str *str(target string)
 * Arg2: const int idx(the index to set the character for)
 * Arg3: const char *c(the new character to use to update the target string)
 * Returns: {0 | 1}
 */
int vgb_str_set_c(struct vgb_str *str, const int idx, const char *c)
{
    if(vgb_str_is_null(str))
    {
        printf("vgb_str_set_c: Error: vgb_str argument is NULL\n");
        return 0;
    }

    if(vgb_str_is_err(str))
    {
        printf("vgb_str_set_c: Error: vgb_str argument is ERR\n");
        return 0;
    }

    if(idx < str->str_len && idx >= 0)
    {
        *((*str).str + idx) = *c;
        printf("vgb_str_set_c: set char at idx %d to %c\n", idx, *c);
        return 1;
    }
    else
    {
        return 0;
    }
}

/**
 * Name: vgb_str_get_c
 * Desc: Gets the specified character of a vgb_str.
 * Arg1: vgb_str *str(target string)
 * Arg2: const int idx(the index to get the character for)
 * Arg3: const char *c(the character found at the specified index)
 * Returns: {0 | 1}
 */
int vgb_str_get_c(const struct vgb_str *str, const int idx, char *c)
{
    if(vgb_str_is_null(str))
    {
        printf("vgb_str_get_c: Error: vgb_str argument is NULL\n");
        return 0;
    }

    if(vgb_str_is_err(str))
    {
        printf("vgb_str_get_c: Error: vgb_str argument is ERR\n");
        return 0;
    }

    if(idx < str->str_len && idx >= 0)
    {
        char lc = *((*str).str + idx);
        *c = lc;
        return 1;
    }
    else
    {
        return 0;
    }
}

/**
 * Name: vgb_str_is_err
 * Desc: Determines if the given vgb_str is in an error state.
 * Arg1: vgb_str *str(target string to check)
 * Returns: {0 | 1}
 */
int vgb_str_is_err(const struct vgb_str *str)
{
    if(str == NULL)
    {
        return 1;
    }
    else
    {
        if(str->id != VGB_STR_ID)
        {
            return 1;
        }
        else if(str->str == NULL)
        {
            if(str->str_len != -1 || str->str_szof_len != -1 || str->str_itm_len != -1)
            {
                 return 1;
            }
            else
            {
                return 0;
            }
        }
        else
        {
            if(str->str_len == -1 || str->str_szof_len == -1 || str->str_itm_len != 1)
            {
                return 1;
            }
            else
            {
                int l = strlen(str->str);
                if(l != str->str_len || (l + 1) != str->str_szof_len)
                {
                    return 1;
                }
                else
                {
                    return 0;
                }
            }
        }
    }
}

/**
 * Name: vgb_str_has_null
 * Desc: Determines if the given vgb_str has a null char at the of it's string.
 * Arg1: vgb_str *str(target string to check)
 * Returns: {0 | 1}
 */
int vgb_str_has_null(const struct vgb_str *str)
{
    if(vgb_str_is_err(str))
    {
        return FALSE;
    }

    if(str->str[str->str_len] == '\0')
    {
        return TRUE;
    }

    return FALSE;
}

/**
 * Name: vgb_str_is_null
 * Desc: Determines if the given vgb_str is null.
 * Arg1: vgb_str *str(target string)
 * Returns: {0 | 1}
 */
int vgb_str_is_null(const struct vgb_str *str)
{
    if(str == NULL)
    {
        return 1;
    }
    else
    {
        if(str->str == NULL)
        {
            return 1;
        }
    }
    return 0;
}

/**
 * Name: get_def_vgb_str
 * Desc: Creates a new vgb_str default instance.
 * Returns: vgb_str *
 */
struct vgb_str *vgb_str_get_def(void)
{
    struct vgb_str *def = vgb_malloc(sizeof(struct vgb_str));
    def->id = VGB_STR_ID;
    def->str = NULL;
    def->str_itm_len = -1;
    def->str_len = -1;
    def->str_szof_len = -1;
    return def;
}

/**
 * Name: get_spc_vgb_str
 * Desc: Creates a new vgb_str instance with one character of space.
 * Returns: vgb_str *
 */
struct vgb_str *vgb_str_get_spc(void)
{
    struct vgb_str *def = vgb_str_get_def();
    char spc[] = " ";
    int res;
    res = vgb_str_init(def, (char *)spc, sizeof(spc), sizeof(char));
    if(res != 1)
    {
        printf("get_spc_vgb_str: Error: Could not initialize vgb_str");
        return(NULL);
    }
    return def;
}

/**
 * Name: concat_2_vgb_str
 * Desc: Concatenate 2 vgb_str instances to a third instance.
 * Arg1: vgb_str *str(destination string)
 * Arg2: vgb_str *str(source string 1)
 * Arg3: vgb_str *str(source string 3)
 * Returns: {0 | 1}
 */
int vgb_str_concat_2(struct vgb_str *dest, const struct vgb_str *src1, const struct vgb_str *src2)
{
    int res = -1;
    res = vgb_str_concat((struct vgb_str *)src1, (struct vgb_str *)src2);
    if(!res)
    {
        printf("concat_2_vgb_str: Error: could not concatenate src1 and src2\n");
        return 0;
    }

    res = vgb_str_concat(dest, src1);
    if(!res)
    {
        printf("concat_2_vgb_str: Error: could not concatenate dest and src1\n");
        return 0;
    }
    return 1;
}

/**
 * Name: concat_vgb_str
 * Desc: Concatenate 2 vgb_str instances together.
 * Arg1: vgb_str *str(destination string)
 * Arg2: vgb_str *str(source string)
 * Returns: {0 | 1}
 */
int vgb_str_concat(struct vgb_str *dest, const struct vgb_str *src)
{
    if(dest == NULL)
    {
        printf("concat_vgb_str: Error: argument dest is NULL\n");
        return 0;
    }

    if(src == NULL)
    {
        printf("concat_vgb_str: Error: argument str is NULL\n");
        return 0;
    }

    if(dest->str == NULL)
    {
        printf("concat_vgb_str: Error: argument dest->str is NULL\n");
        return 0;
    }

    if(src->str == NULL)
    {
        printf("concat_vgb_str: Error: argument src->str is NULL\n");
        return 0;
    }

    int tlen = (dest->str_len + src->str_szof_len);
    char nstr[tlen];
    strcpy(nstr, dest->str);
    strcat(nstr, src->str);
    return vgb_str_init(dest, nstr, tlen, sizeof(nstr[0]));
}

/**
 * Name: init_vgb_str
 * Desc: Initialize the given vgb_str with the specified char array.
 * Arg1: vgb_str *vstr(target string)
 * Arg2: char *str(source string)
 * Arg2: int len(string length)
 * Arg3: int sz(char data type size in bytes)
 * Returns: {0 | 1}
 */
int vgb_str_init(struct vgb_str *vstr, const char *str, const int len, const int sz)
{
    if(vstr == NULL)
    {
        printf("init_vgb_str: Error: argument vstr is NULL\n");
        return 0;
    }

    if(str == NULL)
    {
        printf("init_vgb_str: Error: argument str is NULL\n");
        return 0;
    }

    if(len <= 0)
    {
        printf("init_vgb_str: Error: len cannot be <= zero\n");
        return 0;
    }

    if(len >= SANITY_CHECK_LEN)
    {
        printf("init_vgb_str: Error: len cannot be larger than %d\n", SANITY_CHECK_LEN);
        return 0;
    }

    if(sz <= 0)
    {
        printf("init_vgb_str: Error: sz cannot be <= zero\n");
        return 0;
    }

    if(sz >= SANITY_CHECK_SZ)
    {
        printf("init_vgb_str: Error: sz cannot be larger than %d\n", SANITY_CHECK_SZ);
        return 0;
    }

    //printf("Found %d %d\n", len, sz);
    int v0 = (sz * len);
    if(v0 >= SANITY_CHECK_LEN)
    {
        printf("init_vgb_str: Error: allocation amount %d exceeded the maximum allowed amount %d\n", v0, SANITY_CHECK_LEN);
        return 0;
    }

    if(vstr->str != NULL && vstr->str_len > 0)
    {
        vgb_free((*vstr).str);
    }

    vstr->str = (char *)vgb_malloc(v0);
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
            return 0;
        }
    }
    else
    {
        printf("init_vgb_str: Error: Could not allocate memory");
        return 0;
    }

    vstr->str_itm_len = sizeof(*(*vstr).str);
    vstr->str_len = strlen(vstr->str);
    vstr->str_szof_len = vstr->str_len + 1;
    vstr->id = VGB_STR_ID;

    if(*((*vstr).str + vstr->str_len) != '\0')
    {
        vgb_str_concat(vstr, &VGB_STR_NULL_CHAR);
        printf("init_vgb_str: Warning: Could not find string termination character, adding it now");
    }
    return 1;
}

/**
 * Name: print_vgb_str
 * Desc: Prints the given vgb_str to standard output.
 * Arg1: vgb_str *vstr(target string)
 */
void vgb_str_print(struct vgb_str *str)
{
    printf("vgb_str: id: %d, str: %s, str_itm_len: %d, str_len: %d, str_szof_len: %d\n", str->id, str->str, str->str_itm_len, str->str_len, str->str_szof_len);
}
