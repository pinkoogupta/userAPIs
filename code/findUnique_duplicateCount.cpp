#include<bits/stdc++.h>
using namespace std;

void findUniqueAndCountDuplicates(const vector<int>& arr) {
    unordered_map<int, int> Map;

    
    for (int i : arr) {
        Map[i]++;
    }

    // Print unique values and count duplicates
    cout << "Unique values: ";
    int duplicateCount = 0;

    for (auto i : Map) {
        if (i.second == 1) {
            cout << i.first << " ";
        } else {
            duplicateCount++;
        }
    }

    cout << endl;
    cout << "Number of duplicate values: " << duplicateCount << endl;
}

int main() {
    vector<int> arr = {1, 2, 3, 2, 4, 5, 3, 6, 7, 1};

    findUniqueAndCountDuplicates(arr);

    return 0;
}
