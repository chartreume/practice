/*
*/

#include <stdio.h>
#include "genlib.h"

int main( void )
{
    string str;
    int i = 0;
    while( i < 10){

        i++;
        switch(i){
            case 1: str = "thumb";break;
            case 2: str = "shoe";break;
            case 3: str = "knee";break;
            case 4: str = "door";break;
            case 5: str = "hive";break;
            case 6: str = "sticks";break;
            case 7: str = "heaven";break;
            case 8: str = "pate";break;
            case 9: str = "spiine";break;
            case 10: str = "shin";break;
            default: str = "";break;
        }
        printf("This old man, he played %d.\n",i);
        printf("He played knick-knack on my %s.\n",str);
        printf("With a Knick-knack,paddy-whack,\n");
        printf("Give your dog a bone.\n");
        printf("This old man came rolling home.\n");
        printf("\t\n");
    }

    return 0;
}
