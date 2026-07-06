import pytesseract
from PIL import Image

try:
    img = Image.open("/home/chetan/Downloads/localhost_3000_practice_inventory(iPhone 12 Pro) (1).png")
    text = pytesseract.image_to_string(img)
    print(text)
except Exception as e:
    print("Error:", e)
