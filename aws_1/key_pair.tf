resource "tls_private_key" "example" {
  algorithm = "RSA"
  rsa_bits  = 2048
}

resource "aws_key_pair" "demo_my_key_pair" {
  key_name   = "demo_my_key_pair"
  public_key = tls_private_key.example.public_key_openssh
}

output "private_key_pem" {
  value     = tls_private_key.example.private_key_pem
  sensitive = true
}

