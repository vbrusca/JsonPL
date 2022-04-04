
struct vgb_str {
    char *str;
    int str_len ;
    int str_szof_len;
    int str_itm_len;
};

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
