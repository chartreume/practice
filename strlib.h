
/*
 * File : strlib.h
 * ---------------
 * The strlib.h file defines the interface for a simple
 * string library. In the context of this package, strings
 * are considered to be an abstract data type, which means
 * that the client relies only on the operations defined for
 * the type and not on the underlying representation.
 */

/*
 * Cautionary note :
 * ---------------
 * Although this interface provides an extremely convenient
 * abstraction for working with string, it is not appropriate
 * for all allpications. In this interface, the functions that
 * return string values (such as Concat and SubString ) do so
 * by allocating new memory. Over time, a program that uses
 * this package will consume increasing amounts of memory
 * and eventually exhahst the available supply. If you are
 * writing a program that runs for a short time and stops.
 * the fact that the package consumes memory is not a problem.
 * If, however, you are writing an application that must run
 * for an extended period of  time, using this package requires
 * that you make some provision for freeing any allocated
 * storage.
 */

#ifndef _strlib_h
#define _strlib_h

#include "genlib.h"

/* Section 1 -- Basic string operations */

/*
 * Function : Concat
 * Usage : s = Concat(s1,s2);
 * ---------
 * This function concatenates two strings by joining them end
 * to end. For example, Concat("ABC","DE") returns the string
 * "ABCDE".
 */

string Concat( string s1, string s2 );

/*
 * Function IthChar
 * Usage : ch = IthChar( s , i );
 * ----------
 * This function returns the character at position i in the
 * string s. It is included in the library to make the type
 * string a true abstract type in the sense that all of the
 * necessary operations can be invoked using functions. Calling
 * IthChar(s,i) is like selecting s[i], except that IthChar
 * checks to see if i is within the range of legal index
 * positions, which extend form 0 to StringLength(s).
 * IthChar(s, StringLength(s)) returns the null character
 * at the end of the string.
 */

char IthChar( string s, int i );


/*
 * Function : SubString
 * Usage : t = SubString(s, p1, p2);
 * ------------
 * SubString return a copy of the substring of s consisting
 * of the characters between index positions p1 and p2,
 * inclusive. The following special cases apply:
 *
 * 1. If p1 is less than 0 , it is assumed to be 0.
 * if p2 is greater the the index of the last string