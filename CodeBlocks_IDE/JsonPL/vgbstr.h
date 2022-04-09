
#ifndef VGB_STR_ID
    #define VGB_STR_ID 123
#endif //VGB_STR_ID

#ifndef SANITY_CHECK_LEN
    #define SANITY_CHECK_LEN 100000
#endif // SANITY_CHECK_LEN

#ifndef SANITY_CHECK_SZ
    #define SANITY_CHECK_SZ 8
#endif // SANITY_CHECK_SZ

/*
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

/*
*
*/
int set_vgb_c(struct vgb_str *str, const int idx, const char *c);

/*
*
*/
int get_vgb_c(const struct vgb_str *str, const int idx, char *c);

/*
*
*/
int vgb_is_err(const struct vgb_str *str);

/*
*
*/
int vgb_is_null(const struct vgb_str* str);

/*
*
*/
struct vgb_str *get_def_vgb_str();

/*
*
*/
struct vgb_str *get_spc_vgb_str();

/*
*
*/
int init_vgb_str(struct vgb_str *vstr, const char *str, const int len, const int sz);

/*
*
*/
void print_vgb_str(struct vgb_str *vstr);

/*
*
*/
int concat_vgb_str(struct vgb_str *dest, const struct vgb_str *src);

/*
*
*/
int concat_2_vgb_str(struct vgb_str *dest, const struct vgb_str *src1, const struct vgb_str *src2);
