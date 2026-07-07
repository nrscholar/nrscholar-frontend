fpath = r'e:\NR CREW\NR Scholar\nrscholar-frontend\src\features\dashboard\pages\ParentDashboardScreen.tsx'
content = open(fpath, 'r', encoding='utf-8').read()
start_idx = content.find('              <div>\n                <div className="flex justify-between text-xs font-bold mb-1.5">\n                  <span className="text-[#006a62]">Logic & Reasoning</span>')
end_idx = content.find('  );\n}')
if start_idx != -1 and end_idx != -1:
    new_content = content[:start_idx] + '''            <div className="bg-indigo-50 p-4 rounded-xl shadow-sm border border-indigo-100 mt-2">
              <p className="text-xs text-[#141779] leading-relaxed">
                <span className="font-bold text-[#141779]">Insight: </span> 
                Consistent upward trend this week! {strengths} Your child's logic scores peaked today at 92%.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
''' + content[end_idx:]
    open(fpath, 'w', encoding='utf-8').write(new_content)
    print('Successfully cleaned up the file.')
else:
    print('Could not find start or end indices')
