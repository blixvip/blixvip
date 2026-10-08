## Kaihan Wasely

I build local-first tools for video work. Most of them run entirely on your own
machine: no server to sign into, no API keys to paste, and no usage meter. Where a
tool needs a model, it borrows the Codex or Claude Code login you already have
rather than asking for a new one.

Based in Canada. Reachable at [kaiguy432@gmail.com](mailto:kaiguy432@gmail.com)
or [@waselyyy](https://x.com/waselyyy).

### Projects

| | |
|---|---|
| **[MotionClone](https://github.com/blixvip/MotionClone)** | Point it at a reference video and it rebuilds the piece as an editable HyperFrames project, then plays the rebuild against the original so you can see where the timing drifts. Exports MP4. Python, Windows app. |
| **[easyedit](https://github.com/blixvip/easyedit)** | Type a movie name, get a fan edit: the film's best speech in animated captions, then a montage cut to the beat. Transcription with Whisper, cuts driven by onset detection. |
| **[Null Motion](https://github.com/blixvip/NullMotion)** | Plays a finished motion-graphics ad in sync with the rough drafts it grew from, so the work between them is visible. Exports the breakdown as a single MP4. |
| **[html-anime](https://github.com/blixvip/html-anime)** | Turns a scene prompt into a shot sheet, then has a coding agent draw the film in HTML and CSS. No video model involved — the frames are code. |
| **[skills](https://github.com/blixvip/skills)** | The agent skills I actually use day to day, as drop-in `SKILL.md` folders for Claude Code and Codex: motion graphics, After Effects scripting, thumbnails, UI review. |
| **[blixtrade](https://github.com/blixvip/blixtrade)** | Solana memecoin terminal: live pump.fun feed, holder ledgers that separate snipers from bundles, real Jupiter quotes. Ships a public read API and an MCP server. |
| **[X Media](https://github.com/blixvip/x-media)** | Browse public X media and tweets by username in a local Next.js app. No login, no API key. |
| **[AI Broadcaster](https://github.com/blixvip/ai-broadcaster)** | Chrome extension that sends one prompt, image, or PDF to several AI chats at once and verifies each one received it. Manifest V3. |
| **[phonectl](https://github.com/blixvip/phonectl)** | Drive an Android phone from your computer over adb and scrcpy: browser dashboard, CLI, and a build → screenshot → verify loop for agents. |

### How these are built

The constraint I keep coming back to is that a creative tool should work offline and
leave its output in a format you can edit by hand afterwards. So the video projects
compile to plain HTML and CSS rather than a binary timeline, the editors write files
you can open in a text editor, and nothing phones home. Mostly Python and
TypeScript, with ffmpeg doing the heavy lifting.

### Elsewhere

[motionclone.lol](https://motionclone.lol) ·
[nullmotion.com](https://www.nullmotion.com/) ·
[Discord](https://discord.gg/zEB4VjmfSb) ·
[Kick](https://kick.com/blixvip) ·
[Twitch](https://www.twitch.tv/blixvip)
