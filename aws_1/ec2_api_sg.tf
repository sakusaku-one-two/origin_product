resource "aws_security_group" "demo_app_api_security_group" {
  name        = "demo-app-api-security-group"
  description = "Allow API access"
  vpc_id      = aws_vpc.demo_app_vpc.id

  ingress {
    from_port   = 8080
    to_port     = 8080
    protocol    = "tcp"
    cidr_blocks = [
      aws_subnet.demo_app_dmz_subnet[0].cidr_block,
    #   aws_subnet.demo_app_dmz_subnet[1].cidr_block
    ]
  }

  ingress {
    from_port   = 22
    to_port     = 22
    protocol    = "tcp"
    cidr_blocks = [
      aws_subnet.demo_app_public_subnet[0].cidr_block,
    #   aws_subnet.demo_app_public_subnet[1].cidr_block
    ]
  }

  

  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = [
      aws_subnet.demo_app_dmz_subnet[0].cidr_block,
      aws_subnet.demo_app_dmz_subnet[1].cidr_block,
      aws_subnet.demo_app_private_subnet[0].cidr_block,
      aws_subnet.demo_app_private_subnet[1].cidr_block,
      aws_subnet.demo_app_public_subnet[0].cidr_block,
      aws_subnet.demo_app_public_subnet[1].cidr_block
    ]
  }
}


# resource "aws_security_group_rule" "demo_app_api_sg_rule" {
#   type = "ingress"
#   from_port = 8080
#   to_port = 8080
#   protocol = "tcp"
#   security_group_id = aws_security_group.demo_app_api_security_group.id
#   cidr_blocks = [aws_subnet.demo_app_dmz_subnet[*].cidr_block]
# }