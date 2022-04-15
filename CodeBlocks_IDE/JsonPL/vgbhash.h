#ifndef vgblist_h
    #include "vgblist.h"
    #define vgblist_h
#endif // vgblist_h

#ifndef vgbstr_h
    #include "vgbstr.h"
    #define vgbstr_h
#endif // vgbstr_h

#ifndef VGB_HASH_ID
    #define VGB_HASH_ID 173
#endif //VGB_HASH_ID

#ifndef DEFAULT_HASH_SIZE
    #define DEFAULT_HASH_SIZE 1024
#endif // DEFAULT_HASH_SIZE

#ifndef HASH_ADJUST
    #define HASH_ADJUST 7919
#endif // HASH_ADJUST

/**
* A structure used to hold a hash map using an array of vgb_list pointers.
*/
struct vgb_hash
{
    int id;
    int hint;
    struct vgb_list *data[DEFAULT_HASH_SIZE];
    int length;
};

/**
 *
 */
int hash_func_int(const int v);

/**
 *
 */
int hash_func_str(const char *str, const int len);

/**
 *
 */
int hash_func_vstr(const struct vgb_str *vstr);

/**
 *
 */
int init_vgb_hash(struct vgb_str *vstr);

/**
 *
 */
int init_vgb_hash_entry(struct vgb_hash *hsh, const int idx);

/**
 *
 */
int presort(int *arr, const int len);

/**
 *
 */
int quicks(int *arr, const int alen, const int sidx, const int eidx);

/**
 *
 */
int binsearch(int *sorted, const int sidx, const int eidx, const int target);
