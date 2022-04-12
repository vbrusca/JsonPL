#ifndef TRUE
    #define TRUE 1
#endif // TRUE

#ifndef FALSE
    #define FALSE 0
#endif // FALSE

#ifndef LOGGING_ON
    #define LOGGING_ON TRUE
#endif // LOGGING_ON

#ifndef NEWLINE_CHAR
    #define NEWLINE_CHAR '\n'
#endif // NEWLINE_CHAR

#ifndef VGB_MEM_ID
    #define VGB_MEM_ID 163
#endif //VGB_ENTRY_ID

#ifndef vgblist_h
    #include "vgblist.h"
    #define vgblist_h
#endif // vgblist_h

/**
* A structure used to hold information about memory allocation.
* Used to support a simple memory manager.
*/
struct vgb_mem
{
    int id;
    int hint;
    void *addr;
    int ref_cnt;
    int len;
};

/**
 *
 */
void safe_ptr(void **ptr_left, void **ptr_right);

/**
 *
 */
int find_vgb_mem(const struct vgb_list *lst, void *addr, struct vgb_mem **found);

/**
 *
 */
int del_vgb_mem(const struct vgb_list *lst, void *addr);

/**
 *
 */
int vgb_mmgr_init(void);

/**
 *
 */
void vgb_mmgr_cleanup(void);

/**
 *
 */
void vgb_free(void *ptr);

/**
 *
 */
 int del_vgb_list_mem(struct vgb_list **lst2);

/**
 *
 */
void *vgb_malloc(size_t size);

/**
* A static logging method that writes the provided text, followed by a new
* line, to standard output.
*
* @param s The specified text to write.
*/
void wrl(char *s, ...);

/**
* A static logging method that writes the provided text to standard output.
*
* @param s The specified text to write.
*/
void wr(char *s, ...);

/**
* A static logging method that writes the provided text, followed by a new
* line, to standard error.
*
* @param s The specified text to write.
*/
void wrlErr(char *s, ...);
