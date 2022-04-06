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

#ifndef vgbstr_h
    #include "vgbstr.h"
    #define vgbstr_h
#endif // vgbstr_h

int main() {
    struct vgb_str *def1 = get_def_vgb_str();
    printf(">>=========================================<<\n");
    print_vgb_str(def1);

    if(vgb_is_null(def1))
    {
        printf("vgb_str is NULL\n");
    }
    else
    {
        printf("vgb_str is NOT NULL\n");
    }


    if(vgb_is_err(def1))
    {
        printf("vgb_str is ERR\n");
    }
    else
    {
        printf("vgb_str is NOT ERR\n");
    }

    def1->str_itm_len = 2;
    if(vgb_is_err(def1))
    {
        printf("vgb_str is ERR\n");
    }
    else
    {
        printf("vgb_str is NOT ERR\n");
    }


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
    }

    res = init_vgb_str(&s1, istr1, sizeof(istr1), sizeof(char));
    if(res != 1)
    {
        printf("main: Error: Could not initialize 1 vgb_str");
        return(0);
    }

    res = init_vgb_str(&s1, istr1, sizeof(istr1), sizeof(char));
    if(res != 1)
    {
        printf("main: Error: Could not initialize 2 vgb_str");
        return(0);
    }

    res = init_vgb_str(&s2, istr2, sizeof(istr2), sizeof(char));
    if(res != 1)
    {
        printf("main: Error: Could not initialize 3 vgb_str");
        return(0);
    }

    res = concat_2_vgb_str(&s1, &s3, &s2);
    if(res != 1)
    {
        printf("main: Error: Could not concat vgb_str");
        return(0);
    }

    struct vgb_str *ps;
    ps = &s1;

    char lc = 'd';
    get_vgb_c(&s1, 0, &lc);

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

    return(0);
}
