
#ifndef VGB_LIST_ID
    #define VGB_LIST_ID 133
#endif //VGB_LIST_ID

#ifndef VGB_ENTRY_ID
    #define VGB_ENTRY_ID 143
#endif //VGB_ENTRY_ID

struct vgb_list
{
    int id;
    int hint;
    struct vgb_entry *head;
    struct vgb_entry *tail;
    int curr_index;
    int length;
};

struct vgb_entry
{
    int id;
    int hint;
    int index;
    void *value;
    struct vgb_entry *next;
};

struct vgb_entry *create_vgb_entry(const int idx, const void *val);

struct vgb_entry *get_def_vgb_entry();

int get_vgb_entry(const struct vgb_list *lst, const int idx, struct vgb_entry *found);

int set_vgb_entry(struct vgb_list *lst, const int idx, struct vgb_entry *new_entry);

int vgb_list_add(struct vgb_list *lst, struct vgb_entry *new_entry);

