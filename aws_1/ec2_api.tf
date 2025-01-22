resource "aws_instance" "demo_app_api" {
  ami = "ami-08f52b2e87cebadd9"
  instance_type = "t2.micro"
  subnet_id = aws_subnet.demo_app_public_subnet[0].id
  key_name = aws_key_pair.demo_my_key_pair.key_name
  vpc_security_group_ids = [aws_security_group.demo_app_api_security_group.id]
  associate_public_ip_address = true
  depends_on = [aws_db_instance.example]

  connection {
    type = "ssh"
    host = coalesce(self.public_ip, self.private_ip)
    user = "ec2-user"
    private_key = tls_private_key.example.private_key_pem
  }
  user_data = <<-EOF
  #!/bin/bash
  sudo yum update -y
  wget https://go.dev/dl/go1.23.1.linux-amd64.tar.gz
  sudo tar -C /usr/local -xzf go1.23.1.linux-amd64.tar.gz
  echo "export API_PORT=8080" >> /etc/environment
  echo "export DB_HOST=${aws_db_instance.example.address}" >> /etc/environment
  echo "export DB_USER=${var.db_user}" >> /etc/environment
  echo "export DB_PASSWORD=${var.db_password}" >> /etc/environment
  echo "export DB_NAME=${var.db_name}" >> /etc/environment
  echo "export DB_PORT=${var.db_port}" >> /etc/environment
  echo "export DB_SSL=${var.db_ssl}" >> /etc/environment
  echo "export AllowOrigin=${aws_route53_record.demo_app_dns_next.name}" >> /etc/environment
  echo "export DB_TIMEZONE=${var.db_timezone}" >> /etc/environment
  echo 'PATH="/usr/local/sbin:/usr/local/bin:/usr/sbin:/usr/bin:/sbin:/bin:/usr/local/go/bin"' >> /etc/environment
  
  # ログディレクトリの作成
  sudo mkdir -p /var/log/myapp
  
  cd /home/ec2-user/backend
  sudo chmod +x ec2_api_user_data.sh
  ./ec2_api_user_data.sh
  
  EOF

  user_data_replace_on_change = true
  
  provisioner "remote-exec" {
    inline = [
      "go mod tidy",
      "go build -v -o main_aws main.go",
      "chmod +x main_aws",
      "./ec2_api_user_data.sh",
      "cat <<'SERVICEEOF' > /etc/systemd/system/api.service",
      "[Unit]",
      "Description=Go Application Service",
      "After=network.target",
      "[Service]",
      "Type=simple",
      "User=root",
      "WorkingDirectory=/home/ec2-user/backend",
      "Environment=API_PORT=8080",
      "Environment=DB_HOST=${aws_db_instance.example.address}",
      "Environment=DB_USER=${var.db_user}",
      "Environment=DB_PASSWORD=${var.db_password}",
      "Environment=DB_NAME=${var.db_name}",
      "Environment=DB_PORT=${var.db_port}",
      "Environment=DB_SSL=${var.db_ssl}",
      "ExecStart=/home/ec2-user/backend/main_aws",
      "Restart=always",
      "StandardOutput=append:/var/log/api/application.log",
      "StandardError=append:/var/log/api/error.log",
      "[Install]",
      "WantedBy=multi-user.target",
       
  
  # サービスの起動
  "sudo systemctl daemon-reload",
  "sudo systemctl enable api",
  "sudo systemctl start api",

  "sudo cat <<EOF > /etc/logrotate.d/myapp",
  "/var/log/myapp/*.log {",
  "daily",
  "rotate 7",
  "compress",
  "delaycompress",
  "missingok",
  "notifempty",
  "create 0640 root root",
  "}" 
  ]
  }
  
  provisioner "file" {
    source = "../backend"
    destination = "/home/ec2-user/backend"
  }

  provisioner "file" {
    source = "./ec2_api_user_data.sh"
    destination = "/home/ec2-user/backend/ec2_api_user_data.sh"
  }

  provisioner "file" {
    source = "./ec2_api_rds.sql"
    destination = "/home/ec2-user/backend/ec2_api_rds.sql"
    
  }

  provisioner "local-exec" {
    command = "echo ${aws_instance.demo_app_api.public_ip} > public_ip.txt"
  }
  
  tags = {
    Name = "demo-app-api"
  }
}