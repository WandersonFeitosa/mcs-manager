#!/bin/bash
channelId="1242165928804749505"
hybrid_channelId="1250125769196437586"
apiUrl="http://34.44.97.77"
msgroute="$apiUrl/v1/bob/send-server-message"
updateStatusRoute="$apiUrl/v1/minecraft/update-status"
uploadBackupRoute="http://localhost:3003/upload-backup"
remaining_seconds=300

function send_message (){
    curl -X POST -H "Content-Type: application/json" -d "{\"message\": \"$1\", \"channelId\": \"$channelId\"}" "$msgroute"
    curl -X POST -H "Content-Type: application/json" -d "{\"message\": \"$1\", \"channelId\": \"$hybrid_channelId\"}" "$msgroute"
    screen -S tcsmp -X stuff "say $1^M"
}

while [ $remaining_seconds -gt 0 ]; do
    if [ $remaining_seconds -gt 60 ]; then
        send_message "O servidor será reiniciado para a realização do backup em $((remaining_seconds / 60)) minutos, aguarde que logo voltaremos"
        remaining_seconds=$((remaining_seconds - 60))
        sleep 60
        elif [ $remaining_seconds -gt 30 ]; then
        send_message "O servidor será reiniciado para a realização do backup em 1 minuto, aguarde que logo voltaremos"
        remaining_seconds=$((remaining_seconds - 30))
        sleep 30
    else
        send_message "O servidor será reiniciado para a realização do backup em $remaining_seconds segundos, aguarde que logo voltaremos"
        sleep 10
        remaining_seconds=$((remaining_seconds - 10))
    fi
done


curl -X POST -H "Content-Type: application/json" -d "{\"message\": \"Iniciando backup, servidor fechado\", \"channelId\": \"${channelId}\"}" "$msgroute"
curl -X POST -H "Content-Type: application/json" -d "{\"message\": \"Iniciando backup, servidor fechado\", \"channelId\": \"${hybrid_channelId}\"}" "$msgroute"
screen -S tcsmp -X stuff "stop^M"

sleep 20

backup_date=$(date +%Y-%m-%d)
file_name="backup-$backup_date.zip"

zip -r "/home/hd/$file_name" "/home/ssd/tcsmp"

curl -X POST -H "Content-Type: application/json" -d "{\"message\": \"Backup finalizado, iniciando o servidor\", \"channelId\": \"${channelId}\"}" "$msgroute"
curl -X POST -H "Content-Type: application/json" -d "{\"message\": \"Backup finalizado, iniciando o servidor\", \"channelId\": \"${hybrid_channelId}\"}" "$msgroute"

screen -S tcsmp -X stuff "bash run.sh^M"

rm /home/ssd/tcsmp/backup-lock

curl -X PATCH -H "Content-Type: application/json" -d "{\"status\": \"pending\"}" "$updateStatusRoute"

curl -X POST -H "Authorization: Bearer morango" -H "Content-Type: application/json" -d "{\"fileName\": \"$file_name\"}" "$uploadBackupRoute"