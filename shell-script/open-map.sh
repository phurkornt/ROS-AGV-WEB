#!/usr/bin/env bash
cd ~/agv/map
gnome-terminal -- rosrun map_server map_server $1.yaml
set-title Hello World!
echo "open map $1 "
