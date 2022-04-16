//STD INCLUDES
#ifndef stdlib_h
    #include <stdlib.h>
    #define stdlib_h
#endif // stdlib_h

#ifndef string_h
    #include <string.h>
    #define string_h
#endif // string_h

#ifndef math_h
    #include <math.h>
    #define math_h
#endif // math_h

//VGB INCLUDES
#ifndef vgbbin_h
    #include "vgbbin.h"
    #define vgbbin_h
#endif // vgbbin_h

/**
 *
 */
int binsearch(int *sorted, const int sidx, const int eidx, const int target)
{
    if(eidx <= sidx)
    {
        //printf("NE binsearch: sidx: %d eidx: %d target: %d\n", sidx, eidx, target);
        return -1;
    }

    int idx = sidx + (int)ceil((double)(eidx - sidx)/2);
    if(target == sorted[idx])
    {
        //printf("EQ binsearch: sidx: %d eidx: %d target: %d idx: %d sval: %d\n", sidx, eidx, target, idx, sorted[idx]);
        return idx;
    }
    else if(target < sorted[idx])
    {
        //printf("LT binsearch: sidx: %d eidx: %d target: %d idx: %d sval: %d\n", sidx, eidx, target, idx, sorted[idx]);
        return binsearch(sorted, sidx, idx, target);
    }
    else //(target > sorted[idx])
    {
        //printf("GT binsearch: sidx: %d eidx: %d target: %d idx: %d sval: %d\n", sidx, eidx, target, idx, sorted[idx]);
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
        //printf("quicks: end recursion\n");
        return 0;
    }

    int pivotIdx = eidx;
    int pivot = arr[pivotIdx];
    //printf("quicks: pivot value: %d idx: %d\n", pivot, pivotIdx);
    int i = sidx;
    int j = sidx;
    int tmp;
    for(; j <= eidx; j++)
    {
        if(arr[j] <= pivot)
        {
            if(i != j)
            {
                if(arr[j] == pivot && j == pivotIdx)
                {
                    pivotIdx = i;
                    pivot = arr[pivotIdx];
                }
                tmp = arr[i];
                arr[i] = arr[j];
                arr[j] = tmp;
            }
            i += 1;
        }
    }
    //printf("quicks: pivot value: %d idx: %d\n", pivot, pivotIdx);
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
