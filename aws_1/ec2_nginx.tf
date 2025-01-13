
//EC2インスタンス　Nginxをインストールする
resource "aws_instance" "demo_app_nginx" {
  ami = "ami-0c55b159cbfafe1f0"
  instance_type = "t2.micro"
  subnet_id = aws_subnet.demo_app_public_subnet[0].id
  vpc_security_group_ids = [aws_security_group.demo_app_nginx_sg.id]
  user_data = templatefile("${path.module}/reverce_proxy_server/user_data.sh", {
    api_server_name = aws_instance.demo_app_api.private_dns
  })
  user_data_replace_on_change = true

  tags = {
    Name = "demo-app-nginx"
  }
  key_name = aws_key_pair.demo_key_pair.key_name
}