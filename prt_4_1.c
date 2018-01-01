/*
 * Practice : 4_1
 * The Art and Science of C
 */

#include <stdio.h>

 int main( void )
 {
     int max;
     for( max = 99 ; max > 0 ; max--)
     {
         printf("%d bottles of beer on the wall.\n",max);
         printf("%d bottles of beer.\n",max);
         printf("You take one down, pass it around.\n\t\n");
     }
     return 0;
 }
