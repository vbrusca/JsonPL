
/**
* A structure used to hold information about memory allocation.
* Used to support a simple memory manager.
*/
struct vgb_mem
{
    int id;             //The unique id of the struct
    int hint;           //An integer value with no specified use
    void *addr;         //The address to track for garbage collection
    int ref_cnt;        //The number of references pointing to this memory address
    int len;            //The length associated with this memory allocation
};

#ifndef constants_h
    #define constants_h
    #include "constants.h"
#endif // constants_h

#ifndef LOGGING_ON
    #define LOGGING_ON TRUE
#endif // LOGGING_ON

#ifndef VGB_MEM_ID
    #define VGB_MEM_ID 163
#endif //VGB_ENTRY_ID

#ifndef vgblist_h
    #include "vgblist.h"
    #define vgblist_h
#endif // vgblist_h

/**
 * Name: safe_ptr
 * Desc: A function that's used to safely assign a pointer. Using this function
 *       registers the pointer assignment with the default memory manager.
 * Arg1: void **ptr_left(The left-hand side of a pointer assignment)
 * Arg2: void **ptr_right(The right-hand side of a pointer assignment)
 */
void safe_ptr(void **ptr_left, void **ptr_right);

/**
 * Name: find_vgb_mem
 * Desc: A function for searching through a vgb_list and finding the specified address storing the found vgb_mem if any.
 * Arg1: const struct vgb_list *lst(the vgb_list to search through)
 * Arg2: void *addr(the address to search for)
 * Arg3: struct vgb_mem **found(the found vgb_mem entry value if any)
 * Returns: {0 | 1}
 */
int find_vgb_mem(const struct vgb_list *lst, void *addr, struct vgb_mem **found);

/**
 * Name: find_vgb_mem
 * Desc: A function to delete the vgb_mem entry, vgb_entry, in the given vgb_list with the specified address.
 * Arg1: const struct vgb_list *lst(the vgb_list to look through to find the specified memory address and delete it)
 * Arg2: void *addr(the address to search for in the specified vgb_list)
 * Returns: {0 | 1}
 */
int del_vgb_mem(const struct vgb_list *lst, void *addr);

/**
 * Name: vgb_mmgr_init
 * Desc: A function that initializes a vgb_mmgr struct for use as the main memory manager.
 * Returns: {0 | 1}
 */
int vgb_mmgr_init(void);

/**
 * Name: vgb_mmgr_cleanup
 * Desc: A function that cleans out the default vgb_mem memory manager
 */
void vgb_mmgr_cleanup(void);

/**
 * Name: vgb_free
 * Desc: A function that wraps the C language free function and checks the reference count of the specified pointer address.
 * Arg1: void *ptr(a pointer to a memory location that is to be freed)
 */
void vgb_free(void *ptr);

/**
 * Name: del_vgb_list_mem
 * Desc: A function that frees up the memory used by each vgb_entry, vgb_mem struct, in the specified list.
 * Arg1: struct vgb_list **lst2(the list to free up memory for)
 * Returns: {0 | 1}
 */
 int del_vgb_list_mem(struct vgb_list **lst2);

/**
 * Name: vgb_malloc
 * Desc: A function that wraps the C language malloc function and allows for tracked memory allocation.
 * Arg1: size_t size(the size of the memory to allocate)
 */
void *vgb_malloc(size_t size);
