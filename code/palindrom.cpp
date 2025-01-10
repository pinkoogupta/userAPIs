#include<bits/stdc++.h>
using namespace std;



// for string 


bool isPalindrome(const string& str) {
    int l = 0;
    int r = str.length() - 1;

    while (l < r) {
        if (str[l] != str[r]) {
            return false;
        }
        l++;
        r--;                                     //T.C =O(n)
                                                 //S.C=O(1)
    }

    return true;
}

int main() {
    string s;
    cout << "Enter a string: ";
    cin >> s;

    if (isPalindrome(s)) {
        cout << "The string is a palindrome." << endl;
    } else {
        cout << "The string is not a palindrome" << endl;
    }

    return 0;
}




bool isPalindrome(int num) {
    if (num < 0) return false; 

    int original = num;
    int concat = 0;

    while (num > 0) {
        int digit = num % 10;          
        concat = concat * 10 + digit; 
        num /= 10;                           //T.C=O(logn)
                                            //S.C=O(1) 
    }

    return original == concat;
}

int main() {
    int input;
    cout << "Enter a number: ";
    cin >> input;

    if (isPalindrome(input)) {
        cout << "The number is a palindrome." << endl;
    } else {
        cout << "The number is not a palindrome." << endl;
    }

    return 0;
}
