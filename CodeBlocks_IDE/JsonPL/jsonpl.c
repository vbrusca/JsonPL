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
#ifndef vgbmem_h
    #include "vgbmem.h"
    #define vgbmem_h
#endif // vgbmem_h

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

#ifndef vgbhash_h
    #include "vgbhash.h"
    #define vgbhash_h
#endif // vgbhash_h

#ifndef vgbbin_h
    #include "vgbbin.h"
    #define vgbbin_h
#endif // vgbbin_h

#ifndef vgb_utils_h
    #include "vgb_utils.h"
    #define vgb_utils_h
#endif // vgb_utils_h

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
 * TODO
 */
void test_str2(void);

/**
 * TODO
 */
void test_str(void);

/**
 * TODO
 */
void test_list(void);

/**
 * TODO
 */
void test_hash(void);

/**
 * TODO
 */
int main()
{
    vgb_mmgr_init();

    //test_str();
    //test_list();
    //test_hash();

    //test_str2();
    test_list2();

    vgb_mmgr_cleanup();
    return 0;
}

/**
 * TODO
 */
 void test_list2(void) {
    struct vgb_list *lst1 = create_vgb_list();
    print_vgb_list(lst1);
 }

/**
 * TODO
 */
void test_str2(void)
{
    printf("\n\ntest_str2: 1: ////////////////////////////////////////////////////////////////////////////\n");
    int res = FALSE;
    struct vgb_str *vstr = vgb_str_get_def();
    res = vgb_str_init(vstr, "Hello World", 11, 1);
    if(res == FALSE)
    {
        printf("test_str2: Error: init_vgb_str failed.");
        return;
    }

    print_ptr_info_str(vstr->str);
    vgb_str_print(vstr);
    print_ptr_info(vstr);

    int str_len = (int)strlen(vstr->str);
    int str_flen = (str_len + 1);
    int str_ilen = (int)sizeof(vstr->str[0]);
    printf("String Length: %d String Full Length: %d String Item Length: %d\n", str_len, str_flen, str_ilen);

    if(str_len != vstr->str_len)
    {
        wrl("Test 01: **FAIL**: String length does NOT match, %d vs %d", str_len, vstr->str_len);
    }
    else
    {
        wrl("Test 01: PASS: String length does match, %d vs %d", str_len, vstr->str_len);
    }

    if(str_flen != vstr->str_szof_len)
    {
        wrl("Test 02: **FAIL**: String length does NOT match, %d vs %d", str_flen, vstr->str_szof_len);
    }
    else
    {
        wrl("Test 02: PASS: String length does match, %d vs %d", str_flen, vstr->str_szof_len);
    }

    if(str_ilen != vstr->str_itm_len)
    {
        wrl("Test 03: **FAIL**: String length does NOT match, %d vs %d", str_ilen, vstr->str_itm_len);
    }
    else
    {
        wrl("Test 03: PASS: String length does match, %d vs %d", str_ilen, vstr->str_itm_len);
    }

    char c = 'A';
    res = vgb_str_get_c(vstr, 0, &c);
    if(res == FALSE)
    {
        printf("test_str2: Error: get_vgb_str_c failed.");
        return;
    }

    if(c != 'H')
    {
        wrl("Test 04: **FAIL**: Character at index %d does NOT match, %d vs %d", 0, c, 'H');
    }
    else
    {
        wrl("Test 04: PASS: Character at index %d does match, %c vs %c", 0, c, 'H');
    }

    printf("\n\ntest_str2: 2: ////////////////////////////////////////////////////////////////////////////\n");
    struct vgb_str *vstr2 = vgb_str_get_def();
    res = vgb_str_init(vstr2, "I MISS YOU", 10, 1);
    if(res == FALSE)
    {
        printf("test_str2: Error: init_vgb_str failed.");
        return;
    }

    print_ptr_info_str(vstr2->str);
    vgb_str_print(vstr2);
    print_ptr_info(vstr2);

    str_len = (int)strlen(vstr2->str);
    str_flen = (str_len + 1);
    str_ilen = (int)sizeof(vstr2->str[0]);
    printf("String Length: %d String Full Length: %d String Item Length: %d\n", str_len, str_flen, str_ilen);

    if(str_len != vstr2->str_len)
    {
        wrl("Test 05: **FAIL**: String length does NOT match, %d vs %d", str_len, vstr2->str_len);
    }
    else
    {
        wrl("Test 05: PASS: String length does match, %d vs %d", str_len, vstr2->str_len);
    }

    if(str_flen != vstr2->str_szof_len)
    {
        wrl("Test 06: **FAIL**: String length does NOT match, %d vs %d", str_flen, vstr2->str_szof_len);
    }
    else
    {
        wrl("Test 06: PASS: String length does match, %d vs %d", str_flen, vstr2->str_szof_len);
    }

    if(str_ilen != vstr2->str_itm_len)
    {
        wrl("Test 07: **FAIL**: String length does NOT match, %d vs %d", str_ilen, vstr2->str_itm_len);
    }
    else
    {
        wrl("Test 07: PASS: String length does match, %d vs %d", str_ilen, vstr2->str_itm_len);
    }

    c = 'A';
    res = vgb_str_get_c(vstr2, 0, &c);
    if(res == FALSE)
    {
        printf("test_str2: Error: get_vgb_str_c failed.");
        return;
    }

    if(c != 'I')
    {
        wrl("Test 08: **FAIL**: Character at index %d does NOT match, %d vs %d", 0, c, 'I');
    }
    else
    {
        wrl("Test 08: PASS: Character at index %d does match, %c vs %c", 0, c, 'I');
    }

    printf("\n\ntest_str2: 3: ////////////////////////////////////////////////////////////////////////////\n");
    struct vgb_str *vstr3 = vgb_str_get_def();
    res = vgb_str_init(vstr3, "I MISS YOU", 10, 1);
    if(res == FALSE)
    {
        printf("test_str2: Error: init_vgb_str failed.");
        return;
    }

    res = vgb_str_concat(vstr3, vstr2);
    if(res == FALSE)
    {
        printf("test_str2: Error: concat_vgb_str failed.");
        return;
    }

    print_ptr_info_str(vstr3->str);
    vgb_str_print(vstr3);
    print_ptr_info(vstr3);

    str_len = (int)strlen(vstr3->str);
    str_flen = (str_len + 1);
    str_ilen = (int)sizeof(vstr3->str[0]);
    printf("String Length: %d String Full Length: %d String Item Length: %d\n", str_len, str_flen, str_ilen);

    if(str_len != vstr3->str_len)
    {
        wrl("Test 09: **FAIL**: String length does NOT match, %d vs %d", str_len, vstr3->str_len);
    }
    else
    {
        wrl("Test 09: PASS: String length does match, %d vs %d", str_len, vstr3->str_len);
    }

    if(str_flen != vstr3->str_szof_len)
    {
        wrl("Test 10: **FAIL**: String length does NOT match, %d vs %d", str_flen, vstr3->str_szof_len);
    }
    else
    {
        wrl("Test 10: PASS: String length does match, %d vs %d", str_flen, vstr3->str_szof_len);
    }

    if(str_ilen != vstr3->str_itm_len)
    {
        wrl("Test 11: **FAIL**: String length does NOT match, %d vs %d", str_ilen, vstr3->str_itm_len);
    }
    else
    {
        wrl("Test 11: PASS: String length does match, %d vs %d", str_ilen, vstr3->str_itm_len);
    }

    c = 'A';
    res = vgb_str_get_c(vstr3, 0, &c);
    if(res == FALSE)
    {
        printf("test_str2: Error: get_vgb_str_c failed.");
        return;
    }

    if(c != 'I')
    {
        wrl("Test 12: **FAIL**: Character at index %d does NOT match, %d vs %d", 0, c, 'I');
    }
    else
    {
        wrl("Test 12: PASS: Character at index %d does match, %c vs %c", 0, c, 'I');
    }

    printf("\n\ntest_str2: 4: ////////////////////////////////////////////////////////////////////////////\n");
    struct vgb_str *vstr4 = vgb_str_get_def();
    res = vgb_str_init(vstr4, "HI!", 10, 1);
    if(res == FALSE)
    {
        printf("test_str2: Error: init_vgb_str failed.");
        return;
    }

    res = vgb_str_concat_2(vstr4, vgb_str_get_spc(), vstr2);
    if(res == FALSE)
    {
        printf("test_str2: Error: concat_vgb_str failed.");
        return;
    }

    print_ptr_info_str(vstr4->str);
    vgb_str_print(vstr4);
    print_ptr_info(vstr4);

    str_len = (int)strlen(vstr4->str);
    str_flen = (str_len + 1);
    str_ilen = (int)sizeof(vstr4->str[0]);
    printf("String Length: %d String Full Length: %d String Item Length: %d\n", str_len, str_flen, str_ilen);

    if(str_len != vstr4->str_len)
    {
        wrl("Test 13: **FAIL**: String length does NOT match, %d vs %d", str_len, vstr4->str_len);
    }
    else
    {
        wrl("Test 13: PASS: String length does match, %d vs %d", str_len, vstr4->str_len);
    }

    if(str_flen != vstr4->str_szof_len)
    {
        wrl("Test 14: **FAIL**: String length does NOT match, %d vs %d", str_flen, vstr4->str_szof_len);
    }
    else
    {
        wrl("Test 14: PASS: String length does match, %d vs %d", str_flen, vstr4->str_szof_len);
    }

    if(str_ilen != vstr4->str_itm_len)
    {
        wrl("Test 15: **FAIL**: String length does NOT match, %d vs %d", str_ilen, vstr4->str_itm_len);
    }
    else
    {
        wrl("Test 15: PASS: String length does match, %d vs %d", str_ilen, vstr4->str_itm_len);
    }

    c = 'A';
    res = vgb_str_get_c(vstr4, 1, &c);
    if(res == FALSE)
    {
        printf("test_str2: Error: get_vgb_str_c failed.");
        return;
    }

    if(c != 'I')
    {
        wrl("Test 16: **FAIL**: Character at index %d does NOT match, %d vs %d", 1, c, 'I');
    }
    else
    {
        wrl("Test 16: PASS: Character at index %d does match, %c vs %c", 1, c, 'I');
    }

    res = vgb_str_has_null(vstr4);
    if(res == FALSE)
    {
        wrl("Test 17: **FAIL**: Error, could NOT find expected null char.");
    }
    else
    {
        wrl("Test 17: PASS: Could find expected null char.");
    }

    char tmpc = 'A';
    res = vgb_str_set_c(vstr4, vstr4->str_len, &tmpc);
    if(res == FALSE)
    {
        wrl("Test 18: PASS: Error, could NOT set last character, %d -> %c.", vstr4->str_len, 'A');
    }
    else
    {
        wrl("Test 18: **FAIL**: Could set the last character, %d -> %c.", vstr4->str_len, 'A');
    }

    res = vgb_str_has_null(vstr4);
    if(res == TRUE)
    {
        wrl("Test 19: PASS: Could find expected null char.");
    }
    else
    {
        wrl("Test 19: **FAIL**: Error, could NOT find expected null char.");
    }

    printf("\n\ntest_str2: 5: ////////////////////////////////////////////////////////////////////////////\n");
    vgb_str_print(vstr3);
    struct vgb_str *sbstr = NULL;
    res = vgb_str_substr(vstr3, 2, 4, &sbstr);
    if(res == TRUE)
    {
        wrl("Test 20: PASS: Could get substring, %s", sbstr->str);
    }
    else
    {
        wrl("Test 20: **FAIL**: Error, could NOT get substring %s.", sbstr->str);
    }

    vgb_str_cleanup(&vstr);
    vgb_str_cleanup(&vstr2);
    vgb_str_cleanup(&vstr3);
    vgb_str_cleanup(&vstr4);
}

