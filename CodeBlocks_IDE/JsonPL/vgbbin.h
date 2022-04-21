/**
 * Name: presort
 * Desc: A function that performs a simple presort scanning the given array and flipping the
 *       every adjacent pair of values such that they are in order.
 * Arg1: int *arr(an array to pre-sort)
 * Arg2: const int len(the length of the given array)
 * Returns: {0 | 1}
 */
int presort(int *arr, const int len);

/**
 * Name: quicks
 * Desc: An implementation of the quick sort algorithm.
 * Arg1: int *arr(an array to quick sort)
 * Arg2: const int alen(the length of the given array)
 * Arg3: const int sidx(the start index of the given array)
 * Arg4: const int eidx(the end index of the given array)
 * Returns: {0 | 1}
 */
int quicks(int *arr, const int alen, const int sidx, const int eidx);

/**
 * Name: binsearch
 * Desc: An implementation of the binary search algorithm.
 * Arg1: int *sorted(a sorted array of ints)
 * Arg2: const int sidx(the start index of the given array)
 * Arg3: const int eidx(the end index of the given array)
 * Arg4: const int target(the target value to find)
 * Returns: {0 | 1}
 */
int binsearch(int *sorted, const int sidx, const int eidx, const int target);
