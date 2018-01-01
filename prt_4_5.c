/*
*/

#include <stdio.h>

#define max 100

int main( void )
{
    int i = 0;
    for( ; i <= max ; i++) {
        if (( i % 6 == 0 || i % 7 == 0) && !( i % 6 == 0 && i % 7 == 0)){
            printf("%2d\n",i);
        }
    }
    return 0;
}