/**
 * TODO
 */
void test_hash(void)
{
    /*
    int i1 = 10235;
    int h1 = hash_func_int(i1);
    printf("hash_func_int in %d result %d\n", i1, h1);

    i1 = 745;
    h1 = hash_func_int(i1);
    printf("hash_func_int in %d result %d\n", i1, h1);

    i1 = 45;
    h1 = hash_func_int(i1);
    printf("hash_func_int in %d result %d\n", i1, h1);

    i1 = 2;
    h1 = hash_func_int(i1);
    printf("hash_func_int in %d result %d\n", i1, h1);

    i1 = 203456;
    h1 = hash_func_int(i1);
    printf("hash_func_int in %d result %d\n", i1, h1);

    i1 = -2435756;
    h1 = hash_func_int(i1);
    printf("hash_func_int in %d result %d\n", i1, h1);

    char *s1 = "testing";
    int h2 = hash_func_str((const char*)s1, 7);
    printf("hash_func_int in %s result %d\n", s1, h2);

    s1 = "tmp1";
    h2 = hash_func_str((const char*)s1, 7);
    printf("hash_func_int in %s result %d\n", s1, h2);

    s1 = "testing this longer string to see what value it gets";
    h2 = hash_func_str((const char*)s1, 7);
    printf("hash_func_int in %s result %d\n", s1, h2);

    s1 = "zzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzz";
    h2 = hash_func_str((const char*)s1, 7);
    printf("hash_func_int in %s result %d 1\n", s1, h2);

    h2 = hash_func_str((const char*)s1, 7);
    printf("hash_func_int in %s result %d 2\n", s1, h2);

    s1 = "tmp1";
    h2 = hash_func_int(*s1);
    printf("hash_func_int in %s result %d\n", s1, h2);

    struct vgb_hash hsh;
    init_vgb_hash_entry(&hsh, 0);
    printf("1 Found id: %d\n", (*(hsh.data + 0))->id);
    printf("2 Found id: %d\n", hsh.data[0]->id);
    printf("3 Found id: %d\n", (*hsh.data[0]).id);

    struct vgb_list *itm = hsh.data[0];
    printf("4 Found id: %d\n", (*itm).id);

    int itmp[] = {102, 32, 14, 11, 1, 2, 7, 1, 9, 12, 45, 67};
    int len = sizeof(itmp)/sizeof(itmp[0]);
    for(int i = 0; i < len; i++)
    {
        printf("1 idx: %d v: %d\n", i, itmp[i]);
    }

    printf("\n\n");
    //prescan(&itmp, len);
    quicks((int *)&itmp, len, 0, len - 1);
    for(int i = 0; i < len; i++)
    {
        printf("2 idx: %d v: %d\n", i, itmp[i]);
    }

    int itmp2[] = {102, 32, 14, 11, 1, 2, 7, 1, 9, 12, 45, 67, 33, 67, 345, 2, 34};
    len = sizeof(itmp2)/sizeof(itmp2[0]);
    for(int i = 0; i < len; i++)
    {
        printf("1 idx: %d v: %d\n", i, itmp2[i]);
    }

    printf("\n\n");
    presort((int *)&itmp2, len);
    for(int i = 0; i < len; i++)
    {
        printf("2 idx: %d v: %d\n", i, itmp2[i]);
    }

    quicks((int *)&itmp2, len, 0, len - 1);
    for(int i = 0; i < len; i++)
    {
        printf("3 idx: %d v: %d\n", i, itmp2[i]);
    }

    int target = 32;
    int fidx = binsearch(itmp2, 0, (len - 1), target);
    printf("Found target %d at idx %d %p\n", target, fidx, sizeof(&itmp2));
    */
}

