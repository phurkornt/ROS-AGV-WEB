#!/usr/bin/env bash
cd ~
gnome-terminal -- roslaunch createmap.launch xmin:=-$1 ymin:=-$2 xmax:=$1 ymax:=$2                       
echo "navigation"
