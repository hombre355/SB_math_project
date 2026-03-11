# Sarah-Beth's Math Adventure

A fun, unicorn-themed math learning website for Sarah-Beth to practice addition and subtraction with progressive difficulty. Runs as a Docker container on a NAS — always on, auto-restarts after reboots.

## Deploy on a NAS

### Option A: SSH / Command Line

Copy the project folder to your NAS, SSH in, and run:

```bash
cd /path/to/SB_math_website
docker compose up -d --build
```

Done. The site is live at **`http://<nas-ip>:8080`** and will restart automatically after NAS reboots.

### Option B: Synology (Container Manager)

1. Copy the project folder to a shared folder on the Synology (e.g. via SMB)
2. SSH into the Synology and run:
   ```bash
   cd /volume1/docker/SB_math_website   # adjust path to match your shared folder
   docker compose up -d --build
   ```
3. The container will appear in **Container Manager** with a health check

Alternatively, build the image via SSH then create the container through the Synology GUI, mapping port 8080 to internal port 80.

### Option C: QNAP (Container Station)

1. Copy the project folder to the NAS
2. SSH in and run `docker compose up -d --build`
3. The container will appear in Container Station

### Option D: Unraid

1. Copy the project folder to a share on the Unraid server
2. Open a terminal and run `docker compose up -d --build`

## Access from Sarah-Beth's Laptop

Open a browser and go to: **`http://<nas-ip>:8080`**

To change the port, edit the first number in `docker-compose.yml`:
```yaml
ports:
  - "8080:80"   # change 8080 to any open port you like
```

Then rebuild: `docker compose up -d --build`

## Updating After Code Changes

```bash
docker compose up -d --build
```

## Useful Commands

```bash
docker ps                    # verify it's running
docker compose logs          # view logs
docker compose restart       # restart
docker compose down          # stop and remove
docker compose up -d --build # rebuild after changes
```

## How It Works

- **20 progressive levels**: 12 addition + 8 subtraction
- **10 correct in a row** advances to the next level
- Teaching tutorials introduce new concepts (place values, carrying, borrowing)
- **Read Aloud button** reads the screen text in a child-friendly voice
- Progress is saved automatically in the browser (localStorage)
- Works on any device with a modern web browser

## Features

- Personalized greetings for Sarah-Beth
- Twinkle the Unicorn mascot with rainbow mane
- Confetti celebrations for correct answers
- Sound effects (can be muted in Settings)
- Text-to-speech read-aloud on every screen
- Keyboard support (type digits, Enter to submit, Backspace to delete)
- Responsive design (works on tablets, phones, laptops)
- Color-coded place value columns

## Important Notes

- **Progress** is saved per-browser on Sarah-Beth's device. Persists between sessions automatically.
- **No internet required** after the initial Docker image build.
- **No accounts or data collection** — fully private, runs on your own network.
- **Chrome** gives the best read-aloud voice quality.
- Port 80 is usually taken by the NAS web UI, which is why this defaults to **8080**.
