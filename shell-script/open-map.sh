#!/usr/bin/env bash
cd ~
GNOME_TERMINAL_SCREEN="HELLO" gnome-terminal -- roslaunch map.launch map:=$1
#  rosrun map_server map_server $1.yaml
echo "open map $1 "
