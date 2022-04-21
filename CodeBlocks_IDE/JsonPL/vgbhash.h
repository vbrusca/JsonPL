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

#ifndef VGB_HASH_BLOCK_ID
    #define VGB_HASH_BLOCK_ID 183
#endif //VGB_HASH_BLOCK_ID

#ifndef DEFAULT_HASH_BLOCK_SIZE
    #define DEFAULT_HASH_BLOCK_SIZE 1024
#endif // DEFAULT_HASH_SIZE

#ifndef HASH_ADJUST
    #define HASH_ADJUST 7919
#endif // HASH_ADJUST

/**
 * A structure used to hold a hash map using a vgb_list of vgb_hash_block entries.
 */
struct vgb_hash
{
    int id;                     //A unique id for this struct
    int hint;                   //An integer with no predetermined use
    struct vgb_list *data;      //A list of vgb_entry structs holding pointers to vgb_hash_block structs
    int hash_total;             //The total hash value for this hash, block_count * DEFAULT_HASH_BLOCK_SIZE
    int block_count;            //The total number of hash blocks in this hash
    int grow_prct_full;         //The full percentage to start growing the hash
    int grow_prct_collision;    //The collision percentage to start growing the hash
};

/**
 * TODO
 */
struct vgb_hash_block
{
    int id;                                                 //A unique id for this struct
    int hint;                                               //An integer with no predetermined use
    struct vgb_list *block_data[DEFAULT_HASH_BLOCK_SIZE];
    int prct_full;
    int full_count;
    int prct_collision;
    int collision_count;
};

/**
 * TODO
 */
int get_hash_total(struct vgb_hash *hsh);

/**
 * TODO
 */
int hash_func_int(const int v);

/**
 * TODO
 */
int hash_func_str(const char *str, const int len);

/**
 * TODO
 */
int hash_func_vstr(const struct vgb_str *vstr);

//HASH MANAGEMENT FUNCTIONS
/**
 * TODO
 */
int init_vgb_hash(struct vgb_str *vstr);

/**
 * TODO
 */
int init_vgb_hash_entry(struct vgb_hash *hsh, struct vgb_hash_block *hsh_blk);

/**
 * TODO
 */
int add_vgb_hash_entry(struct vgb_hash *hsh, struct vgb_hash_block *hsh_blk);

/**
 * TODO
 */
int get_vgb_hash_entry(const struct vgb_hash *hsh, const int idx, struct vgb_hash_block **found);

/**
 * TODO
 */
int del_vgb_hash_entry(struct vgb_hash *hsh, const int idx, struct vgb_hash_block **found);

/**
 * TODO
 */
void print_vgb_hash(const struct vgb_hash *hsh);

//HASH BLOCK MANAGEMENT FUNCTIONS
/**
 * TODO
 */
int init_vgb_hash_block_entry(struct vgb_hash_block *hsh_blk);

/**
 * TODO
 */
int add_vgb_hash_block_entry(struct vgb_hash_block *hsh_blk, const int idx, void *val);

/**
 * TODO
 */
int get_vgb_hash_block_entry(struct vgb_hash_block *hsh_blk, const int idx, void *val);

/**
 * TODO
 */
int del_vgb_hash_block_entry(struct vgb_hash *hsh, const int idx);

/**
 * TODO
 */
int del_vgb_hash_block_entry_collision(struct vgb_hash *hsh, const int idx, const int coll_idx);

/**
 * TODO
 */
int count_collisions_vgb_hash_block(struct vgb_hash_block *hsh_blk);

/**
 * TODO
 */
void print_vgb_hash_block(const struct vgb_hash_block *hsh_blk);
