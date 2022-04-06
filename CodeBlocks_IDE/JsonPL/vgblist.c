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


struct vgb_list *create_vgb_list(const int idx, const void *val)
{
    //TODO
    /*
    struct vgb_entry *entry = malloc(sizeof(struct vgb_entry));
    entry->id = VGB_ENTRY_ID;
    entry->hint = -1;
    entry->value = val;
    entry->next = NULL;
    entry->index = idx;
    return entry;
    */
};

struct vgb_entry *create_vgb_entry(const int idx, const void *val)
{
    struct vgb_entry *entry = malloc(sizeof(struct vgb_entry));
    entry->id = VGB_ENTRY_ID;
    entry->hint = -1;
    entry->value = val;
    entry->next = NULL;
    entry->index = idx;
    return entry;
};

struct vgb_entry *get_def_vgb_entry()
{
    struct vgb_entry *def = malloc(sizeof(struct vgb_entry));
    def->id = VGB_ENTRY_ID;
    def->hint = -1;
    def->value = NULL;
    def->next = NULL;
    return def;
};

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

int set_vgb_entry(struct vgb_list *lst, const int idx, struct vgb_entry *new_entry)
{
    struct vgb_entry *tmp = lst->head;
    struct vgb_entry *tmp2;
    int cnt = 0;
    while(cnt <= idx && tmp->next != NULL)
    {
        tmp2 = tmp;
        tmp = tmp->next;
        cnt++;
    };

    if(cnt == idx)
    {
        struct vgb_entry *tmp3 = tmp2->next;
        tmp2->next = new_entry;
        new_entry->next = tmp->next;
        new_entry->index = tmp3->index;
        new_entry->hint = 1;
        free(tmp3);
        return(1);
    }
    else
    {
        printf("get_vgb_entry: Error: cnt, %d, is not equal to idx, %idx\n", cnt, idx);
        return(0);
    };
};

int vgb_list_add(struct vgb_list *lst, struct vgb_entry *new_entry)
{
    lst->tail->next = new_entry;
    new_entry->hint = 1;
    new_entry->index = lst->tail->index++;
    lst->tail = lst->tail->next;
    lst->length++;
    return(1);
};
