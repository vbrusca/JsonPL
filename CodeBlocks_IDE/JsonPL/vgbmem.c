//STD INCLUDES
#ifndef stdlib_h
    #include <stdlib.h>
    #define stdlib_h
#endif // stdlib_h

#ifndef stdio_h
    #include <stdio.h>
    #define stdio_h
#endif // stdio_h

//VGB INCLUDES
#ifndef vgbmem_h
    #include "vgbmem.h"
    #define vgbmem_h
#endif // vgbmem_h

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

#ifndef mmgr_init_var
    #define mmgr_init_var
    int MMGR_INIT = FALSE;
#endif // mmgr_init_var

#ifndef mmgr_var
    #define mmgr_var
    struct vgb_list *MMGR;
#endif // mmgr_var

/**
 * Name: vgb_mmgr_init
 * Desc: A function that initializes a vgb_mem struct for use as the main memory manager.
 * Returns: {0 | 1}
 */
int vgb_mmgr_init(void)
{
    MMGR = create_vgb_list();
    if(MMGR == NULL)
    {
        MMGR_INIT = FALSE;
        return 0;
    }
    else
    {
        MMGR_INIT = TRUE;
        return 1;
    }
}

/**
 * Name: vgb_mmgr_cleanup
 * Desc: A function that cleans out the default vgb_mem memory manager
 */
void vgb_mmgr_cleanup(void)
{
    del_vgb_list_mem(&MMGR);
    MMGR_INIT = FALSE;
    MMGR = NULL;
}

/**
 * Name: safe_ptr
 * Desc: A function that's used to safely assign a pointer. Using this function
 *       registers the pointer assignment with the default memory manager.
 * Arg1: void **ptr_left(The left-hand side of a pointer assignment)
 * Arg2: void **ptr_right(The right-hand side of a pointer assignment)
 */
void safe_ptr(void **ptr_left, void **ptr_right)
{
    struct vgb_mem *mm;
    find_vgb_mem(MMGR, *ptr_right, &mm);
    if(mm != NULL)
    {
        mm->ref_cnt += 1;
    }
    *ptr_left = *ptr_right;
}

/**
 * Name: find_vgb_mem
 * Desc: A function to delete the vgb_mem entry, vgb_entry, in the given vgb_list with the specified address.
 * Arg1: const struct vgb_list *lst(the vgb_list to look through to find the specified memory address and delete it)
 * Arg2: void *addr(the address to search for in the specified vgb_list)
 * Returns: {0 | 1}
 */
int del_vgb_mem(const struct vgb_list *lst, void *addr)
{
    if(addr == NULL)
    {
        return 0;
    }

    if(lst == NULL)
    {
        return 0;
    }

    if(lst->length == 0)
    {
        return 0;
    }

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
    }
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
        return 1;
    }
    else
    {
        printf("get_vgb_mem: Error: cnt, %d, could not find address, %p\n", cnt, addr);
        return 0;
    }
}

/**
 * Name: find_vgb_mem
 * Desc: A function for searching through a vgb_list and finding the specified address storing the found vgb_mem if any.
 * Arg1: const struct vgb_list *lst(the vgb_list to search through)
 * Arg2: void *addr(the address to search for)
 * Arg3: struct vgb_mem **found(the found vgb_mem entry value if any)
 * Returns: {0 | 1}
 */
int find_vgb_mem(const struct vgb_list *lst, void *addr, struct vgb_mem **found)
{
    if(lst == NULL)
    {
        return 0;
    }

    if(addr == NULL)
    {
        return 0;
    }

    if(lst->length == 0)
    {
        return 0;
    }

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
        }
        cnt++;
    }

    if(mm != NULL && mm->addr == addr)
    {
        *found = mm;
        //printf("found!!\n");
        return 1;
    }
    else
    {
        *found = NULL;
        //printf("not found!!\n");
        return 0;
    }
}

/**
 * Name: vgb_free
 * Desc: A function that wraps the C language free function and checks the reference count of the specified pointer address.
 * Arg1: void *ptr(a pointer to a memory location that is to be freed)
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
        }
    }
    //printf("vgb_free: CCC\n");
    ptr = NULL;
    //printf("vgb_free: DDD\n");
}

/**
 * Name: del_vgb_list_mem
 * Desc: A function that frees up the memory used by each vgb_entry, vgb_mem struct, in the specified list.
 * Arg1: struct vgb_list **lst2(the list to free up memory for)
 * Returns: {0 | 1}
 */
 int del_vgb_list_mem(struct vgb_list **lst2)
{
    if(lst2 == NULL)
    {
        return 0;
    }

    if(*lst2 == NULL)
    {
        return 0;
    }

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
    }
    free(lst);
    return 1;
}

/**
 * Name: vgb_malloc
 * Desc: A function that wraps the C language malloc function and allows for tracked memory allocation.
 * Arg1: size_t size(the size of the memory to allocate)
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
        }
    }
    return addr;
}
