#!/bin/sh

userresources=$HOME/.Xresources
usermodmap=$HOME/.Xmodmap
sysresources=/etc/X11/xinit/.Xresources
sysmodmap=/etc/X11/xinit/.Xmodmap

# Set up monitors
xrandr --output DisplayPort-2 --below DisplayPort-1 
xrandr --output HDMI-A-0 --right-of DisplayPort-2 --rotate left

# Set wallpaper
xwallpaper --tile ~/.config/wall.png &

if [ -d /etc/X11/xinit/xinitrc.d ]; then
	for f in /etc/X11/xinit/xinitrc.d/?*.sh; do
		[ -x "$f" ] && . "$f"
	done
	unset f
fi

xbindkeys

# Shadow
picom &

# Start dwmblocks
dwmblocks &

# Start window manager
while true; do
    # Log stderror to a file 
    dwm 2> ~/.dwm.log
    # No error logging
    #dwm >/dev/null 2>&1
done



