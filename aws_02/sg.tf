
resource "aws_security_group" "demo_app_sg" {
    name = "demo_app_sg"
    vpc_id = aws_vpc.demo_app_vpc.id
    tags = {
        Name = "demo_app_sg"
    }
}

resource "aws_security_group_rule" "demo_app_sg_rule_https" {
    type = "ingress"
    from_port = 443
    to_port = 443
    protocol = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
    security_group_id = aws_security_group.demo_app_sg.id
    description = "HTTPS from VPC"
}

resource "aws_security_group_rule" "demo_app_sg_rule_ssh" {
    type = "ingress"
    from_port = 22
    to_port = 22
    protocol = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
    security_group_id = aws_security_group.demo_app_sg.id
    description = "SSH from VPC"
}

resource "aws_security_group_rule" "demo_app_sg_rule_http" {
    type = "ingress"
    from_port = 80
    to_port = 80
    protocol = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
    security_group_id = aws_security_group.demo_app_sg.id
    description = "HTTP from VPC"
}

resource "aws_security_group_rule" "demo_app_sg_rule_outbound" {
    type = "egress"
    from_port = 0
    to_port = 0
    protocol = "-1"
    cidr_blocks = ["0.0.0.0/0"]
    security_group_id = aws_security_group.demo_app_sg.id
    description = "Outbound from VPC"
}


