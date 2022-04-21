#ifndef VGB_LIST_ID
    #define VGB_LIST_ID 133
#endif //VGB_LIST_ID

#ifndef VGB_ENTRY_ID
    #define VGB_ENTRY_ID 143
#endif //VGB_ENTRY_ID

/**
 * A structure used to hold a linked list of vgb_entry instances.
 */
struct vgb_list
{
    int id;
    int hint;
    struct vgb_entry *head;
    struct vgb_entry *tail;
    int length;
    int current_idx;
    struct vgb_entry *current_entry;
};

/**
 * A structure used to hold the basic data of a linked list entry.
 */
struct vgb_entry
{
    int id;
    int hint;
    int index;
    void *value;
    struct vgb_entry *next;
};

/**
 * Name: sync_vgb_list_indexes
 * Desc: Syncs the index field of a vgb_list's entries.
 * Arg1: vgb_list *lst(target list)
 * Returns: {0 | 1}
 */
int sync_vgb_list_indexes(struct vgb_list *lst);

/**
 * Name: print_vgb_list_entries
 * Desc: Prints the given vgb_list's entries to standard output.
 * Arg1: vgb_list *lst(target list)
 */
void print_vgb_list_entries(const struct vgb_list *lst);

/**
 * Name: print_vgb_list
 * Desc: Prints the given vgb_list to standard output.
 * Arg1: vgb_list *lst(target list)
 */
void print_vgb_list(struct vgb_list *lst);

/**
 * Name: print_vgb_entry
 * Desc: Prints the given vgb_entry to standard output.
 * Arg1: vgb_entry *itm(target list entry)
 */
void print_vgb_entry(struct vgb_entry *itm);

/**
 * Name: create_vgb_list
 * Desc: Creates a new vgb_list.
 * Returns: vgb_list *lst(a newly allocated vgb_list)
 */
struct vgb_list *create_vgb_list(void);

/**
 * Name: del_vgb_list
 * Desc: Attempts to free a vgb_list and attempts to free each entry in the list.
 * Returns: {0 | 1}
 */
int del_vgb_list(struct vgb_list **lst2);

/**
 * Name: del_vgb_entry
 * Desc: Attempts to free a vgb_entry at the specified list index.
 * Arg1: const struct vgb_list *lst(the vgb_list to delete the entry from)
 * Arg2: const int idx(the index of the vgb_entry, in the given list, to delete)
 * Returns: {0 | 1}
 */
int del_vgb_entry(const struct vgb_list *lst, const int idx);

/**
 * TODO
 */
int del_vgb_entry_after(const struct vgb_list *lst, const int idx);

/**
 * Name: create_vgb_entry_adv
 * Desc: Allocates a new vgb_entry instance and returns it.
 * Arg1: int idx(the index to use for the new instance)
 * Arg2: const void *val(the default value to use for the vgb_entry)
 * Arg3: int use_vgb_mm(an int indicating to use 1 = vgb_malloc or other = malloc)
 * Returns: {0 | 1}
 */
struct vgb_entry *create_vgb_entry_adv(const int idx, const void *val, int use_vgb_mm);

/**
 * Name: create_vgb_entry
 * Desc: Allocates a new vgb_entry instance and returns it.
 * Arg1: int idx(that index to use for the new instance)
 * Arg2: const void *val(the default value to use for the vgb_entry.)
 * Returns: {0 | 1}
 */
struct vgb_entry *create_vgb_entry(const int idx, const void *val);

/**
 * Name: get_def_vgb_entry
 * Desc: Allocates a new vgb_entry instance and returns it.
 * Arg1: int idx(that index to use for the new instance)
 * Arg2: const void *val(the default value to use for the vgb_entry.)
 * Returns: {0 | 1}
 */
struct vgb_entry *get_def_vgb_entry(void);

/**
 * Name: find_vgb_entry
 * Desc: Searches through a vgb_list for an entry with the given value then points the found argument to the found vgb_entry.
 * Arg1: const struct vgb_list *lst(the vgb_list to search for the given value)
 * Arg2: void *value(the value to search for)
 * Arg3: struct vgb_entry **found(a pointer to use to point to the found vgb_entry if any)
 * Returns: {0 | 1}
 */
int find_vgb_entry(const struct vgb_list *lst, void *value, struct vgb_entry **found);

/**
 * Name: get_vgb_entry
 * Desc: Gets the vgb_entry in the specified vgb_list and sets the found argument to point to the vgb_entry.
 * Arg1: const struct vgb_list *lst(the vgb_list to search)
 * Arg2: const int idx(the index of the vgb_entry to get)
 * Arg3: struct vgb_entry **found(the pointer to the pointer to the found vgb_entry)
 * Returns: {0 | 1}
 */
int get_vgb_entry(const struct vgb_list *lst, const int idx, struct vgb_entry **found);

/**
 * TODO
 */
int get_vgb_entry_after(const struct vgb_list *lst, const int idx, struct vgb_entry **found);

/**
 * Name: set_vgb_entry
 * Desc: Sets the vgb_entry in the specified vgb_list at the given index.
 * Arg1: struct vgb_list *lst(the vgb_list to search)
 * Arg2: const int idx(the index of the vgb_entry to set)
 * Arg3: struct vgb_entry *new_entry(the new vgb_entry to place at the specified index or at zero if the list is empty)
 * Returns: {0 | 1}
 */
int set_vgb_entry(struct vgb_list *lst, const int idx, struct vgb_entry *new_entry);

/**
 * Name: set_vgb_entry_after
 * Desc: Sets the vgb_entry in the specified vgb_list after the given index.
 * Arg1: struct vgb_list *lst(the vgb_list to search)
 * Arg2: const int idx(the index of the vgb_entry to set)
 * Arg3: struct vgb_entry *new_entry(the new vgb_entry to place immediately after the specified index or at zero if the list is empty)
 * Returns: {0 | 1}
 */
int set_vgb_entry_after(struct vgb_list *lst, const int idx, struct vgb_entry *new_entry);

/**
 * Name: vgb_list_add
 * Desc: Adds the specified vgb_entry to the end of the specified list.
 * Arg1: struct vgb_list *lst(the target vgb_list)
 * Arg2: struct vgb_entry *new_entry(the new vgb_entry to append to the specified vgb_list)
 * Returns: {0 | 1}
 */
int vgb_list_add(struct vgb_list *lst, struct vgb_entry *new_entry);

/**
 * Name: iteration_reset
 * Desc: Resets the internal iteration fields of the given vgb_list struct.
 * Arg1: struct vgb_list *lst(the vgb_list to reset the iteration fields for)
 */
void iteration_reset(struct vgb_list *lst);

/**
 * Name: iteration_next
 * Desc: Moves the internal list iteration ahead one position.
 * Arg1: struct vgb_list *lst(the vgb_list to advance the iteration fields for)
 */
struct vgb_entry *iteration_next(struct vgb_list *lst);
