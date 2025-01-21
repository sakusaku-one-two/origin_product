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

  user_data = <<EOF
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
  echo "export AllowOrigin=${data.aws_route53_zone.demo_app_zone.name}" >> /etc/environment
  echo "export DB_TIMEZONE=${var.db_timezone}" >> /etc/environment
  echo 'export PATH=$PATH:/usr/local/go/bin' >> /etc/environment
  source /etc/environment
  go version
  cd /home/ec2-user/backend
  go build -o main main.go
  chmod +x main
  nohup sudo ./main &

  EOF

  provisioner "file" {
    source = "../backend"
    destination = "/home/ec2-user/backend"
  }


  provisioner "local-exec" {
    command = "echo ${aws_instance.demo_app_api.public_ip} > public_ip.txt"
  }
  
  tags = {
    Name = "demo-app-api"
  }
}