#include <stdio.h>

int main( void )
{
    // 7 or higher require
    char str[][7] = { "thumb", "shoe", "knee", "door", "hive", "sticks", "heaven", "pate", "spine","shin"};
    int i = 0;

    for(; i < 10 ;i++){
        printf("This old man, he played %d.\n",i+1);
        printf("He played knick-knack on my %s.\n", str[i] );
        printf("With a Knick-knack,paddy-whack,\n");
        printf("Give your dog a bone.\n");
        printf("This old man came rolling home.\n");
        printf("\t\n");
    }
}
