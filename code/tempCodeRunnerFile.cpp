
bool isPalindrome(int num) {
    if (num < 0) return false; 

    int original = num;
    int concat = 0;

    while (num > 0) {
        int digit = num % 10;          
        concat = concat * 10 + digit; 
        num /= 10;                        
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
