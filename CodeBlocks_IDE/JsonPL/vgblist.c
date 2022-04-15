//STD INCLUDES
#ifndef stdlib_h
    #include <stdlib.h>
    #define stdlib_h
#endif // stdlib_h

#ifndef stdio_h
    #include <stdio.h>
    #define stdio_h
#endif // stdio_h

#ifndef string_h
    #include <string.h>
    #define string_h
#endif // string_h

//VGB INCLUDES
#ifndef vgblist_h
    #include "vgblist.h"
    #define vgblist_h
#endif // vgblist_h

#ifndef vgb_logger_h
    #include "vgb_logger.h"
    #define vgb_logger_h
#endif // vgb_logger_h

/**
 * Name: print_vgb_list_entries
 * Desc: Prints the given vgb_list's entries standard output.
 * Arg1: vgb_list *lst(target list)
 */
void print_vgb_list_entries(const struct vgb_list *lst)
{
    int len = lst->length;
    if(len > 0)
    {
        struct vgb_entry *itm = lst->head;
        for(int i = 0; i < len && itm != NULL; i++)
        {
            print_vgb_entry(itm);
            itm = itm->next;
        }
    }
    else
    {
        printf("vgb_lst: Has no items!\n");
    }
}

/**
 * Name: print_vgb_list
 * Desc: Prints the given vgb_list to standard output.
 * Arg1: vgb_list *lst(target list)
 */
void print_vgb_list(struct vgb_list *lst)
{
    if(lst == NULL)
    {
        printf("vgb_list: is NULL\n");
    }
    else
    {
        printf("vgb_list: id: %d, count: %d\n", lst->id, lst->length);
    }
}

/**
 * Name: print_vgb_entry
 * Desc: Prints the given vgb_entry to standard output.
 * Arg1: vgb_entry *itm(target list entry)
 */
void print_vgb_entry(struct vgb_entry *itm)
{
    if(itm == NULL)
    {
        printf("vgb_entry: is NULL\n");
    }
    else
    {
        printf("vgb_entry: index: %d, value: %s\n", itm->index, (char *)itm->value);
    }
}

/**
 * Name: create_vgb_list
 * Desc: Creates a new vgb_list..
 * Returns: vgb_list *lst(a newly allocated vgb_list)
 */
struct vgb_list *create_vgb_list(void)
{
    struct vgb_list *list = vgb_malloc(sizeof(struct vgb_list));
    list->id = VGB_LIST_ID;
    list->hint = -1;
    list->head = NULL;
    list->tail = NULL;
    list->length = 0;
    return list;
}

/**
 * Name: del_vgb_list
 * Desc: Attempts to free a vgb_list and attempts to free each entry in the list.
 * Returns: {0 | 1}
 */
int del_vgb_list(struct vgb_list **lst2)
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
        vgb_free(tmp2);
        cnt++;
    }
    vgb_free(lst);
    return 1;
}

/**
 *
 */
int del_vgb_entry(const struct vgb_list *lst, const int idx)
{
    if(lst == NULL)
    {
        return 0;
    }

    if(idx >= lst->length)
    {
        return 0;
    }

    if(lst->length == 0)
    {
        return 0;
    }

    if(idx < 0)
    {
        return 0;
    }

    struct vgb_entry *tmp = lst->head;
    struct vgb_entry *tmp2;
    int cnt = 0;
    int len = idx;
    while(cnt <= len && tmp != NULL)
    {
        tmp2 = tmp;
        tmp = tmp->next;
        cnt++;
    }
    cnt--;

    if(cnt == idx)
    {
        tmp2->next = tmp->next;
        sync_vgb_list_indexes((struct vgb_list *)lst);
        vgb_free(tmp);
        return 1;
    }
    else
    {
        printf("get_vgb_entry: Error: cnt, %d, is not equal to idx, %idx\n", cnt, idx);
        return 0;
    }
}

/**
 * Name: create_vgb_entry_adv
 * Desc: Allocates a new vgb_entry instance and returns it.
 * Arg1: int idx(the index to use for the new instance)
 * Arg2: const void *val(the default value to use for the vgb_entry)
 * Arg3: int use_vgb_mm(an int indicating to use 1 = vgb_malloc or other = malloc)
 * Returns: {0 | 1}
 */
