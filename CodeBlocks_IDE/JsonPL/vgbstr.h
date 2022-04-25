#ifndef VGB_STR_ID
    #define VGB_STR_ID 123
#endif //VGB_STR_ID

#ifndef SANITY_CHECK_LEN
    #define SANITY_CHECK_LEN 100000
#endif // SANITY_CHECK_LEN

#ifndef SANITY_CHECK_SZ
    #define SANITY_CHECK_SZ 8
#endif // SANITY_CHECK_SZ

/**
 * A structure used to hold information about a string of characters.
 */
struct vgb_str
{
    int id;                 //The unique id of the vgb_str class
    int hint;               //A hint field with no predetermined use
    char *str;              //The char *str that this struct wraps
    int str_len ;           //The length of the string, not including \0
    int str_szof_len;       //The length of the string including \0
    int str_itm_len;        //The size of one item of the string, should be 1
};

/**
 * TODO
 */
int vgb_str_indexof(const struct vgb_str *str, const char* target);

/**
 * TODO
 */
void vgb_str_cleanup(struct vgb_str **str);

/**
 * TODO
 */
char *vgb_str_contains(const struct vgb_str *str, const char* target);

/**
 * TODO
 */
int vgb_str_lower(struct vgb_str *str);

/**
 * TODO
 */
int vgb_str_upper(struct vgb_str *str);

/**
 * TODO
 */
int vgb_str_split(const struct vgb_str *str, const char *split_on, const int **array_len, struct vgb_str** nstr);

/**
 * TODO
 */
int vgb_str_substr(const struct vgb_str *str, const int idx, const int len, struct vgb_str** nstr);

/**
 * Name: set_vgb_str_c
 * Desc: Sets the specified character of a vgb_str.
 * Arg1: vgb_str *str(target string)
 * Arg2: const int idx(the index to set the character for)
 * Arg3: const char *c(the new character to use to update the target string)
 * Returns: {0 | 1}
 */
int vgb_str_set_c(struct vgb_str *str, const int idx, const char *c);

/**
 * Name: get_vgb_str_c
 * Desc: Gets the specified character of a vgb_str.
 * Arg1: vgb_str *str(target string)
 * Arg2: const int idx(the index to get the character for)
 * Arg3: const char *c(the character found at the specified index)
 * Returns: {0 | 1}
 */
int vgb_str_get_c(const struct vgb_str *str, const int idx, char *c);

/**
 * Name: vgb_str_is_err
 * Desc: Determines if the given vgb_str is in an error state.
 * Arg1: vgb_str *str(target string to check)
 * Returns: {0 | 1}
 */
int vgb_str_is_err(const struct vgb_str *str);

/**
 * Name: vgb_str_has_null
 * Desc: Determines if the given vgb_str has a null char at the of it's string.
 * Arg1: vgb_str *str(target string to check)
 * Returns: {0 | 1}
 */
int vgb_str_has_null(const struct vgb_str *str);

/**
 * Name: vgb_str_is_null
 * Desc: Determines if the given vgb_str is null.
 * Arg1: vgb_str *str(target string)
 * Returns: {0 | 1}
 */
int vgb_str_is_null(const struct vgb_str* str);

/**
 * Name: get_def_vgb_str
 * Desc: Creates a new vgb_str default instance.
 * Returns: vgb_str *
 */
struct vgb_str *vgb_str_get_def(void);

/**
 * Name: get_spc_vgb_str
 * Desc: Creates a new vgb_str instance with one character of space.
 * Returns: vgb_str *
 */
struct vgb_str *vgb_str_get_spc(void);

/**
 * Name: concat_2_vgb_str
 * Desc: Concatenate 2 vgb_str instances to a third instance.
 * Arg1: vgb_str *str(destination string)
 * Arg2: vgb_str *str(source string 1)
 * Arg3: vgb_str *str(source string 3)
 * Returns: {0 | 1}
 */
int vgb_str_concat_2(struct vgb_str *dest, const struct vgb_str *src1, const struct vgb_str *src2);

/**
 * Name: concat_vgb_str
 * Desc: Concatenate 2 vgb_str instances together.
 * Arg1: vgb_str *str(destination string)
 * Arg2: vgb_str *str(source string)
 * Returns: {0 | 1}
 */
int vgb_str_concat(struct vgb_str *dest, const struct vgb_str *src);

/**
 * Name: init_vgb_str
 * Desc: Initialize the given vgb_str with the specified char array.
 * Arg1: vgb_str *vstr(target string)
 * Arg2: char *str(source string)
 * Arg2: int len(string length)
 * Arg3: int sz(char data type size in bytes)
 * Returns: {0 | 1}
 */
int vgb_str_init(struct vgb_str *vstr, const char *str, const int len, const int sz);

/**
 * Name: print_vgb_str
 * Desc: Prints the given vgb_str to standard output.
 * Arg1: vgb_str *vstr(target string)
 */
void vgb_str_print(struct vgb_str *str);
