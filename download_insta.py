import instaloader
import os

USERNAME = "mruarts.shop"   # replace with your Instagram login
TARGET = "mruarts.shop"            # the public profile you want to download
SESSION_FILE = f"session-{USERNAME}"

L = instaloader.Instaloader(
    download_videos=False,          # skip reels/videos
    download_video_thumbnails=False,
    save_metadata=False,
    compress_json=False
)

# Try loading saved session if it exists
if os.path.exists(SESSION_FILE):
    print("✅ Using saved session...")
    L.load_session_from_file(USERNAME, SESSION_FILE)
else:
    print("🔑 Logging in for the first time...")
    password = input(f"Enter Instagram password for {USERNAME}: ")
    L.login(USERNAME, password)
    L.save_session_to_file(SESSION_FILE)
    print("✅ Session saved. Next time, no password needed.")

print(f"📥 Downloading posts from: {TARGET}")

try:
    profile = instaloader.Profile.from_username(L.context, TARGET)
    for post in profile.get_posts():
        if not post.is_video:  # only photos
            L.download_post(post, target=TARGET)
    print("🎉 Download complete!")
except Exception as e:
    print(f"❌ Error: {e}")