/**
 * TODO
 */
void test_list(void)
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
}

/**
 * TODO
 */
void test_str(void)
{
    struct vgb_str *def1 = vgb_str_get_def();
    wrl("---------------> testing wrl %c", 'C');
    printf(">>=========================================<<\n");
    vgb_str_print(def1);

    if(vgb_str_is_null(def1))
    {
        printf("vgb_str is NULL\n");
    }
    else
    {
        printf("vgb_str is NOT NULL\n");
    }

    if(vgb_str_is_err(def1))
    {
        printf("vgb_str is ERR\n");
    }
    else
    {
        printf("vgb_str is NOT ERR\n");
    }

    def1->str_itm_len = 2;
    if(vgb_str_is_err(def1))
    {
        printf("vgb_str is ERR\n");
    }
    else
    {
        printf("vgb_str is NOT ERR\n");
    }

    struct vgb_str *spc1 = vgb_str_get_spc();
    printf(">>=========================================<<\n");
    vgb_str_print(spc1);

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
    res = vgb_str_init(&s3, istr3, sizeof(istr3), sizeof(char));
    if(res != 1)
    {
        printf("test_str: Error: Could not initialize 0 vgb_str");
        return;
    }

    res = vgb_str_init(&s1, istr1, sizeof(istr1), sizeof(char));
    if(res != 1)
    {
        printf("test_str: Error: Could not initialize 1 vgb_str");
        return;
    }

    res = vgb_str_init(&s1, istr1, sizeof(istr1), sizeof(char));
    if(res != 1)
    {
        printf("test_str: Error: Could not initialize 2 vgb_str");
        return;
    }

    res = vgb_str_init(&s2, istr2, sizeof(istr2), sizeof(char));
    if(res != 1)
    {
        printf("test_str: Error: Could not initialize 3 vgb_str");
    }

    res = vgb_str_concat_2(&s1, &s3, &s2);
    if(res != 1)
    {
        printf("test_str: Error: Could not concat vgb_str");
    }

    struct vgb_str *ps;
    ps = &s1;

    char lc = 'd';
    int cidx = 0;
    vgb_str_get_c(&s1, cidx, &lc);
    printf("test_str: Found char %c at position %d\n", lc, cidx);

    cidx = 1;
    vgb_str_get_c(&s1, cidx, &lc);
    printf("test_str: Found char %c at position %d\n", lc, cidx);

    cidx = 0;
    vgb_str_set_c(&s1, cidx, &lc);
    printf("test_str: Found char %c at position %d\n", lc, cidx);

    printf("test_str: Struct Address: %p, Struct Pointer: %p %d %d\n", &s1, ps, (int)sizeof(istr1), (int)sizeof(*s1.str));
    printf("\n");
    printf("=========================================\n");
    vgb_str_print(&s3);

    printf("\n");
    printf("=========================================\n");
    vgb_str_print(&s2);

    printf("\n");
    printf("=========================================\n");
    vgb_str_print(&s1);

    printf("\n");
    printf("=========================================\n");
    vgb_str_print(ps);

    printf("\n");
    printf("\n");
}
