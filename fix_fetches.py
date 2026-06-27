import os
import glob

# Find all tsx files in src
files = glob.glob('src/**/*.tsx', recursive=True)
files = [f for f in files if f != 'src/features/auth/pages/LoginScreen.tsx']

for f in files:
    with open(f, 'r') as file:
        content = file.read()
    
    if 'fetch(' in content:
        # Determine relative path to src/api.ts
        depth = f.count('/') - 1
        rel_path = '../' * depth + 'api'
        
        # Add import if not there
        if 'apiFetch' not in content:
            import_str = f'import {{ apiFetch }} from "{rel_path}";\n'
            lines = content.split('\n')
            # insert after the last import
            last_import = 0
            for i, line in enumerate(lines):
                if line.startswith('import '):
                    last_import = i
            lines.insert(last_import + 1, import_str)
            content = '\n'.join(lines)
            
        # Replace fetch( with apiFetch(
        content = content.replace('await fetch(', 'await apiFetch(')
        
        # Remove manual Authorization headers since apiFetch handles it!
        # Wait, if we keep them, apiFetch will just override or we'll send it twice?
        # apiFetch has: const headers = new Headers(options.headers || {}); headers.set("Authorization", ...)
        # It's fine if they are passed. But wait, `apiFetch` does headers.set, which overrides it.
        
        with open(f, 'w') as file:
            file.write(content)
        print(f"Updated {f}")