struct vgb_entry *create_vgb_entry_adv(const int idx, const void *val, int use_vgb_mm)
{
    struct vgb_entry *entry;
    if(use_vgb_mm)
    {
        entry = vgb_malloc(sizeof(struct vgb_entry));
    }
    else
    {
        entry = malloc(sizeof(struct vgb_entry));
    }

    entry->id = VGB_ENTRY_ID;
    entry->hint = -1;
    entry->value = (void *)val;
    entry->next = NULL;
    entry->index = idx;
    return entry;
}

/**
 * Name: create_vgb_entry
 * Desc: Allocates a new vgb_entry instance and returns it.
 * Arg1: int idx(that index to use for the new instance)
 * Arg2: const void *val(the default value to use for the vgb_entry.
 * Returns: {0 | 1}
 */
struct vgb_entry *create_vgb_entry(const int idx, const void *val)
{
    struct vgb_entry *entry;
    entry = vgb_malloc(sizeof(struct vgb_entry));
    entry->id = VGB_ENTRY_ID;
    entry->hint = -1;
    entry->value = (void *)val;
    entry->next = NULL;
    entry->index = idx;
    return entry;
}

/**
 * Name: get_def_vgb_entry
 * Desc: Allocates a new vgb_entry instance and returns it.
 * Arg1: int idx(that index to use for the new instance)
 * Arg2: const void *val(the default value to use for the vgb_entry.
 * Returns: {0 | 1}
 */
struct vgb_entry *get_def_vgb_entry(void)
{
    struct vgb_entry *def = vgb_malloc(sizeof(struct vgb_entry));
    def->id = VGB_ENTRY_ID;
    def->hint = -1;
    def->value = NULL;
    def->next = NULL;
    def->index = -1;
    return def;
}

/**
 *
 */
int find_vgb_entry(const struct vgb_list *lst, void *value, struct vgb_entry **found)
{
    if(found == NULL)
    {
        return 0;
    }

    if(lst == NULL)
    {
        return 0;
    }

    if(value == NULL)
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
    while(cnt < len && tmp != NULL && tmp->value != value)
    {
        tmp = tmp->next;
        cnt++;
    }

    if(tmp != NULL)
    {
        *found = tmp;
        return 1;
    }
    else
    {
        *found = NULL;
        return 0;
    }
}

/**
 * Name: get_vgb_entry
 * Desc: Gets the vgb_entry in the specified vgb_list and sets the found argument to point to the vgb_entry.
 * Arg1: const struct vgb_list *lst(the vgb_listto search)
 * Arg2: const int idx(the index of the vgb_entry to get)
 * Arg3: struct vgb_entry **found(the pointer to the pointer to the found vgb_entry)
 * Returns: {0 | 1}
 */
int get_vgb_entry(const struct vgb_list *lst, const int idx, struct vgb_entry **found)
{
    if(found == NULL)
    {
        return 0;
    }

    if(lst == NULL)
    {
        return 0;
    }

    if(idx >= lst->length)
    {
        return 0;
    }

    if(lst->length == 0)
    {
        return 0;
    }

    if(idx < 0)
    {
        return 0;
    }

    struct vgb_entry *tmp = lst->head;
    struct vgb_entry *tmp2;
    int cnt = 0;
    int len = idx;
    while(cnt <= len && tmp != NULL)
    {
        tmp2 = tmp;
        tmp = tmp->next;
        cnt++;
    }
    cnt--;

    if(cnt == idx)
    {
        *found = tmp2;
        return 1;
    }
    else
    {
        found = NULL;
        printf("get_vgb_entry: Error: cnt, %d, is not equal to idx, %idx\n", cnt, idx);
        return 0;
    }
}

/**
 * Name: sync_vgb_list_indexes
 * Desc: Syncs the index field of a vgb_list's entries.
 * Arg1: vgb_list *lst(target list)
 * Returns: {0 | 1}
 */
int sync_vgb_list_indexes(struct vgb_list *lst)
{
    if(lst == NULL)
    {
        return 0;
    }

    struct vgb_entry *tmp = lst->head;
    int cnt = 0;
    int len = lst->length;
    while(cnt < len && tmp != NULL)
    {
        tmp->index = cnt;
        tmp->hint = 1;
        tmp = tmp->next;
        cnt++;
    }
    return 1;
};

