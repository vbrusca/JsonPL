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

#ifndef math_h
    #include <math.h>
    #define math_h
#endif // math_h

//VGB INCLUDES
#ifndef vgbhash_h
    #include "vgbhash.h"
    #define vgbhash_h
#endif // vgbhash_h

#ifndef vgb_logger_h
    #include "vgb_logger.h"
    #define vgb_logger_h
#endif // vgb_logger_h

/**
 *
 */
int hash_func_int(const int v)
{
    int tmp = v;
    if(tmp < 0)
    {
        tmp *= -1;
    }
    tmp = (tmp + HASH_ADJUST) % DEFAULT_HASH_SIZE;
    return tmp;
}

/**
 *
 */
int hash_func_str(const char *str, const int len)
{
    if(str == NULL)
    {
        return -1;
    }

    int v = 0;
    int cnt = 0;
    while(cnt < len)
    {
        v += (int)*(str + cnt);
        cnt += 1;
    }
    return hash_func_int(v);
}

/**
 *
 */
int hash_func_vstr(const struct vgb_str *vstr)
{
    if(vstr == NULL)
    {
        return -1;
    }

    int v = 0;
    int cnt = 0;
    int len = vstr->str_len;
    while(cnt < len)
    {
        v += (int)*(vstr->str + cnt);
        cnt += 1;
    }
    return hash_func_int(v);
}


/**
 *
 */
int init_vgb_hash(struct vgb_str *vstr)
{
    return 0;
}

/**
 *
 */
int binsearch(int *sorted, const int sidx, const int eidx, const int target)
{
    static cnt = 1;
    cnt += 1;
    if(cnt > 12)
    {
        return -1;
    }

    if(eidx <= sidx)
    {
        printf("NE binsearch: sidx: %d eidx: %d target: %d\n", sidx, eidx, target);
        return -1;
    }

    int idx = sidx + (int)ceil((double)(eidx - sidx)/2);
    if(target == sorted[idx])
    {
        printf("EQ binsearch: sidx: %d eidx: %d target: %d idx: %d sval: %d\n", sidx, eidx, target, idx, sorted[idx]);
        return idx;
    }
    else if(target < sorted[idx])
    {
        printf("LT binsearch: sidx: %d eidx: %d target: %d idx: %d sval: %d\n", sidx, eidx, target, idx, sorted[idx]);
        return binsearch(sorted, sidx, idx, target);
    }
    else //(target > sorted[idx])
    {
        printf("GT binsearch: sidx: %d eidx: %d target: %d idx: %d sval: %d\n", sidx, eidx, target, idx, sorted[idx]);
        return binsearch(sorted, idx, eidx, target);
    }
}

/**
 *
 */
int quicks(int *arr, const int alen, const int sidx, const int eidx)
{
    if(eidx <= sidx)
    {
        printf("quicks: end recursion\n");
        return 0;
    }

    int pivotIdx = eidx;
    int pivot = arr[eidx];
    printf("quicks: pivot value: %d idx: %d\n", pivot, pivotIdx);
    int i = sidx;
    int j = sidx;
    int tmp;
    for(; j <= eidx; j++)
    {
        if(arr[j] <= pivot)
        {
            if(arr[j] == pivot && j == pivotIdx)
            {
                pivotIdx = i;
            }
            tmp = arr[i];
            arr[i] = arr[j];
            arr[j] = tmp;
            i += 1;
        }
    }
    printf("quicks: pivot value: %d idx: %d\n", pivot, pivotIdx);
    quicks(arr, ((pivotIdx - 1) - sidx), sidx, pivotIdx - 1);
    quicks(arr, (eidx - (pivotIdx + 1)), pivotIdx + 1, eidx);
    return 1;
}

/**
 *
 */
int presort(int *arr, const int len)
{
    if(arr == NULL)
    {
        return 0;
    }

    if(len <= 1)
    {
        return 0;
    }

    int *tmp1;
    int *tmp2;
    int v1;
    int v2;
    for(int i = 1; i < len; i++)
    {
        //set ptrs
        tmp1 = (arr + (i - 1));
        tmp2 = (arr + i);

        //set vals
        v1 = *tmp1;
        v2 = *tmp2;

        //if out of order
        if(v1 > v2)
        {
            *(arr + (i - 1)) = v2;
            *(arr + i) = v1;
        }
    }
    return 1;
}

/**
 *
 */

/*
struct vgb_hash
{
    int id;
    int hint;
    struct vgb_list *data[DEFAULT_HASH_SIZE];
    int length;
};
*/
int init_vgb_hash_entry(struct vgb_hash *hsh, const int idx)
{
    if(hsh == NULL)
    {
        return 0;
    }

    if(idx < 0)
    {
        return 0;
    }

    if(idx >= hsh->length)
    {
        return 0;
    }

    struct vgb_list *lst = create_vgb_list();
    printf("0 addr: %p %p, id: %d\n", &lst, lst, lst->id);

    //All of these are the same operation
    *((hsh->data) + idx) = lst;
    printf("1 addr: %p %p, id: %d\n", ((hsh->data) + idx), *((hsh->data) + idx), ((struct vgb_list *)(*((hsh->data) + idx)))->id);

    //double checkS
    printf("1 %d\n", (*((struct vgb_list *)(*((hsh->data) + idx)))).id);

    struct vgb_list *tt = (struct vgb_list *)(*((hsh->data) + idx));
    printf("2 %d\n", (*tt).id);

    *((*hsh).data + idx) = lst;
    printf("2 addr: %p %p, id: %d\n", ((*hsh).data + idx), *((*hsh).data + idx), ((struct vgb_list *)(*((*hsh).data + idx)))->id);

    (hsh->data)[idx] = lst;
    printf("3 addr: %p %p, id: %d\n", &(hsh->data)[idx], (hsh->data)[idx], ((hsh->data)[idx])->id);
    return 1;
}
