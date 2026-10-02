# Open-source components

- @ffmpeg/ffmpeg 0.12.15: MIT. Source and license: https://github.com/ffmpegwasm/ffmpeg.wasm
- @ffmpeg/core 0.12.10: GPL-2.0-or-later (as declared by the distributed npm package). Includes FFmpeg and codec libraries. Source, build instructions and component licenses: https://github.com/ffmpegwasm/ffmpeg.wasm/tree/v0.12.10
- FFmpeg source and license information: https://ffmpeg.org/legal.html ; https://github.com/FFmpeg/FFmpeg

The converter uses the unmodified upstream binary core. The build step splits the exact WASM bytes into static pieces; the browser reconstructs them before loading. Versions are pinned in package-lock.json.