/**
 * Name: set_vgb_entry
 * Desc: Sets the vgb_entry in the specified vgb_list at the given index.
 * Arg1: struct vgb_list *lst(the vgb_list to search)
 * Arg2: const int idx(the index of the vgb_entry to set)
 * Arg3: struct vgb_entry *new_entry(the new vgb_entry to place immediately after the specified index or at zero if the list is empty)
 * Returns: {0 | 1}
 */
int set_vgb_entry(struct vgb_list *lst, const int idx, struct vgb_entry *new_entry)
{
    if(new_entry == NULL)
    {
        return 0;
    }

    if(lst == NULL)
    {
        return 0;
    }

    if(idx >= lst->length)
    {
        return 0;
    }

    if(idx < 0)
    {
        return 0;
    }

    struct vgb_entry *tmp = lst->head;
    struct vgb_entry *tmp2;
    int cnt = 0;
    int len = idx;

    if(len == 0)
    {
        len += 1;
    }

    while(cnt < len && tmp != NULL)
    {
        tmp2 = tmp;
        tmp = tmp->next;
        cnt++;
    }

    if(cnt == 1 && idx == 0)
    {
        cnt--;
    }

    if(cnt == idx)
    {
        if(idx == 0)
        {
            new_entry->index = (tmp2->index + 1);
            new_entry->hint = 1;
            new_entry->next = tmp2;
            lst->length += 1;
            lst->head = new_entry;
            sync_vgb_list_indexes(lst);
        }
        else
        {
            tmp2->next = new_entry;
            new_entry->index = (tmp2->index + 1);
            new_entry->hint = 1;
            new_entry->next = tmp;
            lst->length += 1;
            sync_vgb_list_indexes(lst);
        }
        return 1;
    }
    else
    {
        printf("set_vgb_entry: Error: cnt %d is not equal to idx %d\n", cnt, idx);
        return 0;
    }
}

/**
 * Name: set_vgb_entry_after
 * Desc: Sets the vgb_entry in the specified vgb_list at the given index.
 * Arg1: struct vgb_list *lst(the vgb_list to search)
 * Arg2: const int idx(the index of the vgb_entry to set)
 * Arg3: struct vgb_entry *new_entry(the new vgb_entry to place immediately after the specified index or at zero if the list is empty)
 * Returns: {0 | 1}
 */
int set_vgb_entry_after(struct vgb_list *lst, const int idx, struct vgb_entry *new_entry)
{
    if(new_entry == NULL)
    {
        return 0;
    }

    if(lst == NULL)
    {
        return 0;
    }

    if(idx >= lst->length)
    {
        return 0;
    }

    if(idx < 0)
    {
        return 0;
    }

    struct vgb_entry *tmp = lst->head;
    struct vgb_entry *tmp2;
    int cnt = 0;
    int len = idx;
    while(cnt <= len && tmp != NULL)
    {
        tmp2 = tmp;
        tmp = tmp->next;
        cnt++;
    }
    cnt--;

    if(cnt == idx)
    {
        tmp2->next = new_entry;
        new_entry->index = (tmp2->index + 1);
        new_entry->hint = 1;
        new_entry->next = tmp;
        lst->length += 1;
        sync_vgb_list_indexes(lst);
        return 1;
    }
    else
    {
        printf("set_vgb_entry: Error: cnt %d is not equal to idx %d\n", cnt, idx);
        return 0;
    }
}

/**
 * Name: vgb_list_add
 * Desc: Adds the specified vgb_entry to the end of the specified list.
 * Arg1: struct vgb_list *lst(the target vgb_list)
 * Arg2: struct vgb_entry *new_entry(the new vgb_entry to append to the specified vgb_list)
 * Returns: {0 | 1}
 */
int vgb_list_add(struct vgb_list *lst, struct vgb_entry *new_entry)
{
    if(new_entry == NULL)
    {
        return 0;
    }

    if(lst == NULL)
    {
        return 0;
    }

    if(lst->length == 0)
    {
        lst->head = new_entry;
        lst->tail = lst->head;
        new_entry->index = 0;
        new_entry->hint = 1;
        lst->tail->next = NULL;
        lst->length = 1;
    }
    else
    {
        int idx = (*lst->tail).index + 1;
        lst->tail->next = new_entry;
        new_entry->index = idx;
        new_entry->hint = 1;
        new_entry->next = NULL;
        lst->length++;
        lst->tail = lst->tail->next;
    }
    return 1;
}
