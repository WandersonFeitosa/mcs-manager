#!/bin/bash
screen -S manager
screen -S manager -X stuff "cd /home/ssd/projects/mcs-manager^M"
screen -S manager -X stuff "npm run start^M"