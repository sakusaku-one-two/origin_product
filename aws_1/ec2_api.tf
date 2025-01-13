


resource "aws_instance" "demo_app_api" {
  ami = "ami-08f52b2e87cebadd9"
  instance_type = "t2.micro"
  subnet_id = aws_subnet.demo_app_dmz_subnet[0].id
  key_name = aws_key_pair.demo_key_pair.key_name
  security_groups = [aws_security_group.demo_app_api_security_group.id]
  connection {
    type = "ssh"
    host = self.public_ip
    user = "ec2-user"
  }

  provisioner "remote-exec" {
    inline = [
      "sudo apt-get update",
      "wget https://go.dev/dl/go1.23.1.linux-amd64.tar.gz",
      "sudo tar -C /usr/local -xzf go1.23.1.linux-amd64.tar.gz",
      "export PATH=$PATH:/usr/local/go/bin",
      "echo 'export PATH=$PATH:/usr/local/go/bin' >> ~/.bashrc",
      "source ~/.bashrc",
      "go version"
    ]
  }

  provisioner "file" {
    source = "../backend"
    destination = "/home/ubuntu/api"
  }

  provisioner "remote-exec" {
    inline = [
      "cd /home/ubuntu/api",
      "go build -o main main.go"
    ]
  }

  provisioner "local-exec" {
    command = "echo ${aws_instance.demo_app_api.public_ip} > public_ip.txt"
  }
  
  tags = {
    Name = "demo-app-api"
  }
}