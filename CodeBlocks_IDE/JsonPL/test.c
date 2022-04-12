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
#ifndef vgbstr_h
    #include "vgbstr.h"
    #define vgbstr_h
#endif // vgbstr_h

#ifndef vgblist_h
    #include "vgblist.h"
    #define vgblist_h
#endif // vgblist_h

#ifndef vgb_logger_h
    #include "vgb_logger.h"
    #define vgb_logger_h
#endif // vgb_logger_h

//TODO ensure MMGR gets freed
/*
functions that use these functions

create_vgb_list
create_vgb_entry
get_def_vgb_entry
get_def_vgb_str

should use

vgb_malloc
vgb_free
safe_ptr

for structure pointers and run vgb_free on all
pointers after they are done being used

*/

/**
*
*/
void test_list();

/**
*
*/
int main() {
    vgb_mmgr_init();

    struct vgb_str *def1 = get_def_vgb_str();
    wrl("---------------> testing wrl %c", 'C');
    printf(">>=========================================<<\n");
    print_vgb_str(def1);

    if(vgb_is_null(def1))
    {
        printf("vgb_str is NULL\n");
    }
    else
    {
        printf("vgb_str is NOT NULL\n");
    };

    if(vgb_is_err(def1))
    {
        printf("vgb_str is ERR\n");
    }
    else
    {
        printf("vgb_str is NOT ERR\n");
    };

    def1->str_itm_len = 2;
    if(vgb_is_err(def1))
    {
        printf("vgb_str is ERR\n");
    }
    else
    {
        printf("vgb_str is NOT ERR\n");
    };

    struct vgb_str *spc1 = get_spc_vgb_str();
    printf(">>=========================================<<\n");
    print_vgb_str(spc1);

    struct vgb_str vgb_str_def;
    vgb_str_def.id = VGB_STR_ID;
    vgb_str_def.str = NULL;
    vgb_str_def.str_itm_len = -1;
    vgb_str_def.str_len = -1;
    vgb_str_def.str_szof_len = -1;

    struct vgb_str vgb_str_spc;
    vgb_str_spc.id = VGB_STR_ID;
    vgb_str_spc.str = NULL;
    vgb_str_spc.str_itm_len = -1;
    vgb_str_spc.str_len = -1;
    vgb_str_spc.str_szof_len = -1;

    struct vgb_str s1 = vgb_str_def;
    struct vgb_str s2 = vgb_str_def;
    struct vgb_str s3 = vgb_str_spc;
    char istr1[] = "testing123";
    char istr2[] = "testing123567890";
    char istr3[] = " ";

    int res;
    res = init_vgb_str(&s3, istr3, sizeof(istr3), sizeof(char));
    if(res != 1)
    {
        printf("main: Error: Could not initialize 0 vgb_str");
        return(0);
    };

    res = init_vgb_str(&s1, istr1, sizeof(istr1), sizeof(char));
    if(res != 1)
    {
        printf("main: Error: Could not initialize 1 vgb_str");
        return(0);
    };

    res = init_vgb_str(&s1, istr1, sizeof(istr1), sizeof(char));
    if(res != 1)
    {
        printf("main: Error: Could not initialize 2 vgb_str");
        return(0);
    };

    res = init_vgb_str(&s2, istr2, sizeof(istr2), sizeof(char));
    if(res != 1)
    {
        printf("main: Error: Could not initialize 3 vgb_str");
        return(0);
    };

    res = concat_2_vgb_str(&s1, &s3, &s2);
    if(res != 1)
    {
        printf("main: Error: Could not concat vgb_str");
        return(0);
    };

    struct vgb_str *ps;
    ps = &s1;

    char lc = 'd';
    int cidx = 0;
    get_vgb_c(&s1, cidx, &lc);
    printf("main: Found char %c at position %d\n", lc, cidx);

    cidx = 1;
    get_vgb_c(&s1, cidx, &lc);
    printf("main: Found char %c at position %d\n", lc, cidx);

    cidx = 0;
    set_vgb_c(&s1, cidx, &lc);
    printf("main: Found char %c at position %d\n", lc, cidx);

    printf("main: Struct Address: %p, Struct Pointer: %p %d %d\n", &s1, ps, (int)sizeof(istr1), (int)sizeof(*s1.str));
    printf("\n");
    printf("=========================================\n");
    print_vgb_str(&s3);

    printf("\n");
    printf("=========================================\n");
    print_vgb_str(&s2);

    printf("\n");
    printf("=========================================\n");
    print_vgb_str(&s1);

    printf("\n");
    printf("=========================================\n");
    print_vgb_str(ps);

    printf("\n");
    printf("\n");

    test_list();
    return(0);
};

/**
*
*/
void test_list()
{
    struct vgb_list lst;
    lst.id = VGB_LIST_ID;
    lst.hint = -1;
    lst.head = NULL;
    lst.tail = NULL;
    lst.length = 0;
    printf("\n");
    printf("0=========================================\n");
    print_vgb_list(&lst);
    print_vgb_list_entries(&lst);

    printf("\n");
    printf("1=========================================\n");
    struct vgb_entry *itm1;
    void *tmp_ptr;

    tmp_ptr = create_vgb_entry(0, "hello001");
    safe_ptr((void *)&itm1, (void *)&tmp_ptr);
    printf("Itm1 address: %p\n", itm1);
    printf("tmp_ptr address: %p\n", tmp_ptr);

    itm1 = tmp_ptr;
    printf("Itm1 address: %p\n", itm1);
    printf("tmp_ptr address: %p\n", tmp_ptr);

    vgb_list_add(&lst, itm1);
    print_vgb_list_entries(&lst);

    printf("\n");
    printf("2=========================================\n");
    struct vgb_entry *itm2 = create_vgb_entry(1, "hello002");
    vgb_list_add(&lst, itm2);
    print_vgb_list_entries(&lst);

    printf("\n");
    printf("3=========================================\n");
    struct vgb_entry *itm3 = create_vgb_entry(2, "hello003");
    vgb_list_add(&lst, itm3);
    print_vgb_list_entries(&lst);

    printf("\n");
    printf("4=========================================\n");
    struct vgb_entry *itm4 = create_vgb_entry(2, "hello004");
    struct vgb_entry *itm4b = create_vgb_entry(2, "hello004b");
    //vgb_list_add(&lst, itm4);
    set_vgb_entry(&lst, 0, itm4);
    printf("\n\n");
    set_vgb_entry(&lst, 1, itm4b);
    //set_vgb_entry_after(&lst, 1, itm4);
    print_vgb_list_entries(&lst);

    printf("\n");
    printf("5=========================================\n");
    print_vgb_list(&lst);
    print_vgb_list_entries(&lst);

    printf("\n");
    printf("6=========================================\n");
    struct vgb_entry *itm5;
    printf("Address of itm4: %p\n", itm4);
    int res = get_vgb_entry(&lst, 2, &itm5);
    printf("Address of itm5: %p Result: %d\n", itm5, res);
    print_vgb_entry(itm5);

    printf("List Address: %p\n", &lst);
    struct vgb_list *lp;
    lp = &lst;
    del_vgb_list(&lp);
    printf("List Address: %p\n", &lst);

    vgb_mmgr_cleanup();
};
