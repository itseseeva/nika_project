import os
from PIL import Image

def add_watermark(image_name):
    base_dir = r"E:\Users\username\Desktop\nika\frontend\public\products"
    logo_path = r"E:\Users\username\Desktop\nika\frontend\public\logo.jpg"
    
    image_path = os.path.join(base_dir, image_name)
    output_path = os.path.join(base_dir, image_name)
    
    try:
        base_image = Image.open(image_path).convert("RGBA")
        width, height = base_image.size
        
        logo = Image.open(logo_path).convert("RGBA")
        
        # Logo size: make it larger to cover the star
        logo_width = int(width * 0.28)  # 28% of width
        logo_aspect_ratio = logo.size[1] / logo.size[0]
        logo_height = int(logo_width * logo_aspect_ratio)
        
        logo = logo.resize((logo_width, logo_height), Image.Resampling.LANCZOS)
        
        # Transparent background for logo
        datas = logo.getdata()
        new_data = []
        for item in datas:
            # make white/light gray background transparent
            if item[0] > 230 and item[1] > 230 and item[2] > 230:
                new_data.append((255, 255, 255, 0)) 
            else:
                new_data.append(item)
        logo.putdata(new_data)
        
        # The star is slightly indented from the bottom-right corner
        margin_x = int(width * 0.02)
        margin_y = int(height * 0.02)
        
        x = width - logo_width - margin_x
        y = height - logo_height - margin_y
        
        transparent = Image.new('RGBA', base_image.size, (0,0,0,0))
        transparent.paste(logo, (x, y), logo)
        
        result = Image.alpha_composite(base_image, transparent)
        
        if output_path.lower().endswith('.jpg') or output_path.lower().endswith('.jpeg'):
            result = result.convert("RGB")
            result.save(output_path, quality=95)
        else:
            result.save(output_path)
            
        print(f"Successfully processed {image_name}")
    except Exception as e:
        print(f"Error processing {image_name}: {e}")

if __name__ == "__main__":
    add_watermark("Масло WOLF OFFICIALTECH 5W30 C3 SP EXTRA 5L.jpg")
    add_watermark("Масло WOLF VITALTECH 5W40 4L СИНТЕТИКА.jpg")
