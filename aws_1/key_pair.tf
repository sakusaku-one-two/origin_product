
resource "aws_key_pair" "demo_key_pair" {
  key_name   = "demo_key_pair"
  public_key = file("~/.ssh/demo_key_pair.pem")
}

