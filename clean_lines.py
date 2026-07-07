import os

fpath = r'e:\NR CREW\NR Scholar\nrscholar-frontend\src\features\dashboard\pages\ParentDashboardScreen.tsx'
with open(fpath, 'r', encoding='utf-8') as f:
    lines = f.readlines()

# delete lines 368 to 416 (which is index 367 to index 416 non-inclusive)
new_lines = lines[:367] + lines[416:]

with open(fpath, 'w', encoding='utf-8') as f:
    f.writelines(new_lines)
    
print("Successfully deleted lines 368-416.")
