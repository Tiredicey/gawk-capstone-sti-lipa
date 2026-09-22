from pathlib import Path
import math
import subprocess
from PIL import Image, ImageDraw

root = Path(__file__).resolve().parents[1] / 'public' / 'static'
width, height, fps, duration = 960, 640, 24, 8
encoder = subprocess.Popen(['ffmpeg', '-y', '-loglevel', 'error', '-f', 'rawvideo', '-pix_fmt', 'rgb24', '-s', f'{width}x{height}', '-r', str(fps), '-i', '-', '-an', '-c:v', 'libx264', '-threads', '2', '-preset', 'slow', '-crf', '24', '-pix_fmt', 'yuv420p', '-movflags', '+faststart', str(root / 'idea-orbit.mp4')], stdin=subprocess.PIPE)
for frame in range(fps * duration):
    phase = frame / (fps * duration) * math.tau
    image = Image.new('RGB', (width, height), '#193e37')
    draw = ImageDraw.Draw(image)
    for x in range(32, width, 48):
        for y in range(32, height, 48):
            draw.ellipse((x, y, x + 2, y + 2), fill='#31544a')
    cx, cy = 470, 315
    for radius in (190, 245, 295):
        draw.ellipse((cx-radius, cy-radius*.72, cx+radius, cy+radius*.72), outline='#547369', width=2)
    drift = math.sin(phase) * 9
    draw.rounded_rectangle((cx-135, cy-138+drift, cx+135, cy+140+drift), radius=46, fill='#d9e5ae')
    draw.rounded_rectangle((cx-104, cy-104+drift, cx+104, cy+106+drift), radius=31, outline='#738957', width=2)
    draw.arc((cx-62, cy-68+drift, cx+65, cy+59+drift), 48, 312, fill='#254b3b', width=17)
    draw.ellipse((cx+54, cy+44+drift, cx+73, cy+63+drift), fill='#254b3b')
    for radius, offset, color, size in [(245, 0, '#e4a780', 36), (295, 2.3, '#b6b6dd', 30), (190, 4.5, '#a4c8b7', 22)]:
        angle = phase + offset
        x, y = cx + math.cos(angle)*radius, cy + math.sin(angle)*radius*.72
        draw.ellipse((x-size+5,y-size+7,x+size+5,y+size+7),fill='#15362e')
        draw.ellipse((x-size,y-size,x+size,y+size),fill=color)
        draw.arc((x-size+8,y-size+8,x+size-8,y+size-8),195,285,fill='#fff5df',width=2)
    if frame == 0:
        image.save(root / 'idea-orbit.webp', quality=86)
    encoder.stdin.write(image.tobytes())
encoder.stdin.close()
if encoder.wait() != 0:
    raise RuntimeError('Video encoding failed')
print('Rendered original decorative orbit and static poster.')
