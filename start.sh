#!/bin/bash
vncserver -kill :1 2>/dev/null
vncserver :1 -geometry 1920x1080 -depth 24
export DISPLAY=:1
openbox-session &
# noVNC support removed - use direct VNC client instead
