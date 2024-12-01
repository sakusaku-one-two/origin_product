echo "host all all ${API_IP} md5" >> /etc/postgresql/pg_hba.conf
echo "listen_addresses='*'" >> /etc/postgresql/postgresql.conf
echo "port = 5432" >> /etc/postgresql/postgresql.conf

