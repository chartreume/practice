/*
*/

#include <stdio.h>

#define max 100

int main(void){
    int i;

    for(i = 1; i <= max; i++ ){
        if( i % 6 == 0 || i % 7 == 0){
            printf("%4d\n",i);
        }
    }
    return 0;
}
