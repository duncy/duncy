#! /bin/bash

killall -q polybar

if type "xrandr"; then
  for m in $(xrandr --query | grep " connected" | cut -d" " -f1); do
    if [ $m == "HDMI-A-0" ]; then
      MONITOR=$m WIDTH="98.2%:-17" polybar --reload example &
    else 
      MONITOR=$m WIDTH="98.2%" polybar --reload example &
    fi
  done
else
  polybar --reload &
fi
