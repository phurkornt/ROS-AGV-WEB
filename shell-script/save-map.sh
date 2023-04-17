#!/usr/bin/env bash
cd /home/agv/agv/map
rosrun map_server map_saver -f $1
echo "navigation"
