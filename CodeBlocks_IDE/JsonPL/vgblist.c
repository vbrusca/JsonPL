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

#ifndef vgbutil_h
    #include "vgbutil.h"
    #define vgbutil_h
#endif // vgbutil_h


/*
*
*/
void print_vgb_list_entries(struct vgb_list *lst)
{
    int len = lst->length;
    if(len > 0)
    {
        struct vgb_entry *itm = lst->head;
        for(int i = 0; i < len && itm != NULL; i++)
        {
            print_vgb_entry(itm);
            itm = itm->next;
        };
    }
    else
    {
        printf("vgb_lst: Has no items!\n");
    };
};

/*
*
*/
void print_vgb_list(struct vgb_list *lst)
{
    printf("vgb_lst: id: %d, count: %d\n", lst->id, lst->length);
};

/*
*
*/
void print_vgb_entry(struct vgb_entry *itm)
{
    printf("vgb_entry: index: %d, value: %s\n", itm->index, (char *)itm->value);
};

/*
*
*/
struct vgb_list *create_vgb_list(const int idx)
{
    struct vgb_list *list = malloc(sizeof(struct vgb_list));
    list->id = VGB_LIST_ID;
    list->hint = -1;
    list->head = NULL;
    list->tail = NULL;
    list->curr_index = idx;
    list->length = 0;
    return list;
};

/*
*
*/
struct vgb_entry *create_vgb_entry(const int idx, const void *val)
{
    printf("create_vgb_entry: AAA\n");
    struct vgb_entry *entry = malloc(sizeof(struct vgb_entry));
    entry->id = VGB_ENTRY_ID;
    entry->hint = -1;
    entry->value = val;
    entry->next = NULL;
    entry->index = idx;
    printf("create_vgb_entry: BBB\n");
    return entry;
};

/*
*
*/
struct vgb_entry *get_def_vgb_entry()
{
    struct vgb_entry *def = malloc(sizeof(struct vgb_entry));
    def->id = VGB_ENTRY_ID;
    def->hint = -1;
    def->value = NULL;
    def->next = NULL;
    def->index = -1;
    return def;
};

/*
*
*/
int get_vgb_entry(const struct vgb_list *lst, const int idx, struct vgb_entry *found)
{
    struct vgb_entry *tmp = lst->head;
    int cnt = 0;
    while(cnt <= idx && tmp->next != NULL)
    {
        tmp = tmp->next;
        cnt++;
    };

    if(cnt == idx)
    {
        found = tmp;
        return(1);
    }
    else
    {
        printf("get_vgb_entry: Error: cnt, %d, is not equal to idx, %idx\n", cnt, idx);
        return(0);
    };
};

/*
*
*/
int set_vgb_entry(struct vgb_list *lst, const int idx, struct vgb_entry *new_entry)
{
    if(idx >= lst->length)
    {
        return(0);
    };

    struct vgb_entry *tmp = lst->head;
    struct vgb_entry *tmp2;
    int cnt = 0;
    int len = idx;
    while(cnt <= len && tmp->next != NULL)
    {
        tmp2 = tmp;
        tmp = tmp->next;
        cnt++;
    };

    if(cnt == idx)
    {
        tmp2->next = new_entry;
        new_entry->next = tmp;
        lst->length++;

        len = lst->length;
        cnt = 0;
        tmp = tmp2;

        while(cnt <= len && tmp->next != NULL)
        {
            tmp2 = tmp;
            tmp = tmp->next;
            tmp->index = tmp2->index++;
            cnt++;
        };
        lst->tail = tmp;
        return(1);
    }
    else
    {
        printf("get_vgb_entry: Error: cnt, %d, is not equal to idx, %idx\n", cnt, idx);
        return(0);
    };
};

/*
*
*/
int vgb_list_add(struct vgb_list *lst, struct vgb_entry *new_entry)
{
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
    };
    return(1);
};
