//STD INCLUDES
#ifndef stdarg_h
    #include <stdlib.h>
    #define stdlib_h
#endif // stdarg_h

#ifndef stdio_h
    #include <stdio.h>
    #define stdio_h
#endif // stdio_h

#ifndef stdarg_h
    #include <stdarg.h>
    #define stdarg_h
#endif // stdarg_h

//VGB INCLUDES
#ifndef vgb_logger_h
    #include "vgb_logger.h"
    #define vgb_logger_h
#endif // vgb_logger_h

#ifndef vgbstr_h
    #include "vgbstr.h"
    #define vgbstr_h
#endif // vgbstr_h

#ifndef vgblist_h
    #include "vgblist.h"
    #define vgblist_h
#endif // vgblist_h

int MMGR_INIT = FALSE;
struct vgb_list *MMGR;

/**
 *
 */
int vgb_mmgr_init(void)
{
    MMGR = create_vgb_list();
    MMGR_INIT = TRUE;
    return(1);
}

/**
 *
 */
void vgb_mmgr_cleanup(void)
{
    del_vgb_list_mem(&MMGR);
    MMGR_INIT = FALSE;
    MMGR = NULL;
}

/**
 *
 */
void safe_ptr(void **ptr_left, void **ptr_right)
{
    struct vgb_mem *mm;
    find_vgb_mem(MMGR, *ptr_right, &mm);
    if(mm != NULL)
    {
        mm->ref_cnt += 1;
    };
    *ptr_left = *ptr_right;
};

/**
 *
 */
int del_vgb_mem(const struct vgb_list *lst, void *addr)
{
    if(addr == NULL)
    {
        return(0);
    };

    if(lst == NULL)
    {
        return(0);
    };

    if(lst->length == 0)
    {
        return(0);
    };

    struct vgb_entry *tmp = lst->head;
    struct vgb_entry *tmp2;
    int cnt = 0;
    int len = lst->length;
    struct vgb_mem *mm = tmp->value;

    while(cnt < len && tmp != NULL && mm->addr != addr)
    {
        //printf("del mem->addr %p to addr %p \n", mm->addr, addr);
        tmp2 = tmp;
        tmp = tmp->next;
        mm = tmp->value;
        cnt++;
    };
    cnt--;

    //print_vgb_entry(tmp2);
    //print_vgb_entry(tmp);
    //printf("get_vgb_entry: cnt: %d, idx: %d\n", cnt, idx);

    if(mm != NULL && mm->addr == addr)
    {
        tmp2->next = tmp->next;
        sync_vgb_list_indexes((struct vgb_list *)lst);
        //printf("Address of tmp2: %p\n", tmp2);
        free(tmp);
        printf("get_vgb_mem: Info: cnt, %d, deleted address, %p\n", cnt, tmp);
        return(1);
    }
    else
    {
        printf("get_vgb_mem: Error: cnt, %d, could not find address, %p\n", cnt, addr);
        return(0);
    };
};

/**
 *
 */
int find_vgb_mem(const struct vgb_list *lst, void *addr, struct vgb_mem **found)
{
    if(lst == NULL)
    {
        return(0);
    };

    if(addr == NULL)
    {
        return(0);
    };

    if(lst->length == 0)
    {
        return(0);
    };

    struct vgb_entry *tmp = lst->head;
    int cnt = 0;
    int len = lst->length;
    struct vgb_mem *mm = (struct vgb_mem *)tmp->value;

    while(cnt < len && tmp != NULL && mm->addr != addr)
    {
        //printf("fmem->addr %p to addr %p \n", mm->addr, addr);
        tmp = tmp->next;
        if(tmp != NULL)
        {
            mm = (struct vgb_mem *)tmp->value;
        };
        cnt++;
    };

    if(mm != NULL && mm->addr == addr)
    {
        *found = mm;
        //printf("found!!\n");
        return(1);
    }
    else
    {
        *found = NULL;
        //printf("not found!!\n");
        return(0);
    };
};

/**
 *
 */
void vgb_free(void *ptr)
{
    //printf("vgb_free: AAA\n");
    struct vgb_mem *mm;
    find_vgb_mem(MMGR, ptr, &mm);
    //printf("vgb_free: BBB\n");
    if(mm != NULL)
    {
        mm->ref_cnt -= 1;
        if(mm->ref_cnt <= 0)
        {
            mm->ref_cnt = 0;
            del_vgb_mem(MMGR, mm->addr);
            free(mm->addr);
        };
    };
    //printf("vgb_free: CCC\n");
    ptr = NULL;
    //printf("vgb_free: DDD\n");
};

/**
 *
 */
 int del_vgb_list_mem(struct vgb_list **lst2)
{
    if(lst2 == NULL)
    {
        return(0);
    };

    if(*lst2 == NULL)
    {
        return(0);
    };

    struct vgb_list *lst;
    lst = *lst2;
    struct vgb_entry *tmp = lst->head;
    struct vgb_entry *tmp2;

    int cnt = 0;
    int len = lst->length;

    while(cnt < len && tmp != NULL)
    {
        tmp2 = tmp;
        tmp = tmp->next;
        free(tmp2);
        cnt++;
    };
    free(lst);
    return(1);
}

/**
 *
 */
void *vgb_malloc(size_t size)
{
    void *addr = malloc(size);
    if(addr != NULL && MMGR_INIT == TRUE)
    {
        //printf("vgb_malloc: AAA\n");
        struct vgb_mem *mm = malloc(sizeof(struct vgb_mem));
        mm->addr = addr;
        mm->hint = 1;
        mm->id = VGB_MEM_ID;
        mm->ref_cnt = 0;
        mm->len = size;

        struct vgb_entry *ne = create_vgb_entry_adv(MMGR->length, mm, FALSE);
        int res = vgb_list_add(MMGR, ne);

        if(!res)
        {
            wrlErr("vgb_malloc: Error: Could not add new vgb_mem item to the memory manager.");
        }
        else
        {
            wrl("vgb_malloc: Info: Adding mem entry for addr: %p of size: %d", addr, size);
        };
    };
    return(addr);
};


/**
* A static logging method that writes the provided text, followed by a new
* line, to standard output.
*
* @param s The specified text to write.
*/
void wrl(char *s, ...)
{
    if(LOGGING_ON == TRUE)
    {
        va_list args;
        va_start (args, s);
        vprintf(s, args);
        printf("%c", NEWLINE_CHAR);
        va_end (args);
    };
};

/**
* A static logging method that writes the provided text to standard output.
*
* @param s The specified text to write.
*/
void wr(char *s, ...)
{
    if(LOGGING_ON == TRUE)
    {
        va_list args;
        va_start (args, s);
        vprintf(s, args);
        va_end (args);
    };
};

/**
* A static logging method that writes the provided text, followed by a new
* line, to standard error.
*
* @param s The specified text to write.
*/
void wrlErr(char *s, ...)
{
    if(LOGGING_ON == TRUE)
    {
        va_list args;
        va_start (args, s);
        printf(">> ERROR MESSAGE START ============================================================>>\n");
        vprintf(s, args);
        printf("%c", NEWLINE_CHAR);
        va_end (args);
        printf("<< ERROR MESSAGE END ==============================================================<<\n");
    };
};

