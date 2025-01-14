
//EC2インスタンス　Nginxをインストールする
resource "aws_instance" "demo_app_nginx" {
  ami = "ami-0c55b159cbfafe1f0"
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
    source = "${path.module}/reverce_proxy_server/nginx.conf"
    destination = "/tmp/nginx.conf"
  }

  provisioner "file" {
    source = "${path.module}/../../forntend/front-app/dist"
    destination = "/usr/share/nginx/html"
  }

  provisioner "remote-exec" {
    inline = [
      "sudo mv /tmp/nginx.conf /etc/nginx/nginx.conf",
      "sudo chmod 644 /etc/nginx/nginx.conf",
      "sudo systemctl restart nginx"
    ]
  }

  user_data = templatefile("${path.module}/reverce_proxy_server/user_data.sh", {
    api_server_name = aws_instance.demo_app_api.private_dns
    api_server_private_ip = aws_instance.demo_app_api.private_ip
    target_group_arn = aws_lb_target_group.demo_app_nginx_tg.arn
  })
  user_data_replace_on_change = true

  tags = {
    Name = "demo-app-nginx"
  }
  key_name = aws_key_pair.demo_my_key_pair.key_name
}
