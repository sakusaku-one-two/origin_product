

resource "aws_security_group" "demo_app_nginx_sg" {
    name = "demo-app-nginx-sg"
    vpc_id = aws_vpc.demo_app_vpc.id

    ingress {
        from_port = 80
        to_port = 80
        protocol = "tcp"
        cidr_blocks = [aws_subnet.demo_app_public_subnet[0].cidr_block]//ALBが配置されているサブネットからの通信を許可
    }
    
    ingress {
        from_port = 8080
        to_port = 8080
        protocol = "tcp"
        cidr_blocks = [aws_subnet.demo_app_public_subnet[0].cidr_block,
                       aws_subnet.demo_app_public_subnet[1].cidr_block,
                       ]
    }

    ingress {
        from_port = 22
        to_port = 22
        protocol = "tcp"
        cidr_blocks = ["0.0.0.0/0"]
    }

    egress {
        from_port = 0
        to_port = 0
        protocol = "-1"
        cidr_blocks = ["0.0.0.0/0"]
    }
}
