channelId="1231021187577155644"
route="https://b5c1b50f-3001.brs.devtunnels.ms/v1/bob/send-server-message"
remaining_seconds=180
timeout=60

function send_message (){ 
    curl -X POST -H "Content-Type: application/json" -d "{\"message\": \"$1\", \"channelId\": \"$channelId\"}" "$route"
    screen -S tcsmp -X stuff "say $1^M"
}

for ((i=0; i < remaining_seconds; i+=timeout)); do
    remaining_minutes=$((remaining_seconds / 60))
    remaining_time=$((remaining_minutes > 0 ? remaining_minutes : remaining_seconds))
    time_label=$([ "$remaining_minutes" -gt 1 ] && echo "minutos" || echo "segundos")
    message="O servidor será reiniciado para a realização do backup em $remaining_time $time_label, aguarde que logo voltaremos"
    send_message "$message"
    sleep $timeout
    remaining_seconds=$((remaining_seconds - timeout))
done


curl -X POST -H "Content-Type: application/json" -d "{\"message\": \"Iniciando backup, servidor fechado\", \"channelId\": \"${channelId}\"}" "$route"
screen -S tcsmp -X stuff "stop^M"

sleep 20

backup_date=$(date +%Y-%m-%d)

zip -r "/home/hd/backup-$backup_date.zip" "/home/ssd/tcsmp"

curl -X POST -H "Content-Type: application/json" -d "{\"message\": \"Backup finalizado, iniciando o servidor\", \"channelId\": \"${channelId}\"}" "$route"

screen -S tcsmp -X stuff "bash run.sh^M"

sleep 60

curl -X POST -H "Content-Type: application/json" -d "{\"message\": \"Servidor Iniciado\", \"channelId\": \"${channelId}\"}" "$route"
