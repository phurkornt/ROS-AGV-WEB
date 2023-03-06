#!/usr/bin/env bash
cd ~
GNOME_TERMINAL_SCREEN="HELLO" gnome-terminal -- roslaunch createmap.launch xmin:=-$1 ymin:=-$2 xmax:=$1 ymax:=$2                       
echo "navigation"
