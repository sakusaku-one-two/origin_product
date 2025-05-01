//EC2インスタンス　Nginxをインストールする
resource "aws_instance" "demo_app_nginx" {
  ami = "ami-08f52b2e87cebadd9"
  instance_type = "t2.micro"
  subnet_id = aws_subnet.demo_app_public_subnet[0].id
  vpc_security_group_ids = [aws_security_group.demo_app_nginx_sg.id]
  associate_public_ip_address = true

  connection {
    type = "ssh"
    host = aws_instance.demo_app_nginx.public_ip
    user = "ec2-user"
    private_key = tls_private_key.example.private_key_pem
    
  }
  provisioner "file" {
    source = "./reverce_proxy_server/user_data.sh"
    destination = "/tmp/user_data.sh"
  }

  provisioner "file" {
    source = "../forntend/front-app/dist"
    destination = "/tmp/dist"
  }

  # provisioner "remote-exec" {
  #   inline = [
  #     "sudo yum install -y nginx",
  #     "sudo mkdir -p /etc/nginx",
  #     "sudo mkdir -p /usr/share/nginx/html",
  #     "sudo mv /tmp/user_data.sh /etc/nginx/user_data.sh",
  #     "sudo chmod 755 /etc/nginx/user_data.sh",
  #     "sudo chmod 644 /etc/nginx/nginx.conf",
  #     "sudo mv /tmp/dist /usr/share/nginx/html",
  #     "sudo bash /etc/nginx/user_data.sh",
  #     "sudo chown -R nginx:nginx /usr/share/nginx/html",
  #     "sudo systemctl enable nginx",
  #     "sudo systemctl start nginx"
  #   ]
  # }

  user_data = <<-EOF
    #!/bin/bash
    sudo yum install -y nginx
    sudo mkdir -p /etc/nginx
    sudo mkdir -p /usr/share/nginx/html
    sudo mv /tmp/user_data.sh /etc/nginx/user_data.sh
    sudo chmod 755 /etc/nginx/user_data.sh
    sudo chmod 644 /etc/nginx/nginx.conf
    sudo mv /tmp/dist /usr/share/nginx/html
    sudo chmod 755 /usr/share/nginx/html/dist
    echo "export API_HOST=${aws_instance.demo_app_api.private_ip}" >> /etc/environment
    echo "export DOMAIN_NAME=${aws_route53_record.demo_app_dns_next.fqdn}" >> /etc/environment
    echo "export API_SERVER_PRIVATE_IP=${aws_instance.demo_app_api.private_ip}" >> /etc/environment
    echo "export TARGET_GROUP_ARN=${aws_lb_target_group.demo_app_nginx_tg.arn}" >> /etc/environment
    echo "export HEALTH_CHECK_PATH=/nginx/health" >> /etc/environment
    sudo chmod 755 /etc/nginx/user_data.sh
    sudo bash /etc/nginx/user_data.sh
    sudo chown -R nginx:nginx /usr/share/nginx/html
    sudo systemctl enable nginx
    sudo systemctl start nginx
  EOF 
  user_data_replace_on_change = true

  tags = {
    Name = "demo-app-nginx"
  }
  key_name = aws_key_pair.demo_my_key_pair.key_name
}
