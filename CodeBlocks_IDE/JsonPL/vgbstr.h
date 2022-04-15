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
    int id;
    int hint;
    char *str;
    int str_len ;
    int str_szof_len;
    int str_itm_len;
};

/**
 * Name: set_vgb_c
 * Desc: Sets the specified character of a vgb_str.
 * Arg1: vgb_str *str(target string)
 * Arg2: const int idx(the index to set the character for)
 * Arg3: const char *c(the new character to use to update the target string)
 * Returns: {0 | 1}
 */
int set_vgb_c(struct vgb_str *str, const int idx, const char *c);

/**
 * Name: get_vgb_c
 * Desc: Gets the specified character of a vgb_str.
 * Arg1: vgb_str *str(target string)
 * Arg2: const int idx(the index to get the character for)
 * Arg3: const char *c(the character found at the specified index)
 * Returns: {0 | 1}
 */
int get_vgb_c(const struct vgb_str *str, const int idx, char *c);

/**
 * Name: vgb_is_err
 * Desc: Determines if the given vgb_str is in an error state.
 * Arg1: vgb_str *str(target string)
 * Returns: {0 | 1}
 */
int vgb_is_err(const struct vgb_str *str);

/**
 * Name: vgb_is_err
 * Desc: Determines if the given vgb_str is null.
 * Arg1: vgb_str *str(target string)
 * Returns: {0 | 1}
 */
int vgb_is_null(const struct vgb_str* str);

/**
 * Name: get_def_vgb_str
 * Desc: Creates a new vgb_str default instance.
 * Returns: vgb_str *
 */
struct vgb_str *get_def_vgb_str(void);

/**
 * Name: get_spc_vgb_str
 * Desc: Creates a new vgb_str instance with one character of space.
 * Returns: vgb_str *
 */
struct vgb_str *get_spc_vgb_str(void);

/**
 * Name: concat_2_vgb_str
 * Desc: Concatenate 2 vgb_str instances to a third instance.
 * Arg1: vgb_str *str(destination string)
 * Arg2: vgb_str *str(source string 1)
 * Arg3: vgb_str *str(source string 3)
 * Returns: {0 | 1}
 */
int concat_2_vgb_str(struct vgb_str *dest, const struct vgb_str *src1, const struct vgb_str *src2);

/**
 * Name: concat_vgb_str
 * Desc: Concatenate 2 vgb_str instances together.
 * Arg1: vgb_str *str(destination string)
 * Arg2: vgb_str *str(source string)
 * Returns: {0 | 1}
 */
int concat_vgb_str(struct vgb_str *dest, const struct vgb_str *src);

/**
 * Name: init_vgb_str
 * Desc: Initialize the given vgb_str with the specified char array.
 * Arg1: vgb_str *vstr(target string)
 * Arg2: char *str(source string)
 * Arg2: int len(string length)
 * Arg3: int sz(char data type size in bytes)
 * Returns: {0 | 1}
 */
int init_vgb_str(struct vgb_str *vstr, const char *str, const int len, const int sz);

/**
 * Name: print_vgb_str
 * Desc: Prints the given vgb_str to standard output.
 * Arg1: vgb_str *vstr(target string)
 */
void print_vgb_str(struct vgb_str *vstr);
