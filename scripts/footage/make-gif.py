#!/usr/bin/env python3
"""Cut a Playwright webm into a social GIF + MP4.
usage: make-gif.py in.webm out_base --seg START END SPEED [--seg ...] [--crop x:y:w:h] [--width 1000] [--fps 12]
Segments are concatenated in order; speed>1 plays faster."""
import argparse, subprocess, os, tempfile, shlex
p=argparse.ArgumentParser()
p.add_argument('src'); p.add_argument('out')
p.add_argument('--seg', nargs=3, action='append', metavar=('START','END','SPEED'), required=True)
p.add_argument('--crop', default=None)  # x:y:w:h in source pixels
p.add_argument('--width', type=int, default=1000)
p.add_argument('--fps', type=int, default=12)
p.add_argument('--mp4width', type=int, default=1440)
a=p.parse_args()
parts=[]; cmd_in=[]
filt=[]
for i,(s,e,sp) in enumerate(a.seg):
    cmd_in += ['-ss', s, '-to', e, '-i', a.src]
    chain = f'[{i}:v]setpts=PTS/{sp}'
    if a.crop:
        x,y,w,h=a.crop.split(':'); chain += f',crop={w}:{h}:{x}:{y}'
    chain += f'[v{i}]'
    filt.append(chain)
concat=''.join(f'[v{i}]' for i in range(len(a.seg)))+f'concat=n={len(a.seg)}:v=1:a=0[cat]'
filt.append(concat)
# master mp4 (clean) at mp4width
mp4_filter=';'.join(filt)+f';[cat]fps=30,scale={a.mp4width}:-2:flags=lanczos,format=yuv420p[out]'
subprocess.run(['ffmpeg','-y','-hide_banner','-loglevel','error',*cmd_in,'-filter_complex',mp4_filter,'-map','[out]','-c:v','libx264','-crf','22','-preset','slow','-movflags','+faststart','-an',a.out+'.mp4'],check=True)
# gif: two-pass palette from the same chain
gif_chain=';'.join(filt)+f';[cat]fps={a.fps},scale={a.width}:-1:flags=lanczos,split[p1][p2];[p1]palettegen=max_colors=200:stats_mode=diff[pal];[p2][pal]paletteuse=dither=bayer:bayer_scale=4:diff_mode=rectangle[gif]'
subprocess.run(['ffmpeg','-y','-hide_banner','-loglevel','error',*cmd_in,'-filter_complex',gif_chain,'-map','[gif]','-loop','0',a.out+'.gif'],check=True)
# webm too
subprocess.run(['ffmpeg','-y','-hide_banner','-loglevel','error','-i',a.out+'.mp4','-c:v','libvpx-vp9','-b:v','0','-crf','34','-row-mt','1','-an',a.out+'.webm'],check=True)
for ext in ('.mp4','.gif','.webm'):
    print(ext, os.path.getsize(a.out+ext)//1024, 'KB')
