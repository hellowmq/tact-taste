"""Mux the original score, validate the actual MP4 and extract review images."""
import json
from pathlib import Path
import subprocess

ROOT=Path(__file__).resolve().parent.parent
TAKE=ROOT/'dist/showreel'
SILENT=TAKE/'tact-taste-showreel-silent.mp4'
MASTER=TAKE/'tact-taste-showreel.mp4'
QA=TAKE/'qa'
QA.mkdir(parents=True,exist_ok=True)

def run(args):
    return subprocess.run(args,text=True,capture_output=True,check=True)

if not SILENT.is_file():
    raise SystemExit('Finish stopped: render the silent master first.')
if MASTER.exists():
    raise SystemExit('Finish stopped: master exists; preserve it or use a new take.')

# Measured first pass on score-original.wav. Original I=-14.00, TP=-1.72, LRA=2.30.
norm='loudnorm=I=-18:TP=-1.5:LRA=8:measured_I=-14.00:measured_TP=-1.72:measured_LRA=2.30:measured_thresh=-24.07:offset=0.14:linear=true:print_format=json'
r=run(['ffmpeg','-hide_banner','-loglevel','info','-n','-i',str(SILENT),'-i',str(TAKE/'score-original.wav'),'-map','0:v:0','-map','1:a:0','-c:v','copy','-af',norm,'-c:a','aac','-b:a','192k','-ar','48000','-t','32','-movflags','+faststart',str(MASTER)])
(QA/'audio-normalization.log').write_text(r.stderr)
meta=json.loads(run(['ffprobe','-v','error','-count_frames','-show_entries','stream=codec_name,width,height,r_frame_rate,nb_read_frames,channels,sample_rate,duration:format=duration,size','-of','json',str(MASTER)]).stdout)
video=next(s for s in meta['streams'] if s['codec_name']=='h264')
audio=next(s for s in meta['streams'] if s['codec_name']=='aac')
assert (video['width'],video['height'])==(1920,1080)
assert video['r_frame_rate']=='30/1' and int(video['nb_read_frames'])==960
assert audio['channels']==2 and audio['sample_rate']=='48000'
assert abs(float(meta['format']['duration'])-32)<.05
(QA/'media-probe.json').write_text(json.dumps(meta,indent=2))
run(['ffmpeg','-hide_banner','-loglevel','error','-n','-i',str(MASTER),'-vf','fps=1/2,scale=480:270,tile=4x4','-frames:v','1',str(QA/'film-contactsheet.png')])
run(['ffmpeg','-hide_banner','-loglevel','error','-n','-i',str(MASTER),'-frames:v','1',str(TAKE/'poster.png')])
for seconds,name in [(10.8,'light'),(16.3,'type'),(19.8,'paper'),(26.5,'cancel'),(28.3,'confirm'),(30.4,'ending')]:
    run(['ffmpeg','-hide_banner','-loglevel','error','-n','-ss',str(seconds),'-i',str(MASTER),'-frames:v','1',str(QA/(name+'-decoded.png'))])
r=run(['ffmpeg','-hide_banner','-i',str(MASTER),'-af','ebur128=peak=true','-vn','-f','null','-'])
(QA/'encoded-audio-loudness.log').write_text(r.stderr)
r=run(['ffmpeg','-hide_banner','-i',str(MASTER),'-vf','blackdetect=d=0.10:pix_th=0.04:pic_th=0.99','-an','-f','null','-'])
(QA/'black-frame-check.log').write_text(r.stderr)
assert 'black_start:' not in r.stderr,'Unexpected black segment; review before delivery'
print(json.dumps({'master':str(MASTER),'seconds':32,'frames':960,'sizeMiB':round(MASTER.stat().st_size/1024**2,2),'format':'H.264 / AAC; 1920x1080; 30 fps; stereo 48 kHz','unexpectedBlackSegments':0},ensure_ascii=False))
